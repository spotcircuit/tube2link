from youtube_transcript_api import YouTubeTranscriptApi
import sys

def get_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        # Combine all transcript pieces into one text
        full_transcript = '\n'.join(f"[{item['start']:.1f}s] {item['text']}" for item in transcript_list)
        return full_transcript
    except Exception as e:
        print(f"Error getting transcript: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python test-captions.py <video_id>")
        sys.exit(1)
    
    video_id = sys.argv[1]
    transcript = get_transcript(video_id)
    if transcript:
        print(transcript)
