from flask import Flask, request, Response
import ollama

app = Flask(__name__)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get("model", "llama3.2:3b")
    prompt = data.get("prompt", "")

    def generate():
        for chunk in ollama.chat(model=model, messages=[{"role": "user", "content": prompt}], stream=True):
            yield chunk["message"]["content"]  # Stream response

    return Response(generate(), content_type="text/plain")

if __name__ == "__main__":
    app.run(debug=True)
