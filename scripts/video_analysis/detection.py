from typing import Dict, List, Tuple
import re
from .types import VideoType, VideoMetadata, Signal, DetectionResult, CONFIDENCE_THRESHOLDS

# Pattern definitions for each video type
PATTERNS = {
    VideoType.TUTORIAL: {
        'title': [
            r'how to|tutorial|guide|learn|basics|introduction|getting started',
            r'step[s]? by step|walkthrough|complete guide'
        ],
        'description': [
            r'learn|teach|understand|master|basics|fundamentals',
            r'step[s]?|instruction|guide|tutorial|walkthrough'
        ],
        'channel': [
            r'academy|learning|education|tutorial|tech|dev|code'
        ]
    },
    VideoType.HOWTO: {
        'title': [
            r'how to|diy|fix|solve|make|create|build',
            r'easy way|quick|simple|basic'
        ],
        'description': [
            r'follow these steps|simple guide|easy steps',
            r'materials needed|tools required|what you need'
        ],
        'channel': [
            r'diy|crafts|maker|builder|fix|repair|home'
        ]
    },
    VideoType.EDUCATIONAL: {
        'title': [
            r'explained|understanding|what is|why do|science|math|history',
            r'course|lecture|lesson|class|theory|concept'
        ],
        'description': [
            r'learn about|understand|explore|discover',
            r'concept|theory|principle|fundamental'
        ],
        'channel': [
            r'education|learning|school|university|academy|science'
        ]
    }
    # Add other types as needed...
}

def calculate_pattern_score(text: str, patterns: List[str]) -> Tuple[float, List[str]]:
    """Calculate how well text matches a set of patterns."""
    if not text:
        return 0.0, []
    
    text = text.lower()
    matches = []
    total_score = 0.0
    
    for pattern in patterns:
        found = re.findall(pattern, text, re.IGNORECASE)
        if found:
            matches.extend(found)
            # More specific/longer matches get higher scores
            total_score += sum(len(match) / len(text) for match in found)
    
    # Normalize score to 0-1 range
    return min(total_score, 1.0), matches

def analyze_duration(duration: str) -> List[Signal]:
    """Analyze video duration for type signals."""
    signals = []
    
    # Convert duration to seconds
    parts = duration.split(':')
    total_seconds = sum(int(part) * mult for part, mult in zip(reversed(parts), [1, 60, 3600]))
    
    # Add signals based on duration
    if total_seconds < 60:  # Under 1 minute
        signals.append({
            'source': 'duration',
            'score': 0.8,
            'reason': 'Very short duration typical of quick tips or highlights',
            'type': VideoType.ENTERTAINMENT  # Short form content is often entertainment
        })
    elif total_seconds < 300:  # Under 5 minutes
        signals.append({
            'source': 'duration',
            'score': 0.6,
            'reason': 'Short duration suitable for quick tutorials or explanations',
            'type': VideoType.HOWTO  # Quick how-to content
        })
    elif total_seconds < 1200:  # Under 20 minutes
        signals.append({
            'source': 'duration',
            'score': 0.7,
            'reason': 'Medium duration common for detailed tutorials or reviews',
            'type': VideoType.TUTORIAL  # Longer form educational content
        })
    else:  # Over 20 minutes
        signals.append({
            'source': 'duration',
            'score': 0.8,
            'reason': 'Long duration typical of educational content or detailed analysis',
            'type': VideoType.EDUCATIONAL  # In-depth educational content
        })
    
    return signals

def detect_video_type(metadata: VideoMetadata) -> DetectionResult:
    """Detect video type based on metadata signals."""
    signals: List[Signal] = []
    type_scores: Dict[VideoType, float] = {t: 0.0 for t in VideoType}
    
    # Analyze each type's patterns
    for video_type, patterns in PATTERNS.items():
        # Title analysis
        title_score, title_matches = calculate_pattern_score(metadata['title'], patterns['title'])
        if title_score > 0:
            signals.append({
                'source': 'title_pattern',
                'score': title_score * 3,  # Title matches are strong signals
                'reason': f"Title matches {video_type} patterns: {', '.join(title_matches)}",
                'type': video_type
            })
            type_scores[video_type] += title_score * 3
        
        # Description analysis
        desc_score, desc_matches = calculate_pattern_score(metadata['description'], patterns['description'])
        if desc_score > 0:
            signals.append({
                'source': 'description_pattern',
                'score': desc_score * 2,
                'reason': f"Description matches {video_type} patterns: {', '.join(desc_matches)}",
                'type': video_type
            })
            type_scores[video_type] += desc_score * 2
        
        # Channel analysis
        channel_score, channel_matches = calculate_pattern_score(metadata['channelTitle'], patterns['channel'])
        if channel_score > 0:
            signals.append({
                'source': 'channel_pattern',
                'score': channel_score,
                'reason': f"Channel matches {video_type} patterns: {', '.join(channel_matches)}",
                'type': video_type
            })
            type_scores[video_type] += channel_score
    
    # Add duration signals
    duration_signals = analyze_duration(metadata['duration'])
    signals.extend(duration_signals)
    
    # Get highest scoring type
    detected_type = max(type_scores.items(), key=lambda x: x[1])[0]
    
    # Calculate confidence based on score difference and signal strength
    max_score = max(type_scores.values())
    second_max = sorted(type_scores.values(), reverse=True)[1] if len(type_scores) > 1 else 0
    score_diff = max_score - second_max
    
    # Higher confidence if one type significantly outscores others
    confidence = min(max_score * 0.7 + score_diff * 0.3, 1.0)
    
    return {
        'type': detected_type,
        'confidence': confidence,
        'needsAIVerification': confidence < CONFIDENCE_THRESHOLDS['HIGH'],
        'signals': signals
    }
