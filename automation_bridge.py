from dotenv import load_dotenv
import os  # ✅ Move this line up here
load_dotenv()
print("API KEY loaded:", os.getenv("OPENAI_API_KEY"))  # ✅ Debug line

from flask import Flask, request, jsonify
import openai
import requests
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
SYSTEM_PROMPT = """
You are a Python automation assistant. Translate user instructions into executable PyAutoGUI code.
Only respond with valid Python code, no explanations.
"""

@app.route('/interpret-and-execute', methods=['POST', 'OPTIONS'])
def interpret_and_execute(): 

    if request.method == 'OPTIONS':
        return '', 204
    
    user_input = request.get_json(force=True).get("message")

    try:

        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_input}
            ]
        )
        py_code = response.choices[0].message.content

        if "pyautogui" not in py_code:
            return jsonify({"error": "No automation code returned"}), 400

        # Forward to local pyautogui server
        r = requests.post("http://localhost:5001/execute-automation", json={"code": py_code})
        return jsonify({"generated_code": py_code, "execution_response": r.json()})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
if __name__ == "__main__":
    app.run(port=5002)