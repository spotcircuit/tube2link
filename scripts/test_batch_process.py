import os
import json
import sys
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
import traceback

def split_text(text, chunk_size=8000):
    """Split text into chunks based on sentence boundaries."""
    # Simple sentence splitting
    sentences = text.split('.')
    chunks = []
    current_chunk = []
    current_size = 0
    
    for sentence in sentences:
        sentence = sentence.strip() + '.'
        sentence_size = len(sentence)
        
        if current_size + sentence_size > chunk_size and current_chunk:
            chunks.append(' '.join(current_chunk))
            current_chunk = []
            current_size = 0
            
        current_chunk.append(sentence)
        current_size += sentence_size
    
    if current_chunk:
        chunks.append(' '.join(current_chunk))
    
    return chunks

def merge_generated_content(contents):
    """Merge multiple generated contents into one."""
    if not contents:
        return ""
    if len(contents) == 1:
        return contents[0]
    
    # For multiple parts, add part numbers and combine
    merged = []
    for i, content in enumerate(contents, 1):
        if len(contents) > 1:
            merged.append(f"Part {i}/{len(contents)}:\n{content}\n")
        else:
            merged.append(content)
    
    return "\n".join(merged)

def process_batch_from_enriched_prompt(video_id):
    try:
        # Load environment variables
        load_dotenv('.env.local')
        
        # Initialize OpenAI client
        openai = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
        if not openai.api_key:
            raise ValueError("OpenAI API key not found in environment")
        
        data_dir = Path('data')
        print(f"Data directory: {data_dir.absolute()}")
        
        # Read the enriched prompt
        enriched_prompt_path = data_dir / f"{video_id}_enriched_prompt.txt"
        print(f"Reading enriched prompt from: {enriched_prompt_path}")
        
        # Check if file exists
        if not enriched_prompt_path.exists():
            raise FileNotFoundError(f"Cannot find enriched prompt file: {enriched_prompt_path}")
        
        enriched_prompt = enriched_prompt_path.read_text(encoding='utf-8')
        print(f"Enriched prompt length: {len(enriched_prompt)}")
        
        # Split into batches if needed
        batches = split_text(enriched_prompt)
        print(f"Split into {len(batches)} batch(es)")
        
        batch_results = []
        
        # Process each batch
        for i, batch in enumerate(batches):
            print(f"Processing batch {i + 1}/{len(batches)}")
            
            # Generate post for this batch
            completion = openai.chat.completions.create(
                model="o4-mini",
                messages=[
                    {
                        "role": "system",
                        "content": f"You are a professional LinkedIn content creator. Generate a concise, engaging LinkedIn post{' (Part ' + str(i + 1) + '/' + str(len(batches)) + ')' if len(batches) > 1 else ''} based on the provided context and guidelines."
                    },
                    {
                        "role": "user",
                        "content": batch
                    }
                ],
                temperature=0.7,
                max_tokens=50000
            )
            
            if not completion.choices[0].message.content:
                raise ValueError('No content generated from OpenAI')
            
            generated_post = completion.choices[0].message.content
            batch_results.append(generated_post)
            
            # Save intermediate result
            batch_result_path = data_dir / f"{video_id}_batch_{i + 1}_result.txt"
            batch_result_path.write_text(generated_post, encoding='utf-8')
            print(f"Batch {i + 1} result saved to: {batch_result_path}")
        
        # Combine all results
        combined_post = merge_generated_content(batch_results)
        
        # Save batch result
        batch_result_path = data_dir / f"{video_id}_batch_result.txt"
        batch_result_path.write_text(combined_post, encoding='utf-8')
        print(f"Combined result saved to: {batch_result_path}")
        
        # Save batch metadata
        batch_metadata_path = data_dir / f"{video_id}_batch_metadata.json"
        batch_metadata_path.write_text(json.dumps({
            "batchId": f"batch_{int(Path.cwd().stat().st_mtime)}_{video_id}",
            "timestamp": Path.cwd().stat().st_mtime,
            "status": "completed",
            "model": "o4-mini",
            "inputFile": str(enriched_prompt_path),
            "outputFile": str(batch_result_path),
            "totalBatches": len(batches),
            "estimatedTokens": len(enriched_prompt) // 4  # Rough estimate
        }, indent=2), encoding='utf-8')
        print(f"Batch metadata saved to: {batch_metadata_path}")
        
        print('Batch processing completed successfully!')
        
    except Exception as error:
        error_msg = str(error)
        print(f"Error in batch processing:", file=sys.stderr)
        print(f"Message: {error_msg}", file=sys.stderr)
        
        if hasattr(error, 'response') and hasattr(error.response, 'json'):
            try:
                error_data = error.response.json()
                print(f"OpenAI Error: {json.dumps(error_data, indent=2)}", file=sys.stderr)
            except:
                pass
        
        # Save error information
        error_path = data_dir / f"{video_id}_batch_error.json"
        error_path.write_text(json.dumps({
            "timestamp": Path.cwd().stat().st_mtime,
            "error": str(error),
            "stack": getattr(error, '__traceback__', None) and ''.join(traceback.format_tb(error.__traceback__))
        }, indent=2), encoding='utf-8')
        
        raise

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a video ID as argument", file=sys.stderr)
        sys.exit(1)
    
    video_id = sys.argv[1]
    process_batch_from_enriched_prompt(video_id)
