import os
import json
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env.local
load_dotenv('.env.local')

# Initialize OpenAI client
api_key = os.getenv('OPENAI_API_KEY')
if not api_key:
    raise ValueError("OPENAI_API_KEY not found in .env.local")

client = OpenAI(api_key=api_key)

def generate_quick_summary(preprocessed_data_path: str) -> str:
    # Load preprocessed data
    with open(preprocessed_data_path, 'r') as f:
        data = json.load(f)
    
    # Extract data exactly as in lib/ai.ts
    key_points = data['patterns'].get('key_points', [])[:5]
    key_points = '\n'.join([f"- {p['content']}" for p in key_points]) if key_points else 'No key points found'
    
    patterns = data['patterns'].get('steps', [])[:3]
    patterns = '\n'.join([f"- {p['content']}" for p in patterns]) if patterns else 'No patterns found'
    
    actions = data['semantic'].get('actions', [])[:5]
    actions = '\n'.join([f"- {a['content']}" for a in actions]) if actions else 'No actions found'
    
    roles = data['roles'].get('user', [])[:3]
    roles = '\n'.join([f"- {r['content']}" for r in roles]) if roles else 'No user-related content found'

    # Create the prompt exactly as in lib/ai.ts
    prompt = f"""Create a concise summary of this video content:

Title: {data.get('metadata', {}).get('title', 'Unknown Title')}
Description: {data.get('metadata', {}).get('description', 'No description available')}

Key Points:
{key_points}

Main Patterns:
{patterns}

Key Actions:
{actions}

Target Audience:
{roles}

Format your response in 3 sections:
1. General Overview (2-3 sentences about the main topic and purpose)
2. Key Points (2-3 bullet points of the most important concepts)
3. Technical Details (1-2 sentences about specific tools, methods, or implementation details)

Keep each section focused and avoid repeating information."""

    print("Generating quick summary with GPT-3.5...")
    print("\nPrompt:")
    print("-" * 80)
    print(prompt)
    print("-" * 80)
    
    completion = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {
                "role": "system",
                "content": "You are a technical content summarizer. Create clear summaries that progress from general concepts to specific technical details."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.7,
        max_tokens=300
    )

    summary = completion.choices[0].message.content
    return summary

def main():
    # Path to our preprocessed data
    preprocessed_path = 'test_data/preprocessed.json'
    
    # Generate summary
    summary = generate_quick_summary(preprocessed_path)
    
    # Save summary to a non-gitignored location
    summary_path = 'scripts/generated_summary.txt'
    with open(summary_path, 'w') as f:
        f.write(summary)
    
    print("\nQuick summary generated and saved to scripts/generated_summary.txt")
    print("\nSummary:")
    print("-" * 80)
    print(summary)
    print("-" * 80)

if __name__ == "__main__":
    main()
