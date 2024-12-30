from flask import Flask, render_template, send_from_directory, jsonify, request
import os
import logging

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY") or "leo-puppy-game-key"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/static/<path:path>')
def serve_static(path):
    return send_from_directory('static', path)

@app.route('/<path:filename>')
def serve_root_files(filename):
    return send_from_directory('.', filename)

@app.route('/api/speech/verify', methods=['POST'])
def verify_speech():
    try:
        data = request.get_json()
        transcript = data.get('transcript', '').lower().strip()
        expected_word = data.get('expected_word', '').lower().strip()

        logger.info(f"Verifying speech - Transcript: {transcript}, Expected: {expected_word}")

        # Simple word matching for now
        # TODO: Integrate with an AI service for better matching
        is_match = transcript == expected_word

        return jsonify({
            'success': True,
            'is_match': is_match,
            'transcript': transcript,
            'expected_word': expected_word
        })
    except Exception as e:
        logger.error(f"Error in speech verification: {str(e)}")
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)