import os
import json
import argparse
import sys
from typing import Dict, Any, Optional
from googleapiclient.discovery import build
from datetime import datetime
from pathlib import Path

# Load environment variables from .env file
def load_env():
    env_path = Path(__file__).parent.parent / '.env.local'
    if env_path.exists():
        print("Loading environment variables from .env.local")
        with open(env_path) as f:
            for line in f:
                if line.strip() and not line.startswith('#'):
                    key, value = line.strip().split('=', 1)
                    os.environ[key] = value.strip('"').strip("'")
    else:
        print("No .env.local file found")

# Load environment variables at startup
load_env()

# Video type patterns from TypeScript - exact copy
PATTERNS = {
    'tutorial': {
        'high': r'how to code|programming tutorial|coding guide|step by step guide|complete tutorial',
        'medium': r'learn programming|dev tutorial|coding basics|explained|basics|beginners',
        'low': r'code tips|programming tricks|lesson|understand|examples'
    },
    'review': {
        'high': r'review|unboxing|vs|compared|worth it|hands on review',
        'medium': r'pros|cons|better than|should you buy|comparison|first look',
        'low': r'experience with|thoughts on|testing|impressions|overview'
    },
    'commentary': {
        'high': r'reaction|analysis|breakdown|discussing|deep dive',
        'medium': r'thoughts on|perspective|opinion|takes|discussing',
        'low': r'talking about|reacting to|commentary|thoughts|views'
    },
    'news': {
        'high': r'breaking news|news update|latest developments|official announcement',
        'medium': r'latest|update|situation|development|announcement|report',
        'low': r'current|today|coverage|story|information'
    },
    'lifestyle': {
        'high': r'day in the life|morning routine|what i eat|lifestyle change',
        'medium': r'life|journey|adventure|trying|daily routine',
        'low': r'routine|daily|lifestyle|living|experience'
    },
    'educational': {
        'high': r'course lecture|university class|academic|full course|comprehensive guide',
        'medium': r'study materials|learning module|curriculum|theory|concepts',
        'low': r'education|school|college|learning|study'
    },
    'demo': {
        'high': r'product demo|feature showcase|preview|walkthrough|demonstration',
        'medium': r'new features|capabilities|introducing|showcase|preview',
        'low': r'new release|coming soon|sneak peek|look at|tour'
    },
    'entertainment': {
        'high': r'vlog|fun|comedy|skit|prank|funny moments',
        'medium': r'entertainment|reaction|gaming|playing|fun',
        'low': r'moments|highlights|compilation|best of|plays'
    },
    'howto': {
        'high': r'diy|how to make|how to build|craft|step by step',
        'medium': r'project|create|build|make|instructions|guide',
        'low': r'homemade|handmade|tutorial|guide|tips'
    }
}

# Channel patterns from TypeScript - exact copy
CHANNEL_PATTERNS = {
    'tutorial': r'tutorials|programming|coding|development|tech tutorials',
    'review': r'reviews|tech|gadgets|consumer|testing|unboxing',
    'commentary': r'analysis|commentary|reactions|discussions|thoughts',
    'news': r'news|politics|current events|updates|coverage|breaking',
    'lifestyle': r'vlog|life|living|daily|routine|travel|lifestyle',
    'educational': r'education|university|academy|learning|school|courses',
    'demo': r'product|showcase|preview|demos|official',
    'entertainment': r'entertainment|gaming|fun|comedy|plays|moments',
    'howto': r'diy|crafts|making|projects|how-to|crafting'
}

# Test video IDs with known types and expected technical details
TEST_VIDEOS = {
    'Pf9sxgKaZLE': {  # Celebrity news video
        'type': 'news',
        'expected_technical_details': {
            'duration': '1:00',
            'quality': 'hd',
            'hasCaptions': False
        }
    },
    'A3AsVAZ7wIs': {  # Business tutorial with ChatGPT
        'type': 'tutorial',
        'expected_technical_details': {
            'duration': '10:00',
            'quality': 'hd',
            'hasCaptions': True
        }
    }
}

def get_youtube_client():
    """Initialize YouTube API client."""
    api_key = os.getenv('YOUTUBE_API_KEY') or os.getenv('NEXT_PUBLIC_YT_API_KEY')
    if not api_key:
        raise ValueError("No YouTube API key found. Set either YOUTUBE_API_KEY or NEXT_PUBLIC_YT_API_KEY in .env.local")
    return build('youtube', 'v3', developerKey=api_key)

def format_duration(duration: str) -> str:
    """Convert YouTube duration format to readable format."""
    import re
    match = re.match(r'PT(\d+H)?(\d+M)?(\d+S)?', duration)
    if not match:
        return "0:00"
    
    hours = minutes = seconds = 0
    for group in match.groups():
        if group:
            if group.endswith('H'):
                hours = int(group[:-1])
            elif group.endswith('M'):
                minutes = int(group[:-1])
            elif group.endswith('S'):
                seconds = int(group[:-1])
    
    if hours:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    return f"{minutes}:{seconds:02d}"

def get_video_metadata(youtube, video_id: str) -> Dict[str, Any]:
    """Fetch video metadata from YouTube API."""
    try:
        # Get video details
        video_response = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=video_id
        ).execute()

        if not video_response.get('items'):
            print(f"No video found with ID: {video_id}")
            return None

        video = video_response['items'][0]
        snippet = video.get('snippet', {})
        content_details = video.get('contentDetails', {})
        statistics = video.get('statistics', {})

        # Clean and format metadata
        title = snippet.get('title', '').strip()
        description = snippet.get('description', '').strip()
        channel_title = snippet.get('channelTitle', '').strip()

        # Format metadata
        metadata = {
            'videoId': video_id,
            'title': title if title else 'Untitled Video',
            'description': description if description else '',
            'channelTitle': channel_title if channel_title else 'Unknown Channel',
            'publishedAt': snippet.get('publishedAt', ''),
            'duration': format_duration(content_details.get('duration', 'PT0S')),
            'viewCount': int(statistics.get('viewCount', 0)),
            'likeCount': int(statistics.get('likeCount', 0)),
            'commentCount': int(statistics.get('commentCount', 0)),
            'tags': [tag.strip() for tag in snippet.get('tags', []) if tag.strip()],
            'category': snippet.get('categoryId', ''),
            'defaultLanguage': snippet.get('defaultLanguage', 'en'),
            'defaultAudioLanguage': snippet.get('defaultAudioLanguage', 'en'),
            'hasCaptions': content_details.get('caption', 'false') == 'true',
            'quality': content_details.get('definition', 'sd'),
            'platform': 'YouTube'
        }

        return metadata

    except Exception as e:
        print(f"Error fetching video metadata: {e}")
        return None

def detect_video_type(metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Detect video type using pattern matching."""
    import re
    
    scores = {vtype: 0.0 for vtype in PATTERNS.keys()}
    signals = []
    
    # Check title and description against patterns
    title = metadata.get('title', '').lower()
    description = metadata.get('description', '').lower()
    channel = metadata.get('channelTitle', '').lower()
    tags = [t.lower() for t in metadata.get('tags', [])]
    
    for vtype, patterns in PATTERNS.items():
        # Check title (weight: 0.6)
        if re.search(patterns['high'], title, re.I):
            scores[vtype] += 0.6
            signals.append({
                'source': 'title_match',
                'type': vtype,
                'score': 0.6,
                'reason': f"High confidence pattern match in title"
            })
        elif re.search(patterns['medium'], title, re.I):
            scores[vtype] += 0.3
            signals.append({
                'source': 'title_match',
                'type': vtype,
                'score': 0.3,
                'reason': f"Medium confidence pattern match in title"
            })
            
        # Check description (weight: 0.4)
        if re.search(patterns['high'], description, re.I):
            scores[vtype] += 0.4
            signals.append({
                'source': 'description_match',
                'type': vtype,
                'score': 0.4,
                'reason': f"High confidence pattern match in description"
            })
        elif re.search(patterns['medium'], description, re.I):
            scores[vtype] += 0.2
            signals.append({
                'source': 'description_match',
                'type': vtype,
                'score': 0.2,
                'reason': f"Medium confidence pattern match in description"
            })
            
        # Check tags (weight: 0.2 per tag)
        tag_matches = sum(1 for tag in tags if 
            re.search(patterns['high'], tag, re.I) or 
            re.search(patterns['medium'], tag, re.I))
        if tag_matches:
            score = min(0.4, tag_matches * 0.2)  # Cap at 0.4
            scores[vtype] += score
            signals.append({
                'source': 'tag_match',
                'type': vtype,
                'score': score,
                'reason': f"Found {tag_matches} relevant tags"
            })
            
        # Check channel name (weight: 0.4)
        if re.search(CHANNEL_PATTERNS[vtype], channel, re.I):
            scores[vtype] += 0.4
            signals.append({
                'source': 'channel_match',
                'type': vtype,
                'score': 0.4,
                'reason': f"Channel name matches {vtype} pattern"
            })
    
    # Get the highest scoring type
    detected_type = max(scores.items(), key=lambda x: x[1])
    confidence = detected_type[1]
    
    # Normalize confidence to 0-1 range
    max_possible_score = 1.8  # 0.6 (title) + 0.4 (desc) + 0.4 (tags) + 0.4 (channel)
    confidence = min(1.0, confidence / max_possible_score)
    
    return {
        'type': detected_type[0],
        'confidence': confidence,
        'signals': signals,
        'needsAIVerification': confidence < 0.8
    }

def save_metadata(data: Dict[str, Any], output_dir: str, video_id: str = None):
    """Save data to a file."""
    os.makedirs(output_dir, exist_ok=True)
    
    # Use provided video_id or try to get it from data
    vid = video_id or data.get('video_id') or data.get('videoId', 'unknown')
    
    filename = f"{vid}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    filepath = os.path.join(output_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2)
    print(f"Saved data to {filepath}")

async def test_video_analysis(video_id: str):
    """Test video analysis system for a single video."""
    print(f"\nTesting video: {video_id}")
    
    # Get test expectations
    test_info = TEST_VIDEOS[video_id]
    expected_type = test_info['type']
    
    try:
        # Get video metadata
        youtube = get_youtube_client()
        metadata = get_video_metadata(youtube, video_id)
        if not metadata:
            print(f"Failed to get metadata for video {video_id}")
            return
            
        # Save raw metadata
        save_metadata(metadata, 'raw_metadata', video_id)
        
        # Print video info
        print("\nVideo Information:")
        print(f"Title: {metadata['title']}")
        print(f"Channel: {metadata['channelTitle']}")
        if metadata['tags']:
            print(f"Tags: {', '.join(metadata['tags'])}")
        else:
            print("Tags: None")
        
        # Detect video type
        detection = detect_video_type(metadata)
        
        # Print detection results
        print(f"\nType Detection Results:")
        print(f"Detected type: {detection['type']} (confidence: {detection['confidence']:.2f})")
        print(f"Expected type: {expected_type}")
        print(f"Result: {'✓ Correct' if detection['type'] == expected_type else '✗ Incorrect'}")
        
        # Print detection signals
        if detection['signals']:
            print("\nDetection Signals:")
            for signal in sorted(detection['signals'], key=lambda x: x['score'], reverse=True):
                print(f"  - {signal['source']}: {signal['type']} ({signal['score']:.2f}) - {signal['reason']}")
        else:
            print("\nNo detection signals found")
        
        # Save results
        results = {
            'video_id': video_id,
            'timestamp': datetime.now().isoformat(),
            'metadata': {
                'title': metadata['title'],
                'description': metadata['description'],
                'tags': metadata['tags'],
                'channelTitle': metadata['channelTitle']
            },
            'detection': detection,
            'expected_type': expected_type,
            'correct': detection['type'] == expected_type
        }
        
        save_metadata(results, 'test_results', video_id)
        
    except Exception as e:
        print(f"Error testing video {video_id}: {str(e)}")
        import traceback
        traceback.print_exc()

async def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(description='Test video analysis system')
    args = parser.parse_args()
    
    # Test video
    video_id = 'A3AsVAZ7wIs'
    await test_video_analysis(video_id)

if __name__ == '__main__':
    import asyncio
    asyncio.run(main())