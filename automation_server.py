from flask import Flask, request, jsonify
import pyautogui

app = Flask(__name__)

@app.route('/execute-automation', methods=['POST'])
def execute_automation():
    code = request.json.get("code", "")

    # 🧼 Strip markdown if present
    if code.strip().startswith("```"):
        code = "\n".join(line for line in code.splitlines() if not line.strip().startswith("```"))

    print("Executing cleaned code:\n", code)

    try:
        exec(code, {"pyautogui": pyautogui, "__builtins__": __builtins__})
        return jsonify({"status": "success"})
    except Exception as e:
        print("⚠️ Error during execution:", e)
        return jsonify({"status": "error", "details": str(e)}), 400

if __name__ == "__main__":
    app.run(port=5001)