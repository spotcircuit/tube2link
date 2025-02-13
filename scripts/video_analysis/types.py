from typing import Dict, List, Optional, Union, TypedDict, Literal
from dataclasses import dataclass
from enum import Enum

# Video Types
class VideoType(str, Enum):
    TUTORIAL = 'tutorial'
    HOWTO = 'howto'
    EDUCATIONAL = 'educational'
    REVIEW = 'review'
    COMMENTARY = 'commentary'
    ENTERTAINMENT = 'entertainment'
    NEWS = 'news'
    VLOG = 'vlog'
    
    def __str__(self):
        return self.value
    
    def to_json(self):
        return self.value
    
    @classmethod
    def from_json(cls, value):
        return cls(value)

# Metadata Types
class VideoMetadata(TypedDict):
    videoId: str
    title: str
    description: str
    channelTitle: str
    duration: str
    viewCount: int
    likeCount: int
    commentCount: int
    tags: List[str]
    category: str
    defaultLanguage: str
    defaultAudioLanguage: str

# Analysis Types
class Signal(TypedDict):
    source: str
    score: float
    reason: Optional[str]
    type: Optional[VideoType]

class DetectionResult(TypedDict):
    type: VideoType
    confidence: float
    needsAIVerification: bool
    signals: List[Signal]

# Template Configurations
CONFIDENCE_THRESHOLDS = {
    'HIGH': 0.8,    # 80% confidence - use detected type
    'MEDIUM': 0.6,  # 60% confidence - could use detected type but might want AI verification
    'LOW': 0.4      # 40% confidence - definitely need AI verification
}

# Template schemas for each video type
VIDEO_TEMPLATES = {
    str(VideoType.TUTORIAL): {
        'baseType': 'instructional',
        'template': {
            'type': 'tutorial',
            'overview': {
                'difficulty': 'string',
                'timeRequired': {
                    'preparation': 'string',
                    'execution': 'string',
                    'total': 'string'
                },
                'prerequisites': ['string']
            },
            'steps': [{'description': 'string', 'order': 0}],
            'resources': [{'name': 'string', 'url': 'string'}]
        },
        'systemPrompt': 'You are a technical tutorial analyzer. Focus on clear step-by-step instructions, code examples, and technical accuracy.'
    },
    str(VideoType.HOWTO): {
        'baseType': 'instructional',
        'template': {
            'type': 'howto',
            'materials': [{'name': 'string', 'required': True, 'alternatives': ['string']}],
            'steps': [{'description': 'string', 'order': 0, 'tips': ['string']}],
            'difficulty': 'beginner',
            'timeRequired': {'total': 'string'}
        },
        'systemPrompt': 'You are a practical how-to guide analyzer. Focus on materials needed, clear instructions, and safety considerations.'
    },
    str(VideoType.EDUCATIONAL): {
        'baseType': 'instructional',
        'template': {
            'type': 'educational',
            'learningObjectives': [{'description': 'string', 'importance': 0.0}],
            'concepts': [{'name': 'string', 'relatedConcepts': ['string']}],
            'exercises': [{'description': 'string', 'hints': ['string']}]
        },
        'systemPrompt': 'You are an educational content analyzer. Focus on learning objectives, concept explanations, and knowledge assessment.'
    },
    str(VideoType.ENTERTAINMENT): {
        'baseType': 'entertainment',
        'template': {
            'type': 'entertainment',
            'genre': 'string',
            'format': 'string',
            'targetAudience': 'string',
            'highlights': ['string'],
            'engagement': {
                'humor': 'string',
                'drama': 'string',
                'action': 'string'
            }
        },
        'systemPrompt': 'You are an entertainment content analyzer. Focus on genre, format, and engagement factors.'
    }
}

# Type-specific focus points for summaries
TYPE_FOCUS = {
    str(VideoType.TUTORIAL): [
        'Main concepts or skills taught',
        'Key steps in the process',
        'Required prerequisites',
        'Tools or resources needed'
    ],
    str(VideoType.HOWTO): [
        'Materials or equipment needed',
        'Key steps in the process',
        'Time requirements',
        'Safety considerations'
    ],
    str(VideoType.EDUCATIONAL): [
        'Main learning objectives',
        'Key concepts covered',
        'Difficulty level',
        'Practice opportunities'
    ],
    str(VideoType.REVIEW): [
        'Product/service overview',
        'Key pros and cons',
        'Comparison with alternatives',
        'Final recommendation'
    ],
    str(VideoType.COMMENTARY): [
        'Main arguments or points',
        'Supporting evidence',
        'Different perspectives',
        'Context and relevance'
    ]
}
