"""Python wrapper for TypeScript video analysis modules."""
import json
import subprocess
from typing import Dict, Any, List, Optional

def run_ts_script(script_name: str, args: Dict[str, Any]) -> Dict[str, Any]:
    """Run a TypeScript script and return its JSON output."""
    try:
        # Convert args to JSON string
        args_json = json.dumps(args)
        
        # Run the TypeScript script using ts-node
        result = subprocess.run(
            ['npx', 'ts-node', f'lib/{script_name}.ts', args_json],
            capture_output=True,
            text=True,
            check=True
        )
        
        # Parse and return the JSON output
        return json.loads(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error running TypeScript script: {e.stderr}")
        raise
    except json.JSONDecodeError as e:
        print(f"Error parsing TypeScript output: {e}")
        raise

def detect_video_type(metadata: Dict[str, Any]) -> Dict[str, Any]:
    """Detect video type using pattern-based analysis."""
    return run_ts_script('video_detection', {
        'metadata': metadata,
        'action': 'detect'
    })

async def verify_video_type(metadata: Dict[str, Any], candidates: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Verify video type using OpenAI."""
    return run_ts_script('ai', {
        'metadata': metadata,
        'candidates': candidates,
        'action': 'verify_type'
    })

async def generate_video_analysis(metadata: Dict[str, Any], video_type: str) -> Dict[str, Any]:
    """Generate detailed video analysis using OpenAI."""
    return run_ts_script('ai', {
        'metadata': metadata,
        'type': video_type,
        'action': 'analyze'
    })

def get_template_config(video_type: str) -> Dict[str, Any]:
    """Get template configuration for a video type."""
    return run_ts_script('video_templates', {
        'type': video_type,
        'action': 'get_config'
    })

def validate_enrichment(content: Dict[str, Any], video_type: str) -> Dict[str, Any]:
    """Validate video enrichment against template."""
    return run_ts_script('video_validation', {
        'content': content,
        'type': video_type,
        'action': 'validate'
    })
