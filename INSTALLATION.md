# Installation Guide

This document provides instructions for setting up the "Read with Leo the Puppy" application.

## Prerequisites

- Python 3.8 or later
- Git

## Dependencies

The project requires the following Python packages:
- flask
- flask-sqlalchemy
- email-validator
- openai
- psycopg2-binary

## Installation Steps

1. Clone the repository:
```
git clone https://github.com/dgtrix-ai/read-with-leo.git
cd read-with-leo
```

2. Install dependencies using Replit or your package manager of choice:
```
# If using pip
pip install flask flask-sqlalchemy email-validator openai psycopg2-binary
```

3. Run the application:
```
python app.py
```

4. Open your web browser and navigate to:
```
http://localhost:5000
```

## Configuration

If you want to use OpenAI features, you'll need to set up an environment variable for your API key:

```
# For Linux/Mac
export OPENAI_API_KEY=your_api_key_here

# For Windows
set OPENAI_API_KEY=your_api_key_here
```

## Development

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Troubleshooting

If you encounter issues with speech recognition:
- Ensure your browser supports the Web Speech API
- Check that your microphone is properly connected and has permissions
- Try using Chrome or Edge for best compatibility