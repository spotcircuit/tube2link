from sentence_transformers import SentenceTransformer
from sklearn.cluster import AgglomerativeClustering
import numpy as np
from typing import List, Dict, Set, Tuple
import re
from pathlib import Path
import json
from youtube_transcript_api import YouTubeTranscriptApi
import spacy
import sys
import subprocess

class SmartPreprocessor:
    def __init__(self):
        print("Initializing models...", file=sys.stderr)
        # For semantic similarity
        self.sentence_model = SentenceTransformer('all-MiniLM-L6-v2')
        # For NLP tasks
        print("Loading spaCy model...", file=sys.stderr)
        self.nlp = spacy.load('en_core_web_sm')
        
        # Pattern definitions
        self.patterns = {
            'steps': r'(?i)(step\s+\d+|first|second|third|next|finally|lastly)',
            'examples': r'(?i)(for example|here\'s an example|such as|like this|consider)',
            'key_points': r'(?i)(important|key|note|remember|crucial|essential)',
            'lists': r'^\s*[\d\-\*]\s+',
            'code_blocks': r'```.*?```|`.*?`'
        }
        
        # Role-based keywords
        self.role_patterns = {
            'user': [
                'click', 'select', 'navigate', 'open', 'go to', 'choose',
                'enter', 'type', 'input', 'submit', 'save'
            ],
            'developer': [
                'implement', 'code', 'function', 'api', 'method', 'class',
                'variable', 'parameter', 'return', 'import', 'install'
            ],
            'config': [
                'configure', 'set up', 'install', 'environment', 'settings',
                'options', 'preferences', 'initialize', 'setup'
            ],
            'troubleshoot': [
                'error', 'issue', 'debug', 'fix', 'problem', 'solution',
                'resolve', 'handle', 'catch', 'exception'
            ]
        }
        
        # Action patterns
        self.action_patterns = [
            r'(?i)you (need|must|should|have to)',
            r'(?i)(make sure|ensure|verify|check)',
            r'(?i)(follow|do|perform|execute|run)',
            r'(?i)(avoid|don\'t|never|always)'
        ]
        
    def extract_patterns(self, text: str) -> Dict[str, List[Dict]]:
        """Extract content based on patterns"""
        doc = self.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        results = {
            'steps': [],
            'examples': [],
            'key_points': [],
            'lists': [],
            'code_blocks': []
        }
        
        # Track processed sentences to avoid duplicates
        processed = set()
        
        for i, sentence in enumerate(sentences):
            if sentence in processed:
                continue
                
            # Get context (previous and next sentences)
            context_before = sentences[i-1] if i > 0 else ""
            context_after = sentences[i+1] if i < len(sentences)-1 else ""
            
            for pattern_type, pattern in self.patterns.items():
                if re.search(pattern, sentence):
                    results[pattern_type].append({
                        'content': sentence,
                        'context_before': context_before,
                        'context_after': context_after,
                        'position': i
                    })
                    processed.add(sentence)
        
        # Limit results to top 10 per category
        for pattern_type in results:
            results[pattern_type] = results[pattern_type][:10]
        
        print(f"📊 Stage 1: Extracting patterns and key points... Found {sum(len(v) for v in results.values())} pattern matches", file=sys.stderr)
        return results
    
    def semantic_analysis(self, text: str) -> Dict[str, List[Dict]]:
        """Analyze text for semantic patterns"""
        doc = self.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        results = {
            'actions': [],
            'problems': [],
            'comparisons': []
        }
        
        # Encode all sentences for similarity comparison
        embeddings = self.sentence_model.encode(sentences)
        
        for i, sentence in enumerate(sentences):
            # Find action items
            if any(re.search(pattern, sentence) for pattern in self.action_patterns):
                results['actions'].append({
                    'content': sentence,
                    'importance': self._calculate_importance(embeddings[i], embeddings)
                })
            
            # Find problem-solution pairs
            if any(word in sentence.lower() for word in ['problem', 'issue', 'error']):
                # Look for solution in next few sentences
                for j in range(i+1, min(i+4, len(sentences))):
                    if any(word in sentences[j].lower() for word in ['solution', 'fix', 'resolve']):
                        results['problems'].append({
                            'problem': sentence,
                            'solution': sentences[j],
                            'importance': self._calculate_importance(embeddings[i], embeddings)
                        })
                        break
            
            # Find comparisons
            if any(word in sentence.lower() for word in ['better', 'worse', 'unlike', 'compared']):
                results['comparisons'].append({
                    'content': sentence,
                    'context': sentences[i-1] if i > 0 else "",
                    'importance': self._calculate_importance(embeddings[i], embeddings)
                })
        
        # Sort by importance and limit to top 10
        for key in results:
            results[key] = sorted(results[key], key=lambda x: x.get('importance', 0), reverse=True)[:10]
        
        print(f"🧠 Stage 2: Running semantic analysis... Found {len(results['actions'])} actions", file=sys.stderr)
        print(f"🧠 Stage 2: Running semantic analysis... Found {len(results['problems'])} problem-solution pairs", file=sys.stderr)
        print(f"🧠 Stage 2: Running semantic analysis... Found {len(results['comparisons'])} comparisons", file=sys.stderr)
        return results
    
    def role_based_extraction(self, text: str) -> Dict[str, List[Dict]]:
        """Extract content based on target roles"""
        doc = self.nlp(text)
        sentences = [sent.text.strip() for sent in doc.sents]
        
        results = {role: [] for role in self.role_patterns.keys()}
        
        # Encode all sentences for similarity comparison
        embeddings = self.sentence_model.encode(sentences)
        
        for i, sentence in enumerate(sentences):
            sentence_lower = sentence.lower()
            for role, patterns in self.role_patterns.items():
                if any(pattern in sentence_lower for pattern in patterns):
                    results[role].append({
                        'content': sentence,
                        'matched_patterns': [p for p in patterns if p in sentence_lower],
                        'importance': self._calculate_importance(embeddings[i], embeddings)
                    })
        
        # Sort by importance and limit to top 10 per role
        for role in results:
            results[role] = sorted(results[role], key=lambda x: x.get('importance', 0), reverse=True)[:10]
        
        for role, items in results.items():
            if items:
                print(f"👥 Stage 3: Analyzing role-based content... Found {len(items)} {role}-related items", file=sys.stderr)
        return results
    
    def _calculate_importance(self, sentence_embedding: np.ndarray, all_embeddings: np.ndarray) -> float:
        """Calculate importance score based on centrality"""
        similarities = np.dot(all_embeddings, sentence_embedding)
        return float(np.mean(similarities))
    
    def process(self, text: str) -> Dict:
        """Process text through all stages"""
        print("🔄 Building semantic model...", file=sys.stderr)
        
        # Limit text length to approximately 6000 tokens (about 24000 characters)
        MAX_CHARS = 24000
        if len(text) > MAX_CHARS:
            print(f"⚠️ Text too long ({len(text)} chars), truncating to {MAX_CHARS} chars...", file=sys.stderr)
            text = text[:MAX_CHARS]
        
        pattern_results = self.extract_patterns(text)
        semantic_results = self.semantic_analysis(text)
        role_results = self.role_based_extraction(text)
        
        print("✨ Finalizing preprocessing...", file=sys.stderr)
        
        # Combine results
        return {
            'patterns': pattern_results,
            'semantic': semantic_results,
            'roles': role_results,
            'stats': {
                'total_length': len(text),
                'pattern_matches': sum(len(v) for v in pattern_results.values()),
                'semantic_matches': sum(len(v) for v in semantic_results.values()),
                'role_matches': sum(len(v) for v in role_results.values())
            }
        }

def write_report(result: Dict, output_file: str = 'smart_preprocessing_report.md'):
    """Write a detailed markdown report"""
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Smart Preprocessing Report\n\n")
        
        # Overall stats
        f.write("## Statistics\n")
        stats = result['stats']
        f.write(f"- Total text length: {stats['total_length']:,} characters\n")
        f.write(f"- Pattern matches: {stats['pattern_matches']}\n")
        f.write(f"- Semantic matches: {stats['semantic_matches']}\n")
        f.write(f"- Role-based matches: {stats['role_matches']}\n\n")
        
        # Pattern-based results
        f.write("## Pattern-Based Content\n")
        for pattern_type, items in result['patterns'].items():
            if items:
                f.write(f"\n### {pattern_type.title()} ({len(items)} items)\n")
                for item in items:
                    f.write(f"\n**Content:**\n> {item['content']}\n")
                    if item.get('context_before'):
                        f.write(f"\n*Context before:*\n> {item['context_before']}\n")
                    if item.get('context_after'):
                        f.write(f"\n*Context after:*\n> {item['context_after']}\n")
                f.write("\n---\n")
        
        # Semantic results
        f.write("\n## Semantic Analysis\n")
        for semantic_type, items in result['semantic'].items():
            if items:
                f.write(f"\n### {semantic_type.title()} ({len(items)} items)\n")
                for item in items:
                    if 'problem' in item:
                        f.write(f"\n**Problem:**\n> {item['problem']}\n")
                        f.write(f"\n**Solution:**\n> {item['solution']}\n")
                    else:
                        f.write(f"\n**Content:**\n> {item['content']}\n")
                        if 'importance' in item:
                            f.write(f"*Importance score: {item['importance']:.2f}*\n")
                f.write("\n---\n")
        
        # Role-based results
        f.write("\n## Role-Based Content\n")
        for role, items in result['roles'].items():
            if items:
                f.write(f"\n### {role.title()} Instructions ({len(items)} items)\n")
                for item in items:
                    f.write(f"\n**Content:**\n> {item['content']}\n")
                    if item.get('matched_patterns'):
                        f.write(f"*Matched patterns: {', '.join(item['matched_patterns'])}*\n")
                f.write("\n---\n")

def get_video_id(url: str) -> str:
    """Extract video ID from YouTube URL"""
    if 'youtu.be' in url:
        return url.split('/')[-1]
    if 'youtube.com' in url:
        from urllib.parse import parse_qs, urlparse
        return parse_qs(urlparse(url).query)['v'][0]
    return url

def get_transcript(video_id: str) -> str:
    """Get transcript from YouTube video"""
    transcript_list = YouTubeTranscriptApi.get_transcript(video_id)
    return ' '.join(item['text'] for item in transcript_list)

if __name__ == "__main__":
    try:
        # Read raw text from stdin
        text = sys.stdin.read()

        # Initialize preprocessor
        preprocessor = SmartPreprocessor()
        
        # Process the text
        result = preprocessor.process(text)
        
        # Output JSON result
        print(json.dumps(result, indent=4))

    except Exception as e:
        print(f"STATUS:Error: {str(e)}", file=sys.stderr)
        sys.exit(1)
