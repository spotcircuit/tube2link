import os
import json
import openai
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)

# Initialize OpenAI client
openai.api_key = os.getenv('OPENAI_API_KEY')
client = openai.OpenAI()

print("\n=== Listing All Batches ===")
try:
    batches = client.batches.list()
    for batch in batches:
        print(f"\nBatch ID: {batch.id}")
        print(json.dumps(batch.model_dump(), indent=2))
except Exception as e:
    print(f"Error listing batches: {e}")
print("=== End Listing ===\n")
