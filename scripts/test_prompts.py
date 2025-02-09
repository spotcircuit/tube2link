import os
from youtube_transcript_api import YouTubeTranscriptApi
from googleapiclient.discovery import build
import json
from dotenv import load_dotenv
from pathlib import Path

# Load environment variables
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(env_path)

# YouTube API setup
YOUTUBE_API_KEY = os.getenv('NEXT_PUBLIC_YT_API_KEY')
if not YOUTUBE_API_KEY:
    raise ValueError("YouTube API key not found in .env.local")

youtube = build('youtube', 'v3', developerKey=YOUTUBE_API_KEY)

def get_video_metadata(video_id):
    try:
        response = youtube.videos().list(
            part='snippet,contentDetails,statistics',
            id=video_id
        ).execute()

        if not response['items']:
            return None
        
        return response['items'][0]
    except Exception as e:
        print(f"Error getting video metadata: {e}")
        return None

def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        full_text = []
        for entry in transcript_list:
            timestamp = int(entry['start'])
            minutes = timestamp // 60
            seconds = timestamp % 60
            time_str = f"[{minutes:02d}:{seconds:02d}] "
            full_text.append(f"{time_str}{entry['text']}")
        return '\n'.join(full_text)
    except Exception as e:
        print(f"Error getting transcript: {e}")
        return None

def format_duration(duration_str):
    hours = 0
    minutes = 0
    seconds = 0
    
    if 'H' in duration_str:
        hours = int(duration_str.split('H')[0].replace('PT', ''))
        duration_str = duration_str.split('H')[1]
    else:
        duration_str = duration_str.replace('PT', '')
        
    if 'M' in duration_str:
        minutes = int(duration_str.split('M')[0])
        duration_str = duration_str.split('M')[1]
    
    if 'S' in duration_str:
        seconds = int(duration_str.split('S')[0])
    
    if hours > 0:
        return f"{hours}:{minutes:02d}:{seconds:02d}"
    else:
        return f"{minutes:02d}:{seconds:02d}"

def generate_prompts(video_data, transcription):
    templates = {
        'summary': '''You are a professional content creator specializing in LinkedIn posts. Create an engaging LinkedIn post based on the following YouTube video content.
Focus on extracting and highlighting the key insights while maintaining a professional tone.

Video Title: {title}
Channel: {channel}
Duration: {duration}
Views: {views}
Likes: {likes}
Description: {description}
Tags: {tags}

Transcription:
{transcription}

Guidelines:
1. Start with a compelling hook
2. Extract 3-5 key insights or takeaways
3. Include relevant statistics or data points if available
4. End with a thought-provoking question or call-to-action
5. Add appropriate hashtags based on the content
6. Keep the total length between 1000-1300 characters
7. Format for LinkedIn's style (use line breaks effectively)
8. Include the YouTube video link at the end

Video Link: https://youtu.be/{videoId}''',

        'template': '''You are a professional content marketer specializing in LinkedIn content. Create a structured, template-based LinkedIn post from this YouTube video content.
Use a professional template format that's proven to drive engagement.

Video Title: {title}
Channel: {channel}
Duration: {duration}
Views: {views}
Likes: {likes}
Description: {description}
Tags: {tags}

Transcription:
{transcription}

Guidelines:
1. Use this template structure:
   - 🎯 Main Topic/Theme
   - 💡 Key Insight
   - 🔍 Deep Dive (3 bullet points)
   - 🤔 Why This Matters
   - 🎬 Watch More
2. Keep each section concise and impactful
3. Use emojis strategically
4. Include relevant hashtags
5. Keep the total length between 1000-1300 characters
6. End with the video link

Video Link: https://youtu.be/{videoId}''',

        'segmented': '''You are a LinkedIn content strategist specializing in detailed content analysis. Create a segmented LinkedIn post that breaks down the key components of this YouTube video.

Video Title: {title}
Channel: {channel}
Duration: {duration}
Views: {views}
Likes: {likes}
Description: {description}
Tags: {tags}

Transcription:
{transcription}

Guidelines:
1. Structure the post in distinct segments:
   - Introduction (hook the reader)
   - Context (why this matters)
   - Key Segments (3-4 main points with timestamps if relevant)
   - Analysis (your professional perspective)
   - Conclusion (call-to-action)
2. Use clear segment separators (e.g., "---")
3. Include relevant statistics or metrics
4. Add industry-specific insights
5. Use professional hashtags
6. Keep the total length between 1000-1300 characters
7. End with the video link

Video Link: https://youtu.be/{videoId}'''
    }

    prompts = {}
    for mode, template in templates.items():
        prompt = template.format(
            title=video_data['snippet']['title'],
            channel=video_data['snippet']['channelTitle'],
            duration=format_duration(video_data['contentDetails']['duration']),
            views="{:,}".format(int(video_data['statistics']['viewCount'])),
            likes="{:,}".format(int(video_data['statistics']['likeCount'])),
            description=video_data['snippet'].get('description', 'No description available'),
            tags=', '.join(video_data['snippet'].get('tags', ['No tags'])),
            transcription=transcription,
            videoId=video_id
        )
        prompts[mode] = prompt

    return prompts

if __name__ == "__main__":
    video_id = "y-eEbmNeFZo"
    
    print("Fetching video metadata...")
    video_data = get_video_metadata(video_id)
    if not video_data:
        print("Failed to get video metadata")
        exit(1)

    print("\nFetching transcript...")
    transcription = get_transcript(video_id)
    if not transcription:
        print("Failed to get transcript")
        exit(1)

    print("\nGenerating prompts...")
    prompts = generate_prompts(video_data, transcription)

    output_file = Path(__file__).parent / 'prompts_output.txt'
    
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("=== VIDEO METADATA ===\n")
        f.write(f"Title: {video_data['snippet']['title']}\n")
        f.write(f"Channel: {video_data['snippet']['channelTitle']}\n")
        f.write(f"Duration: {format_duration(video_data['contentDetails']['duration'])}\n")
        f.write(f"Views: {int(video_data['statistics']['viewCount']):,}\n")
        f.write(f"Likes: {int(video_data['statistics']['likeCount']):,}\n")
        f.write(f"\nDescription:\n{video_data['snippet'].get('description', 'No description available')}\n")
        f.write(f"\nTags: {', '.join(video_data['snippet'].get('tags', ['No tags']))}\n")
        
        f.write("\n=== TRANSCRIPTION ===\n")
        f.write(transcription)
        
        f.write("\n\n=== PROMPTS ===\n")
        for mode, prompt in prompts.items():
            f.write(f"\n--- {mode.upper()} PROMPT ---\n\n")
            f.write(prompt)
            f.write("\n\n" + "="*50 + "\n")

    print(f"\nOutput has been saved to: {output_file}")
    
    print("\n=== VIDEO SUMMARY ===")
    print(f"Title: {video_data['snippet']['title']}")
    print(f"Channel: {video_data['snippet']['channelTitle']}")
    print(f"Duration: {format_duration(video_data['contentDetails']['duration'])}")
    print(f"Views: {int(video_data['statistics']['viewCount']):,}")
    print(f"Likes: {int(video_data['statistics']['likeCount']):,}")
    
    print("\nPrompts have been generated with the following modes:")
    print("1. Summary: Focused on key insights and takeaways")
    print("2. Template: Structured format with emojis")
    print("3. Segmented: Detailed breakdown with timestamps")
    print(f"\nCheck {output_file} for the full output")
