from smart_preprocess import SmartPreprocessor, get_video_id, get_transcript, write_report
import json
import os
from typing import Dict, Any
from dataclasses import dataclass
from enum import Enum

# Test video URL
VIDEO_URL = "https://www.youtube.com/watch?v=y-eEbmNeFZo"

class Template(str, Enum):
    QUESTION = "question"
    STORY = "story"
    ACTION = "action"
    INSIGHT = "insight"
    PROBLEM_SOLUTION = "problem_solution"
    COMPARISON = "comparison"

@dataclass
class PersonalityStyle:
    tone: float  # 0-1: casual to formal
    charm: int   # 0-100
    wit: int     # 0-100
    humor: int   # 0-100
    sarcasm: int # 0-100

    def to_dict(self) -> Dict[str, Any]:
        return {
            "tone": self.tone,
            "personality": {
                "charm": self.charm,
                "wit": self.wit,
                "humor": self.humor,
                "sarcasm": self.sarcasm
            }
        }

# Define test personality styles
PERSONALITY_STYLES = {
    "casual_conversational": PersonalityStyle(
        tone=0.25,     # More casual (0-100)
        charm=70,    # High charm (60-80% recommended)
        wit=50,      # Moderate wit (40-60% recommended)
        humor=60,    # Moderate-high humor (50-70% recommended)
        sarcasm=30   # Low sarcasm (under 40% recommended)
    ),
    "balanced_professional": PersonalityStyle(
        tone=0.5,     # Balanced (0-100)
        charm=65,    # Moderate-high charm
        wit=45,      # Moderate wit
        humor=55,    # Moderate humor
        sarcasm=20   # Low sarcasm
    ),
    "formal_authoritative": PersonalityStyle(
        tone=0.75,     # More formal (0-100)
        charm=60,    # Moderate charm
        wit=40,      # Lower wit
        humor=50,    # Moderate humor
        sarcasm=10   # Very low sarcasm
    )
}

POST_TEMPLATES = {
    "question": {
        "structure": """
1. Hook: Pose an interesting question related to the topic
2. Context: Provide some background information or context
3. Key Points: Highlight 2-3 key points or findings
4. Call-to-Action: Encourage engagement or ask a follow-up question
"""
    },
    "story": {
        "structure": """
1. Hook: Start with a personal anecdote or a surprising fact
2. Story: Share a brief story or example related to the topic
3. Key Points: Highlight 2-3 key points or takeaways
4. Call-to-Action: Encourage engagement or ask a follow-up question
"""
    },
    "action": {
        "structure": """
1. Hook: Start with a thought-provoking question or statement
2. Key Points: Highlight 2-3 key points or actions
3. Call-to-Action: Encourage engagement or ask a follow-up question
4. Additional Tips: Provide additional tips or resources
"""
    },
    "insight": {
        "structure": """
1. Hook: Start with an interesting fact or statistic
2. Key Points: Highlight 2-3 key points or insights
3. Call-to-Action: Encourage engagement or ask a follow-up question
4. Additional Tips: Provide additional tips or resources
"""
    },
    "problem_solution": {
        "structure": """
1. Hook: Start with a problem or challenge
2. Key Points: Highlight 2-3 key points or solutions
3. Call-to-Action: Encourage engagement or ask a follow-up question
4. Additional Tips: Provide additional tips or resources
"""
    },
    "comparison": {
        "structure": """
1. Hook: Start with a comparison or analogy
2. Key Points: Highlight 2-3 key points or differences
3. Call-to-Action: Encourage engagement or ask a follow-up question
4. Additional Tips: Provide additional tips or resources
"""
    }
}

def process_video() -> Dict[str, Any]:
    """Process video and return preprocessed data"""
    # Create test_data directory if it doesn't exist
    os.makedirs('test_data', exist_ok=True)
    
    # Initialize preprocessor
    preprocessor = SmartPreprocessor()
    
    # Get video ID and transcript
    video_id = get_video_id(VIDEO_URL)
    print(f"Processing video: {video_id}")
    
    transcript = get_transcript(video_id)
    print("Got transcript")
    
    # Convert transcript to text
    if isinstance(transcript, list) and isinstance(transcript[0], dict):
        text = ' '.join(entry.get('text', '') for entry in transcript)
    else:
        text = transcript if isinstance(transcript, str) else ' '.join(transcript)
    
    # Preprocess the text
    result = preprocessor.process(text)
    
    # Save raw transcript
    with open('test_data/raw_transcript.json', 'w') as f:
        json.dump(transcript, f, indent=2)
    
    # Save preprocessed data
    with open('test_data/preprocessed.json', 'w') as f:
        json.dump(result, f, indent=2)
    
    # Generate and save report
    write_report(result, 'test_data/preprocessing_report.md')
    
    print("\nPreprocessed data saved in test_data/")
    return result

def test_template(template: Template, style: PersonalityStyle, data: Dict[str, Any]) -> str:
    """Test a specific template with a personality style and return the prompt"""
    print(f"\nGenerating prompt for template: {template.value}")
    print(f"Style: tone={style.tone}, charm={style.charm}, wit={style.wit}, humor={style.humor}, sarcasm={style.sarcasm}")
    
    # Create the prompt using lib/ai.ts format
    settings = style.to_dict()
    
    # Get metadata
    title = data.get('metadata', {}).get('title', 'Unknown Title')
    description = data.get('metadata', {}).get('description', '')
    
    # Get key sections from data
    key_points = data['patterns'].get('key_points', [])[:5]
    key_points = '\n'.join([f"- {p['content']}" for p in key_points]) if key_points else 'No key points found'
    
    patterns = data['patterns'].get('steps', [])[:3]
    patterns = '\n'.join([f"- {p['content']}" for p in patterns]) if patterns else 'No patterns found'
    
    actions = data['semantic'].get('actions', [])[:5]
    actions = '\n'.join([f"- {a['content']}" for a in actions]) if actions else 'No actions found'
    
    # Get template structure
    template_structure = POST_TEMPLATES[template.value]['structure']
    
    # Create prompt
    prompt = f"""Create a LinkedIn post using the following style and content:

Title: {title}
Description: {description}

Key Points:
{key_points}

Main Patterns:
{patterns}

Key Actions:
{actions}

Writing Style:
- Tone: {'Casual' if style.tone < 0.33 else 'Balanced' if style.tone < 0.66 else 'Formal'} (Level: {int(style.tone * 100)}%)
- Charm: {style.charm}% (Warmth and appeal)
- Wit: {style.wit}% (Clever observations)
- Humor: {style.humor}% (Fun and light)
- Sarcasm: {style.sarcasm}% (Ironic edge)

Post Structure ({template.value}):
{template_structure}

Additional Guidelines:
1. Keep it concise (1000-1300 characters)
2. Use line breaks effectively
3. Include 2-3 relevant hashtags
4. Maintain the specified tone and personality
5. Format for maximum engagement
"""
    
    return prompt

def main():
    # Process video first
    data = process_video()
    
    # Test all styles with question template
    template = Template.QUESTION
    all_prompts = []
    
    for style_name, style in PERSONALITY_STYLES.items():
        prompt = test_template(template, style, data)
        all_prompts.append(f"\n{'='*80}\nStyle: {style_name}\n{'='*80}\n{prompt}")
    
    # Save all prompts to a file
    with open('test_data/all_prompts.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(all_prompts))
    
    print("\nAll prompts saved to test_data/all_prompts.txt")

if __name__ == "__main__":
    main()
