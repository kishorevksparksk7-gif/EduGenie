import os
from flask import Flask, render_template, request, jsonify
from google import genai
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask_question():
    data = request.get_json()
    question = data.get('question', '')

    if not question:
        return jsonify({'error': 'Please provide a question.'}), 400

    try:
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=f"Answer this academic question clearly and simply: {question}"
        )
        return jsonify({'answer': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/quiz', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    topic = data.get('topic', '')

    if not topic:
        return jsonify({'error': 'Please provide a topic.'}), 400

    try:
        prompt = f"""
        Create a 5-question multiple-choice quiz on the topic: "{topic}".
        Format each question like:
        Q1. Question text?
        A) Option A
        B) Option B
        C) Option C
        D) Option D
        Answer: B
        """
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        return jsonify({'quiz': response.text})

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)