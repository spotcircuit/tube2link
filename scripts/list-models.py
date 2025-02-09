import os
import sys
import json
import requests

def list_models(api_key):
    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

        # Make the GET request to OpenAI's models endpoint
        response = requests.get(
            "https://api.openai.com/v1/models", 
            headers=headers
        )

        # Check if the request was successful
        if response.status_code == 200:
            print("✅ Successfully retrieved models!")
            models = response.json()
            
            # Save to JSON file
            with open('available_models.json', 'w') as f:
                json.dump(models, f, indent=2)
            print("✅ Models saved to available_models.json")
            
            # Print models for quick reference
            print("\nAvailable Models:")
            for model in models['data']:
                print(f"- {model['id']} (owned by {model['owned_by']})")
        else:
            print("❌ Error retrieving models:")
            print(f"Error message: Error code: {response.status_code} - {response.text}")
            
    except Exception as e:
        print("❌ Error:")
        print(f"Error message: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python list-models.py <api_key>")
        sys.exit(1)
    
    api_key = sys.argv[1]
    list_models(api_key)
