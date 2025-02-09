import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv, find_dotenv

def debug_env():
    print("\n🔍 Environment Debug Info:")
    print(f"Current directory: {os.getcwd()}")
    print(f"Script directory: {Path(__file__).parent}")
    print("\nDotenv files found:")
    for env_file in Path('.').glob('**/.env*'):
        print(f"- {env_file}")
    
    print("\nEnvironment variables:")
    for key in sorted(os.environ):
        if 'KEY' in key or 'SECRET' in key:
            print(f"- {key}: [HIDDEN]")
        else:
            value = os.environ[key]
            print(f"- {key}: {value}")

def test_api_key():
    try:
        print("🔄 Loading environment variables...")
        
        # Find all .env files
        env_files = list(Path('.').glob('**/.env*'))
        print(f"Found {len(env_files)} .env files:")
        for env_file in env_files:
            print(f"- {env_file}")
        
        # Load .env.local specifically
        env_path = Path(__file__).parent.parent / '.env.local'
        print(f"\nLoading from: {env_path}")
        load_dotenv(env_path)
        
        # Debug environment after loading
        debug_env()
        
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in .env.local")

        print(f"\nAPI key loaded successfully!")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Define the payload for the API call
        payload = {
            "model": "gpt-3.5-turbo",
            "messages": [
                {
                    "role": "system",
                    "content": "You are a professional LinkedIn content creator who specializes in creating engaging, high-quality posts from video content."
                },
                {
                    "role": "user",
                    "content": "Create a LinkedIn post about AI and automation."
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }

        # Save request parameters
        output_dir = Path(__file__).parent / 'output'
        output_dir.mkdir(exist_ok=True)
        
        with open(output_dir / 'request.json', 'w') as f:
            json.dump({
                'headers': headers,
                'payload': payload
            }, f, indent=2)

        print("\n📝 Saved request parameters to output/request.json")

        # Make the POST request to OpenAI's chat completions endpoint
        print("\n🚀 Making request to OpenAI API...")
        response = requests.post(
            "https://api.openai.com/v1/chat/completions", 
            headers=headers, 
            json=payload
        )

        # Save the response
        with open(output_dir / 'response.json', 'w') as f:
            if response.status_code == 200:
                json.dump(response.json(), f, indent=2)
            else:
                json.dump({
                    'status_code': response.status_code,
                    'error': response.text
                }, f, indent=2)

        # Check if the request was successful
        if response.status_code == 200:
            print("✅ API request successful!")
            print("\nResponse content:", response.json()['choices'][0]['message']['content'])
        else:
            print("❌ API request failed:")
            print(f"Status code: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print("❌ Error:")
        print(f"Message: {str(e)}")

if __name__ == "__main__":
    test_api_key()
