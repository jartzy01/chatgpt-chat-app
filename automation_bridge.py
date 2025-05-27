# Automation Bridge for PyAutoGUI and Selenium
from dotenv import load_dotenv
import os  # ✅ Move this line up here
import pyautogui  # for screen size detection
load_dotenv()
print("API KEY loaded:", os.getenv("OPENAI_API_KEY"))  # ✅ Debug line

from flask import Flask, request, jsonify
import openai
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
Base_Model = "gpt-4"

@app.route('/interpret-and-execute', methods=['POST', 'OPTIONS'])
def interpret_and_execute(): 

    if request.method == 'OPTIONS':
        return '', 204
    
    user_input = request.get_json(force=True).get("message", "")

    try:
        # Determine the type of automation based on user input
        if user_input.startswith("/pyautogui"):
            prompt_type = "pyautogui"
            actual_instruction = user_input.replace("/pyautogui", "").strip()
            # Detect screen dimesions
            width, height = pyautogui.size()
            print(f"Detected screen size: {width}x{height}")
            # Prepare system prompt for PyAutoGUI
            system_prompt = """You are an expert Python PyAutoGUI engineer. Generate a complete, self-contained script that:
            – Imports `pyautogui` and `time`.
            – Detects the screen size via `width, height = pyautogui.size()` and prints it.
            – Uses the exact dimensions when providing fallback coordinates.
            – Locates images with `locateCenterOnScreen('foo.png', confidence=0.8)`.
            – Waits with `time.sleep()` as needed.
            – No comments, no markdown—only runnable Python code.
            Screen resolution is {width}×{height}.
            """
        elif user_input.startswith("/selenium"):
            prompt_type = "selenium"
            actual_instruction = user_input.replace("/selenium", "").strip()
            system_prompt = """You are a senior Selenium engineer. Produce a full Python 3 script that:
            – Installs and uses `webdriver-manager`
            – Imports `Service`, `ChromeOptions`, `By`, `WebDriverWait`, `EC`
            – Initializes Chrome with:
                service = Service(ChromeDriverManager().install())
                driver = webdriver.Chrome(service=service, options=Options())
            – Uses explicit waits (`WebDriverWait`) and robust CSS/XPath locators
            – No comments or markdown, only runnable code
            """
        else:
            return jsonify({"error": "Invalid command. Use /pyautogui or /selenium."}), 400

        # Query the OpenAI API for code generation
        response = client.chat.completions.create(
            model=Base_Model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": actual_instruction}
            ],
        )

        # Clean the model response
        raw_response = response.choices[0].message.content.strip()

        # Remove markdown, comments, or extra instructions
        lines = raw_response.splitlines()
        code_lines = [
            line for line in lines
            if not line.strip().startswith("```")
            and not line.strip().startswith("#")
            and 'note' not in line.lower()
        ]
        cleaned_code = "\n".join(code_lines)

        # Debug output 
        print("[RAW RESPONSE]:\n", raw_response)
        print("[CLEANED CODE]:\n", cleaned_code)

        # Send the cleaned code to the automation server
        r = requests.post("http://localhost:5001/execute-automation", 
        json={
            "code": cleaned_code,
            "type": prompt_type
        })

        print("🔥 /execute-automation response:", r.status_code, r.text)
        return jsonify({
            "generate_code": cleaned_code,
            "execution_response": r.json()
        })
    
    except Exception as e:
        print("Error:", e)
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(port=5002)