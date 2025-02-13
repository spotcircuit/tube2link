from typing import Dict, List, Any, Optional, Tuple
import os
import json
import openai
from .types import VideoType, VideoMetadata, VIDEO_TEMPLATES, TYPE_FOCUS, CONFIDENCE_THRESHOLDS

def get_openai_client():
    """Initialize OpenAI client."""
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set")
    
    org_id = os.getenv('OPENAI_ORGANIZATION_ID')
    client = openai.OpenAI(
        api_key=api_key,
        organization=org_id
    )
    return client

def generate_type_verification_prompt(
    metadata: VideoMetadata,
    possible_types: List[Dict[str, Any]]
) -> str:
    """Generate prompt for type verification."""
    # Get templates for possible types
    type_templates = []
    for type_info in possible_types:
        video_type = type_info['type']
        if isinstance(video_type, VideoType):
            video_type = str(video_type)
            
        if video_type in VIDEO_TEMPLATES:
            config = VIDEO_TEMPLATES[video_type]
            type_templates.append({
                'type': video_type,
                'template': json.dumps(config['template'], indent=2),
                'systemPrompt': config['systemPrompt']
            })
    
    # Build prompt
    prompt = "You are a specialized video content classifier. Analyze this video content and determine its type.\n"
    prompt += "Choose ONLY from these specific content types, with their exact schema requirements:\n\n"
    
    for template in type_templates:
        prompt += f"Type: {template['type']}\n"
        prompt += f"System Context: {template['systemPrompt']}\n"
        prompt += f"Schema:\n{template['template']}\n\n"
    
    prompt += f"Video Information:\n"
    prompt += f"Title: {metadata['title']}\n"
    prompt += f"Description: {metadata['description']}\n"
    prompt += f"Duration: {metadata['duration']}\n"
    prompt += f"Channel: {metadata['channelTitle']}\n\n"
    
    prompt += "Respond ONLY with the type name that best matches this content, nothing else."
    
    return prompt

def generate_analysis_prompt(
    metadata: VideoMetadata,
    detected_type: VideoType
) -> str:
    """Generate prompt for detailed analysis."""
    video_type = str(detected_type)
    config = VIDEO_TEMPLATES[video_type]
    
    prompt = f"{config['systemPrompt']}\n\n"
    prompt += "Your task is to analyze this video content and generate a structured analysis following this exact schema:\n"
    prompt += json.dumps(config['template'], indent=2) + "\n\n"
    
    prompt += f"Video Information:\n"
    prompt += f"Title: {metadata['title']}\n"
    prompt += f"Description: {metadata['description']}\n"
    prompt += f"Duration: {metadata['duration']}\n"
    prompt += f"Channel: {metadata['channelTitle']}\n\n"
    
    prompt += "Respond ONLY with a valid JSON object matching the schema above. Do not include any other text."
    
    return prompt

def generate_summary_prompt(
    metadata: VideoMetadata,
    detected_type: VideoType
) -> str:
    """Generate prompt for video summary."""
    video_type = str(detected_type)
    config = VIDEO_TEMPLATES[video_type]
    
    prompt = f"{config['systemPrompt']}\n\n"
    prompt += f"Summarize this {video_type} video in a clear and concise way.\n\n"
    
    prompt += f"Video Information:\n"
    prompt += f"Title: {metadata['title']}\n"
    prompt += f"Description: {metadata['description']}\n"
    prompt += f"Duration: {metadata['duration']}\n"
    prompt += f"Channel: {metadata['channelTitle']}\n\n"
    
    if video_type in TYPE_FOCUS:
        focus_points = TYPE_FOCUS[video_type]
        prompt += "Focus on these key aspects:\n"
        for point in focus_points:
            prompt += f"- {point}\n"
    
    prompt += "\nKeep the summary under 200 words."
    
    return prompt

async def verify_video_type(
    metadata: VideoMetadata,
    possible_types: List[Dict[str, Any]]
) -> Tuple[VideoType, float]:
    """Verify video type using OpenAI."""
    client = get_openai_client()
    
    try:
        prompt = generate_type_verification_prompt(metadata, possible_types)
        
        completion = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a specialized video content classifier. Respond ONLY with the exact type name that best matches the content.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            temperature=0.3,
            max_tokens=10
        )

        detected_type = completion.choices[0].message.content.strip().lower()
        
        # Calculate confidence based on token probabilities or use default
        confidence = 0.85 if completion.choices[0].finish_reason == 'stop' else 0.7
        
        return VideoType(detected_type), confidence
        
    except Exception as e:
        print(f"Error verifying video type: {e}")
        # Return highest scoring type from pattern detection as fallback
        return VideoType(possible_types[0]['type']), 0.6

async def generate_video_analysis(
    metadata: VideoMetadata,
    detected_type: VideoType
) -> Dict[str, Any]:
    """Generate detailed video analysis using OpenAI."""
    client = get_openai_client()
    
    try:
        prompt = generate_analysis_prompt(metadata, detected_type)
        
        completion = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a specialized video content analyzer. Generate a structured analysis following the exact schema provided.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            temperature=0.7,
            max_tokens=2000
        )

        return json.loads(completion.choices[0].message.content)
        
    except Exception as e:
        print(f"Error generating video analysis: {e}")
        return {
            'error': 'Failed to generate video analysis',
            'type': str(detected_type)
        }

async def generate_video_summary(
    metadata: VideoMetadata,
    detected_type: VideoType
) -> str:
    """Generate video summary using OpenAI."""
    client = get_openai_client()
    
    try:
        prompt = generate_summary_prompt(metadata, detected_type)
        
        completion = client.chat.completions.create(
            model='gpt-4',
            messages=[
                {
                    'role': 'system',
                    'content': 'You are a specialized video content summarizer. Generate a clear, concise summary focusing on the most relevant aspects for this type of content.'
                },
                {
                    'role': 'user',
                    'content': prompt
                }
            ],
            temperature=0.7,
            max_tokens=500
        )

        return completion.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Error generating video summary: {e}")
        return 'Failed to generate video summary'
