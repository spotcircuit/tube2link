import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

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
            value = os.environ[key]
            print(f"- {key}: {value[:10]}...{value[-10:] if len(value) > 20 else value}")

def test_api_key():
    try:
        print("🔄 Loading environment variables...")
        
        # Find all .env files
        env_files = list(Path('.').glob('**/.env*'))
        print(f"Found {len(env_files)} .env files:")
        for f in env_files:
            print(f"  - {f}")
        
        # Load environment variables
        load_dotenv('.env.local')
        
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("❌ OPENAI_API_KEY not found in environment")
            return
            
        print(f"✅ Found API key: {api_key[:10]}...{api_key[-10:]}")
        
        # Test the API
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        response = requests.get(
            'https://api.openai.com/v1/models',
            headers=headers
        )
        
        if response.status_code == 200:
            print("✅ API test successful!")
            models = response.json()['data']
            print(f"\nAvailable models ({len(models)}):")
            for model in models[:5]:  # Show first 5 models
                print(f"- {model['id']}")
            if len(models) > 5:
                print(f"...and {len(models)-5} more")
        else:
            print(f"❌ API test failed with status {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🔧 OpenAI API Environment Debugger")
    print("=" * 40)
    debug_env()
    print("\n" + "=" * 40)
    test_api_key()
