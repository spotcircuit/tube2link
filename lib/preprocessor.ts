import 'openai/shims/node';
import { z } from 'zod';
import { getOpenAIClient } from './openai';
import { spawn } from 'child_process';
import path from 'path';

export interface PreprocessedData {
  patterns: {
    key_points: Array<{content: string; context_before?: string; context_after?: string}>;
    examples: Array<{content: string; context_before?: string; context_after?: string}>;
    lists: Array<{content: string; context_before?: string; context_after?: string}>;
    code_blocks: Array<{content: string; context_before?: string; context_after?: string}>;
  };
  semantic: {
    actions: Array<{content: string; importance: number}>;
    problems: Array<{content: string; importance: number}>;
    comparisons: Array<{content: string; importance: number}>;
  };
  roles: {
    user: Array<{content: string; matched_patterns: string[]}>;
    developer: Array<{content: string; matched_patterns: string[]}>;
  };
}

export async function preprocessTranscript(transcript: string, onStatus: (step: string) => void): Promise<PreprocessedData> {
  // Preprocess the transcript using the Python script
  const preprocessed = await preprocessData(transcript, onStatus);

  // Initialize preprocessed data structure
  const preprocessedData: PreprocessedData = {
    patterns: {
      key_points: preprocessed.patterns.key_points || [],
      examples: preprocessed.patterns.examples || [],
      lists: preprocessed.patterns.lists || [],
      code_blocks: preprocessed.patterns.code_blocks || []
    },
    semantic: {
      actions: preprocessed.semantic.actions || [],
      problems: preprocessed.semantic.problems || [],
      comparisons: preprocessed.semantic.comparisons || []
    },
    roles: {
      user: preprocessed.roles.user || [],
      developer: preprocessed.roles.developer || []
    }
  };

  return preprocessedData;
}

export async function preprocessData(transcript: string, onStatus: (step: string) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(process.cwd(), 'scripts', 'smart_preprocess.py');
    console.log('Running Python script:', scriptPath);
    
    // Use python3 or python depending on system
    const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
    const pythonProcess = spawn(pythonCommand, [scriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });

    let outputData = '';
    let errorData = '';

    pythonProcess.stdout.on('data', (data) => {
      const str = data.toString();
      console.log('Python stdout:', str);
      outputData += str;
    });

    pythonProcess.stderr.on('data', (data) => {
      const str = data.toString();
      console.log('Python stderr:', str);
      const lines = str.split('\n');
      lines.forEach((line: string) => {
        if (line.startsWith('STATUS:')) {
          onStatus(line.replace('STATUS:', '').trim());
        } else if (line.trim()) {
          errorData += line + '\n';
        }
      });
    });

    // Clean up HTML entities and common transcription errors
    const cleanTranscript = transcript
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      // Fix common transcription errors
      .replace(/\bNN\b/g, 'n8n')
      .replace(/\bnadn\b/gi, 'n8n')
      .replace(/\bn a d n\b/gi, 'n8n');

    // Send cleaned transcript
    pythonProcess.stdin.write(cleanTranscript);
    pythonProcess.stdin.end();

    pythonProcess.on('close', (code) => {
      console.log('Python process exited with code:', code);
      if (code !== 0) {
        console.error('Preprocessing error:', errorData);
        reject(new Error(`Preprocessing failed with code ${code}: ${errorData}`));
        return;
      }

      try {
        const preprocessed = JSON.parse(outputData);
        console.log('Successfully parsed preprocessor output');
        resolve(preprocessed);
      } catch (error) {
        console.error('Failed to parse preprocessor output:', error);
        reject(new Error(`Failed to parse preprocessor output: ${error}`));
      }
    });

    pythonProcess.on('error', (error) => {
      console.error('Failed to start Python process:', error);
      reject(new Error(`Failed to start Python process: ${error}`));
    });
  });
}
