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

# Default imports & setup for generated scripts
default_imports = {
    "pyautogui": [
        "import pyautogui",
        "width, height = pyautogui.size()",
        "import time",
        "import os",
    ],
    "selenium": [
        "from selenium import webdriver",
        "from selenium.webdriver.common.by import By",
        "from selenium.webdriver.chrome.service import Service as ChromeService",
        "from selenium.webdriver.chrome.options import Options",
        "from selenium.webdriver.support.ui import WebDriverWait",
        "from selenium.webdriver.support import expected_conditions as EC",
        "from webdriver_manager.chrome import ChromeDriverManager",
        "import os",
        # ensure headless by default
        "options = Options()",
        "options.add_argument('--headless')",
    ]
}

# Helper to locate images with fallback

def locate_or_fail(filename, confidence=0.8, fallback=None):
    script_dir = os.path.dirname(__file__)
    path = os.path.join(script_dir, filename)
    if not os.path.isfile(path):
        raise FileNotFoundError(f"Required image asset missing: {path}")
    loc = pyautogui.locateCenterOnScreen(path, confidence=confidence)
    if loc:
        return loc
    if fallback is not None:
        return fallback
    # fallback to center of screen
    w, h = pyautogui.size()
    return (w // 2, h // 2)

@app.route('/interpret-and-execute', methods=['POST', 'OPTIONS'])
def interpret_and_execute():
    if request.method == 'OPTIONS':
        return '', 204

    data = request.get_json(force=True)
    user_input = data.get("message", "")

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
            - Detects the screen size and prints it.
            - Interacts with images via locate_or_fail('foo.png', confidence=0.8, fallback=(width//2, height//2)).
            - Uses time.sleep() where needed.
            Screen resolution: {width}×{height}.
        """)
    elif user_input.startswith("/selenium"):
        prompt_type = "selenium"
        actual_instruction = user_input[len("/selenium"):].strip()
        system_prompt = textwrap.dedent("""
            You are a senior Selenium engineer.
            **Respond only with runnable Python code.**
            Generate a full Python 3 script that:
            - Installs and uses webdriver-manager.
            - Imports ChromeService, Options, By, WebDriverWait, EC.
            - Initializes Chrome with service=ChromeService(ChromeDriverManager().install()) and driver=webdriver.Chrome(...).
            - Uses headless mode by default (options.add_argument("--headless")).
            - Uses explicit waits and robust selectors.
        """)
    else:
        return jsonify({"error": "Invalid command. Use /pyautogui or /selenium."}), 400

    # Generate code from OpenAI
    openai_resp = client.chat.completions.create(
        model=Base_Model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": actual_instruction},
        ],
    )
    raw = openai_resp.choices[0].message.content

    # Extract code block or fallback to raw imports
    m = re.search(r"```(?:python)?\s*(.*?)```", raw, re.S)
    if m:
        code_block = m.group(1)
    else:
        code_block = re.sub(r'^[\s\S]*?(?=^import|^from)', '', raw, flags=re.M)

    # Clean lines: remove comments & blanks
    cleaned = [ln for ln in code_block.splitlines() if ln.strip() and not ln.strip().startswith("#")]
    # Remove any stray 'common.service' imports in selenium
    if prompt_type == "selenium":
        cleaned = [ln for ln in cleaned if "selenium.webdriver.common.service" not in ln]

    # Prepend defaults and dedupe
    defaults = default_imports[prompt_type]
    final_lines = defaults + [ln for ln in cleaned if ln not in defaults]
    final_code = "\n".join(final_lines)

    print("[FINAL GENERATED CODE]\n", final_code)

    # Execute on automation server
    try:
        exec_resp = requests.post(
            "http://localhost:5001/execute-automation",
            json={"code": final_code, "type": prompt_type},
            timeout=30
        )
        exec_resp.raise_for_status()
        result = exec_resp.json()
    except Exception as e:
        result = {"error": f"Execution failed: {e}"}

    return jsonify({
        "generated_code": final_code,
        "execution_response": result
    })

if __name__ == "__main__":
    app.run(port=5002)
