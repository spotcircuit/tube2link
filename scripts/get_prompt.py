import json

# Load preprocessed data
with open('test_data/preprocessed.json', 'r') as f:
    data = json.load(f)

# Clean up text by replacing NN/nadn with n8n
def clean_text(text):
    return text.replace(' NN ', ' n8n ').replace(' nadn ', ' n8n ')

# Override metadata with correct info
data['metadata'] = {
    'title': '9 Best Ways to Scrape Any Website in n8n',
    'description': 'A comprehensive guide covering nine different methods for web scraping using n8n, from basic HTTP requests to advanced cloud-based solutions. Learn how to scrape both static and dynamic websites, with practical demonstrations and API integrations.'
}

# Get the data exactly as in lib/ai.ts
key_points = data['patterns'].get('key_points', [])[:5]
key_points = '\n'.join([f"- {clean_text(p['content'])}" for p in key_points]) if key_points else 'No key points found'

patterns = data['patterns'].get('steps', [])[:3]
patterns = '\n'.join([f"- {clean_text(p['content'])}" for p in patterns]) if patterns else 'No patterns found'

actions = data['semantic'].get('actions', [])[:5]
actions = '\n'.join([f"- {clean_text(a['content'])}" for a in actions]) if actions else 'No actions found'

roles = data['roles'].get('user', [])[:3]
roles = '\n'.join([f"- {clean_text(r['content'])}" for r in roles]) if roles else 'No user-related content found'

# Create the prompt exactly as in lib/ai.ts
prompt = f"""Create a concise summary of this video content:

Title: {data['metadata']['title']}
Description: {data['metadata']['description']}

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

print("\nHere's the exact prompt we use in our flow:\n")
print("-" * 80)
print(prompt)
print("-" * 80)
