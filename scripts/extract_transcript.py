from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
import json
import sys

def extract_transcript(video_id):
    try:
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
        
        # Format the transcript with timestamps
        formatted_transcript = []
        for entry in transcript_list:
            start_time = entry['start']
            text = entry['text']
            minutes = int(start_time // 60)
            seconds = int(start_time % 60)
            timestamp = f"[{minutes}:{seconds:02d}]"
            formatted_transcript.append(f"{timestamp} {text}")
        
        # Join all lines with newlines
        full_transcript = "\n".join(formatted_transcript)
        
        # Save to file
        output_file = f"transcript_{video_id}.txt"
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(full_transcript)
            
        print(f"Successfully extracted transcript and saved to {output_file}")
        return full_transcript
        
    except TranscriptsDisabled:
        print(f"Error: Transcripts are disabled for video {video_id}")
        return None
    except NoTranscriptFound:
        print(f"Error: No transcript found for video {video_id}")
        return None
    except Exception as e:
        print(f"Error extracting transcript: {str(e)}")
        return None

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python extract_transcript.py <video_id>")
        sys.exit(1)
        
    video_id = sys.argv[1]
    transcript = extract_transcript(video_id)
    
    if transcript is None:
        sys.exit(1)
