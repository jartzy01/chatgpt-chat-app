# automation_server.py
from flask import Flask, request, jsonify
import pyautogui
import traceback
import time

# Selenium and driver manager imports
from selenium import webdriver
from selenium.webdriver.chrome.service import Service as ChromeService
from selenium.webdriver.firefox.service import Service as FirefoxService
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.firefox.options import Options as FirefoxOptions
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from webdriver_manager.firefox import GeckoDriverManager

app = Flask(__name__)

def clean_code(raw_code: str) -> str:
    """
    Strip Markdown fences and comment lines from GPT-generated code.
    """
    cleaned_lines = []
    for line in raw_code.splitlines():
        if line.strip().startswith(('```', '#')):
            continue
        cleaned_lines.append(line)
    return '\n'.join(cleaned_lines)

@app.route('/execute-automation', methods=['POST'])
def execute_automation():
    if request.method == 'OPTIONS':
        return '', 204
    
    payload = request.get_json(force=True)
    print("🔥 /execute-automation hit! Payload:", payload)
    raw_code = payload.get('code', '')
    automation_type = payload.get('type', 'pyautogui').lower()

    # Clean out Markdown and comments
    code = clean_code(raw_code)

    # Prepend imports for PyAutoGUI
    if automation_type == 'pyautogui':
        code = f"import time\nimport pyautogui\n{code}"
        exec_context = {
            'pyautogui': pyautogui,
            'time': time,
            '__builtins__': __builtins__,
        }

    # Set up for Selenium
    else:
        code = 'import time\n' + code
        exec_context = {
            'webdriver': webdriver,
            'By': By,
            'Keys': Keys,
            'ChromeService': ChromeService,
            'FirefoxService': FirefoxService,
            'ChromeOptions': ChromeOptions,
            'FirefoxOptions': FirefoxOptions,
            'ChromeDriverManager': ChromeDriverManager,
            'GeckoDriverManager': GeckoDriverManager,
            'WebDriverWait': WebDriverWait,
            'EC': EC,
            'time': time,
            '__builtins__': __builtins__,
        }

    print("Executing code:\n", code)   
    try:
        exec(code, exec_context)
        return jsonify({"status": "success", "message": "Automation executed successfully."}), 200
    except Exception as e:
        print("Error during execution:", e)
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500
    
if __name__ == "__main__":
    app.run(port=5001)