import re
import textwrap
import os
from dotenv import load_dotenv
import pyautogui
from flask import Flask, request, jsonify
import openai
import requests
from flask_cors import CORS

# Load environment
load_dotenv()
print("API KEY loaded:", os.getenv("OPENAI_API_KEY"))

# Flask app setup
app = Flask(__name__)
CORS(app)

# OpenAI client
client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
Base_Model = "gpt-4"

# Default imports for generated scripts
default_imports = {
    "pyautogui": [
        "import pyautogui",
        "import time",
        "import os",
    ],
    "selenium": [
        "from selenium import webdriver",
        "from selenium.webdriver.common.by import By",
        "from selenium.webdriver.chrome.service import Service",
        "from selenium.webdriver.chrome.options import Options",
        "from selenium.webdriver.support.ui import WebDriverWait",
        "from selenium.webdriver.support import expected_conditions as EC",
        "from webdriver_manager.chrome import ChromeDriverManager",
        "import os",
    ],
}

# Helper to locate images with fallback

def locate_or_fail(filename, confidence=0.8, fallback=None):
    script_dir = os.path.dirname(__file__)
    path = os.path.join(script_dir, filename)
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Required image asset missing: {path}")
    loc = pyautogui.locateCenterOnScreen(path, confidence=confidence)
    return loc if loc else fallback

@app.route('/interpret-and-execute', methods=['POST', 'OPTIONS'])
def interpret_and_execute():
    if request.method == 'OPTIONS':
        return '', 204

    user_input = request.get_json(force=True).get("message", "")

    # Build system prompt based on command
    if user_input.startswith("/pyautogui"):
        prompt_type = "pyautogui"
        actual_instruction = user_input[len("/pyautogui"):].strip()
        width, height = pyautogui.size()
        print(f"Detected screen size: {width}x{height}")
        system_prompt = textwrap.dedent(f"""
            You are an expert Python PyAutoGUI engineer.
            **Respond only with runnable Python code.**
            Use the locate_or_fail helper provided by the bridge.
            Generate a self-contained script that:
            – Detects the screen size and prints it.
            – Interacts with images via locate_or_fail('foo.png', confidence=0.8, fallback=(width//2, height//2)).
            – Uses time.sleep() where needed.
            Screen resolution: {width}×{height}.
        """
        )
    elif user_input.startswith("/selenium"):
        prompt_type = "selenium"
        actual_instruction = user_input[len("/selenium"):].strip()
        system_prompt = textwrap.dedent("""
            You are a senior Selenium engineer.
            **Respond only with runnable Python code.**
            Generate a full Python 3 script that:
            – Installs and uses webdriver-manager.
            – Imports Service, ChromeOptions, By, WebDriverWait, EC.
            – Initializes Chrome with service = Service(ChromeDriverManager().install()) and driver = webdriver.Chrome(...).
            – Uses explicit waits and robust selectors.
        """
        )
    else:
        return jsonify({"error": "Invalid command. Use /pyautogui or /selenium."}), 400

    # Generate code
    openai_resp = client.chat.completions.create(
        model=Base_Model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": actual_instruction},
        ],
    )
    raw = openai_resp.choices[0].message.content

    # Extract code block or strip to first import
    m = re.search(r"```(?:python)?\s*(.*?)```", raw, re.S)
    if m:
        code_block = m.group(1)
    else:
        code_block = re.sub(r'^[\s\S]*?(?=^import|^from)', '', raw, flags=re.M)

    # Clean lines: remove comments & blanks
    cleaned_lines = [
        ln for ln in code_block.splitlines()
        if ln.strip() and not ln.strip().startswith("#")
    ]

    # Prepend defaults and remove duplicates
    defaults = default_imports[prompt_type]
    final_lines = defaults + [ln for ln in cleaned_lines if ln not in defaults]

    final_code = "\n".join(final_lines)

    print("[FINAL GENERATED CODE]\n", final_code)

    # Execute
    exec_resp = requests.post(
        "http://localhost:5001/execute-automation",
        json={"code": final_code, "type": prompt_type}
    )

    return jsonify({
        "generated_code": final_code,
        "execution_response": exec_resp.json()
    })

if __name__ == "__main__":
    app.run(port=5002)
