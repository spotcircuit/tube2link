# -*- coding: utf-8 -*-
import json
import os
from enum import Enum
from typing import Dict, Any, List
from dataclasses import dataclass

# Test video URL
VIDEO_URL = "https://www.youtube.com/watch?v=y-eEbmNeFZo"

TEMPLATE_CONTEXT = {
    'question': '''
A question-based post creates engagement by:
1. Opening with a thought-provoking industry question that hooks readers
2. Highlighting a common challenge or misconception
3. Sharing valuable insights that address the question
4. Supporting with concrete examples from the video
5. Closing with a discussion-sparking question

Example hook questions:
- "Ever wondered why some web scraping tasks take 10x longer than others?"
- "What if you could automate any website interaction without writing complex code?"
- "Why do 80% of web scraping projects fail when dealing with dynamic sites?"
''',
    'story': '''
A story-based post builds connection through:
1. Opening with a relatable situation ("I used to struggle with...")
2. Describing the journey of discovery
3. Sharing the key learnings and insights
4. Explaining how it transformed your approach
5. Inviting others to share their experiences

Example opening:
"Last week, I spent 6 hours battling with a web scraping task that should've taken 30 minutes. Then I discovered something that completely changed my approach..."
''',
    'action': '''
An action-oriented post drives implementation by:
1. Starting with a clear, achievable goal
2. Explaining why this matters right now
3. Outlining specific, actionable steps
4. Providing a concrete example of success
5. Motivating immediate action

Example opening:
"Here's how to set up your first automated web scraper in n8n in under 10 minutes, even if you've never written a line of code..."
''',
    'insight': '''
An insight-based post challenges thinking by:
1. Leading with a surprising fact or statistic
2. Explaining why this matters to your audience
3. Sharing deeper technical understanding
4. Backing claims with evidence
5. Offering a new perspective

Example opening:
"Did you know that 90% of web scraping code is unnecessary? Here's why modern automation tools are changing everything..."
''',
    'problem_solution': '''
A problem-solution post demonstrates expertise by:
1. Identifying a specific technical challenge
2. Explaining its impact on productivity
3. Introducing a novel solution approach
4. Walking through implementation details
5. Showing clear benefits and results

Example opening:
"Dynamic websites with heavy JavaScript used to be a nightmare to scrape. Here's how modern tools are making it surprisingly simple..."
''',
    'comparison': '''
A comparison post aids decision-making by:
1. Introducing different approaches clearly
2. Establishing fair comparison criteria
3. Analyzing pros and cons objectively
4. Supporting with real-world examples
5. Guiding practical choice

Example opening:
"HTTP requests vs. Browser automation vs. API integration - here's what you need to know about modern web scraping approaches..."
'''
}

BASE_PROMPT = '''You are writing a LinkedIn post about a technical tutorial video. The post should be engaging, informative, and encourage discussion.

For this post, use a question-based format that:
1. Opens with a thought-provoking industry question that hooks readers
2. Highlights a common challenge or misconception
3. Shares valuable insights that address the question
4. Supports with concrete examples from the video
5. Closes with a discussion-sparking question

Example hook questions for inspiration:
- "Ever wondered why some web scraping tasks take 10x longer than others?"
- "What if you could automate any website interaction without writing complex code?"
- "Why do 80% of web scraping projects fail when dealing with dynamic sites?"

{dynamic_content}

Format Requirements:
- Length: 1000-1300 characters
- Structure: Short, scannable paragraphs
- Include: 2-3 relevant hashtags
- End with: Video link and call to action'''

class Template(str, Enum):
    QUESTION = "question"
    STORY = "story"
    ACTION = "action"
    INSIGHT = "insight"
    PROBLEM_SOLUTION = "problem_solution"
    COMPARISON = "comparison"

class Tone(Enum):
    FORMAL = 1
    CASUAL = 2
    PROFESSIONAL = 3
    FRIENDLY = 4

@dataclass
class PersonalityStyle:
    tone: Tone  # Tone of the writing
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
        tone=Tone.CASUAL,   # More casual (0-100)
        charm=70,    # High charm (60-80% recommended)
        wit=50,      # Moderate wit (40-60% recommended)
        humor=60,    # Moderate-high humor (50-70% recommended)
        sarcasm=30   # Low sarcasm (under 40% recommended)
    ),
    "balanced_professional": PersonalityStyle(
        tone=Tone.PROFESSIONAL,    # Balanced (0-100)
        charm=65,    # Moderate-high charm
        wit=45,      # Moderate wit
        humor=55,    # Moderate humor
        sarcasm=20   # Low sarcasm
    ),
    "formal_authoritative": PersonalityStyle(
        tone=Tone.FORMAL,   # More formal (0-100)
        charm=60,    # Moderate charm
        wit=40,      # Lower wit
        humor=50,    # Moderate humor
        sarcasm=10   # Very low sarcasm
    )
}

# Define templates matching lib/ai.ts
POST_TEMPLATES = {
    "question": {
        "name": "Question-Based",
        "context": '''
A question-based post creates engagement by:
1. Opening with a thought-provoking industry question that hooks readers
2. Highlighting a common challenge or misconception
3. Sharing valuable insights that address the question
4. Supporting with concrete examples from the video
5. Closing with a discussion-sparking question

Example hook questions:
- "Ever wondered why some web scraping tasks take 10x longer than others?"
- "What if you could automate any website interaction without writing complex code?"
- "Why do 80% of web scraping projects fail when dealing with dynamic sites?"
'''
    },
    "story": {
        "name": "Story-Based",
        "context": '''
A story-based post builds connection through:
1. Opening with a relatable situation ("I used to struggle with...")
2. Describing the journey of discovery
3. Sharing the key learnings and insights
4. Explaining how it transformed your approach
5. Inviting others to share their experiences

Example opening:
"Last week, I spent 6 hours battling with a web scraping task that should've taken 30 minutes. Then I discovered something that completely changed my approach..."
'''
    },
    "action": {
        "name": "Action-Oriented",
        "context": '''
An action-oriented post drives implementation by:
1. Starting with a clear, achievable goal
2. Explaining why this matters right now
3. Outlining specific, actionable steps
4. Providing a concrete example of success
5. Motivating immediate action

Example opening:
"Here's how to set up your first automated web scraper in n8n in under 10 minutes, even if you've never written a line of code..."
'''
    },
    "insight": {
        "name": "Insight-Based",
        "context": '''
An insight-based post challenges thinking by:
1. Leading with a surprising fact or statistic
2. Explaining why this matters to your audience
3. Sharing deeper technical understanding
4. Backing claims with evidence
5. Offering a new perspective

Example opening:
"Did you know that 90% of web scraping code is unnecessary? Here's why modern automation tools are changing everything..."
'''
    },
    "problem_solution": {
        "name": "Problem-Solution",
        "context": '''
A problem-solution post demonstrates expertise by:
1. Identifying a specific technical challenge
2. Explaining its impact on productivity
3. Introducing a novel solution approach
4. Walking through implementation details
5. Showing clear benefits and results

Example opening:
"Dynamic websites with heavy JavaScript used to be a nightmare to scrape. Here's how modern tools are making it surprisingly simple..."
'''
    },
    "comparison": {
        "name": "Comparison",
        "context": '''
A comparison post aids decision-making by:
1. Introducing different approaches clearly
2. Establishing fair comparison criteria
3. Analyzing pros and cons objectively
4. Supporting with real-world examples
5. Guiding practical choice

Example opening:
"HTTP requests vs. Browser automation vs. API integration - here's what you need to know about modern web scraping approaches..."
'''
    }
}

def load_metadata():
    """Load video metadata and preprocessed data"""
    # Load preprocessed data
    with open('test_data/preprocessed.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Override with correct metadata
    data['metadata'] = {
        'title': '9 Best Ways to Scrape Any Website in n8n',
        'channelTitle': 'Nick Surve',
        'description': 'A comprehensive guide covering nine different methods for web scraping using n8n, from basic HTTP requests to advanced cloud-based solutions. Learn how to scrape both static and dynamic websites, with practical demonstrations and API integrations.',
        'videoId': 'dQw4w9WgXcQ'  # Replace with actual video ID
    }
    
    return data

def get_tone_label(tone):
    """Get a human-readable label for the tone"""
    return {
        Tone.FORMAL: 'formal',
        Tone.CASUAL: 'casual',
        Tone.PROFESSIONAL: 'professional',
        Tone.FRIENDLY: 'friendly'
    }.get(tone, 'balanced')

def clean_content(text: str) -> str:
    """Clean up content by removing filler words and informal speech"""
    # Remove filler words and clean up text
    fillers = [
        'um', 'uh', 'like', 'you know', 'basically', 'kind of', 'sort of', 'just',
        'actually', 'gonna', 'going to', 'wanna', 'want to', 'right', 'okay',
        'so basically', 'you see', 'i mean', 'you guys', "i'm going to", "i'm gonna",
        'we have', "we're going to", "let's", "that's", "it's", "there's",
        'this is', 'what we have', 'what you do', 'all right', 'yeah', 'but yeah',
        'and then', 'here we go', 'as you can see', "i'll", "i'm", "we're", "let me",
        'scroll', 'down here', 'down there', 'over here', 'you all', "we'll"
    ]
    
    # Convert to lowercase for cleaning
    cleaned = text.lower()
    
    # Remove filler words
    for filler in fillers:
        cleaned = cleaned.replace(f' {filler} ', ' ')
    
    # Fix common transcription issues
    cleaned = cleaned.replace('nn', 'n8n')
    cleaned = cleaned.replace('nadn', 'n8n')
    cleaned = cleaned.replace('con8nect', 'connect')
    cleaned = cleaned.replace('g pt', 'gpt')
    
    # Clean up whitespace
    cleaned = ' '.join(cleaned.split())
    
    # Remove repeated words
    words = cleaned.split()
    cleaned = ' '.join(word for i, word in enumerate(words) if i == 0 or word != words[i-1])
    
    # Capitalize first letter of sentences
    cleaned = '. '.join(s.strip().capitalize() for s in cleaned.split('.') if s.strip())
    
    return cleaned

def get_top_items(items: list, key: str = 'content', importance_key: str = 'importance', limit: int = 3) -> str:
    """Get top items sorted by importance"""
    if not items:
        return 'No items available'
    
    # Sort by importance if available
    if importance_key in items[0]:
        items = sorted(items, key=lambda x: float(x.get(importance_key, 0)), reverse=True)
    
    # Get top N items and clean content
    top_items = items[:limit]
    return '\n'.join([
        f"• {clean_content(item[key])} " + 
        (f"(Impact: {int(float(item.get(importance_key, 0)) * 100)}%)" if importance_key in item else "")
        for item in top_items
    ])

def get_preprocessed_data(data: Dict[str, Any]) -> str:
    """Extract and format preprocessed data"""
    patterns = data.get('patterns', {})
    semantic = data.get('semantic', {})
    roles = data.get('roles', {})
    
    sections = []
    
    # Get key steps (limit to 2 for focus)
    steps = patterns.get('steps', [])
    if steps:
        sections.append("Key Workflow:")
        for step in steps[:2]:
            content = clean_content(step['content'])
            context_before = clean_content(step.get('context_before', ''))
            context_after = clean_content(step.get('context_after', ''))
            sections.append(f"• {content}\n  Context: {context_before} ➔ {context_after}")
    
    # Get semantic patterns
    if semantic.get('problems'):
        sections.append("\nChallenges to Address:")
        sections.append(get_top_items(semantic['problems'], limit=2))
    
    if semantic.get('comparisons'):
        sections.append("\nKey Comparisons:")
        sections.append(get_top_items(semantic['comparisons'], limit=2))
    
    # Get role-specific insights (limit to 1 each for focus)
    if roles.get('user'):
        sections.append("\nAudience Perspective:")
        user_items = []
        for item in roles['user'][:1]:
            content = clean_content(item['content'])
            patterns = item.get('matched_patterns', [])
            if patterns:
                content += f" (Behaviors: {', '.join(patterns)})"
            user_items.append(f"• {content}")
        sections.append('\n'.join(user_items))
    
    if roles.get('developer'):
        sections.append("\nTechnical Perspective:")
        sections.append(get_top_items(roles['developer'], limit=1))
    
    return '\n\n'.join(sections)

def get_video_topic(data):
    """Extract the main topic of the video from the data"""
    # Get the title and first few sentences
    title = data.get('title', '').lower()
    description = data.get('description', '').lower()
    
    # Look for key topic indicators
    if 'tutorial' in title or 'tutorial' in description:
        return 'tutorial'
    elif 'review' in title or 'review' in description:
        return 'review'
    elif 'unboxing' in title or 'unboxing' in description:
        return 'unboxing'
    elif 'taste test' in title or 'taste test' in description:
        return 'taste test'
    else:
        return 'informational'

def get_topic_specific_context(topic):
    """Get context specific to the video topic"""
    contexts = {
        'tutorial': {
            'intro': "You are writing a LinkedIn post about a detailed tutorial video. The post should be educational and highlight key learnings.",
            'format': [
                "1. Opening with a practical challenge the tutorial solves",
                "2. Highlighting the main solution approach",
                "3. Sharing key technical insights",
                "4. Providing implementation tips",
                "5. Ending with results and benefits"
            ]
        },
        'review': {
            'intro': "You are writing a LinkedIn post about a product review video. The post should be analytical and highlight key findings.",
            'format': [
                "1. Opening with the reviewed item's significance",
                "2. Highlighting standout features",
                "3. Sharing balanced pros/cons",
                "4. Providing practical use cases",
                "5. Ending with recommendations"
            ]
        },
        'unboxing': {
            'intro': "You are writing a LinkedIn post about an unboxing experience video. The post should capture excitement and first impressions.",
            'format': [
                "1. Building anticipation about the product",
                "2. Highlighting packaging and presentation",
                "3. Sharing initial reactions",
                "4. Noting unique features",
                "5. Ending with early verdict"
            ]
        },
        'taste test': {
            'intro': "You are writing a LinkedIn post about a food tasting video. The post should be descriptive and engaging.",
            'format': [
                "1. Setting up the tasting experience",
                "2. Describing flavors and textures",
                "3. Comparing varieties",
                "4. Sharing surprising findings",
                "5. Ending with recommendations"
            ]
        },
        'informational': {
            'intro': "You are writing a LinkedIn post about an informative video. The post should be insightful and value-focused.",
            'format': [
                "1. Opening with an intriguing fact",
                "2. Highlighting key discoveries",
                "3. Sharing practical applications",
                "4. Providing context",
                "5. Ending with takeaways"
            ]
        }
    }
    return contexts.get(topic, contexts['informational'])

def generate_prompt(data, template, style):
    """Generate a prompt for creating a LinkedIn post"""
    # Get video topic and context
    topic = get_video_topic(data)
    context = get_topic_specific_context(topic)
    
    # Extract key information from metadata
    metadata = data.get('metadata', {})
    title = metadata.get('title', '')
    channel = metadata.get('channelTitle', '')
    description = clean_content(metadata.get('description', ''))
    video_id = metadata.get('videoId', '')
    
    # Get key sections
    actions = data.get('semantic', {}).get('actions', [])
    key_points = data.get('patterns', {}).get('key_points', [])
    examples = data.get('patterns', {}).get('examples', [])
    
    # Get cleaned top items
    top_actions = get_top_items(actions, limit=3)
    top_key_points = get_top_items(key_points, limit=3)
    top_examples = get_top_items(examples, limit=2)
    
    # Format context list
    format_list = '\n'.join(context['format'])
    
    # Build the prompt
    prompt = f"""
{context['intro']}

Video Details:
Title: {title}
Channel: {channel}
Description: {description}

Key Insights:
{top_actions}

Main Points:
{top_key_points}

Examples & Implementation:
{top_examples}

Additional Context:
{get_preprocessed_data(data)}

Post Structure ({template.name}):
{format_list}

Writing Style:
- Voice: {get_tone_label(style.tone)}
- Connection: {style.charm}% personal and relatable
- Wit: {style.wit}% clever and sharp
- Humor: {style.humor}% light and fun
- Sarcasm: {style.sarcasm}% subtle irony

Guidelines:
1. Keep it concise (1000-1300 characters)
2. Use line breaks effectively
3. Include 2-3 relevant hashtags
4. Maintain the specified tone and personality
5. Format for maximum engagement
6. End with the video link

Video Link: https://youtu.be/{video_id}
"""
    return prompt

def main():
    """Main function to test prompts"""
    # Load data
    data = load_metadata()
    
    # Test different templates and styles
    templates = [
        Template.QUESTION,
        Template.STORY,
        Template.ACTION,
        Template.INSIGHT,
        Template.PROBLEM_SOLUTION,
        Template.COMPARISON
    ]
    
    style = PersonalityStyle(
        tone=Tone.PROFESSIONAL,  # Professional but approachable
        charm=70,  # Warm and engaging
        wit=60,    # Clever but not too clever
        humor=40,  # Light touches of humor
        sarcasm=20 # Very minimal sarcasm
    )
    
    # Generate prompts for each template
    with open('test_data/ai_prompts.txt', 'w', encoding='utf-8') as f:
        for template in templates:
            prompt = generate_prompt(data, template, style)
            f.write(f"\n{'='*80}\n")
            f.write(f"Template: {template.value}\n")
            f.write(f"{'='*80}\n\n")
            f.write(prompt)
            f.write("\n\n")

if __name__ == "__main__":
    main()
