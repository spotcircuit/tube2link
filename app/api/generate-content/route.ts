import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { type, transcription } = await request.json();

    if (!transcription) {
      return NextResponse.json({ error: 'Transcription is required' }, { status: 400 });
    }

    let content = '';
    
    switch (type) {
      case 'summary':
        content = generateSummary(transcription);
        break;
      case 'template':
        content = generateTemplateContent(transcription);
        break;
      case 'segmented':
        content = generateSegmentedContent(transcription);
        break;
      default:
        return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error('Content generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate content',
      details: error.message 
    }, { status: 500 });
  }
}

function generateSummary(transcription: string): string {
  // Extract key points and create a summary
  const sentences = transcription.split(/[.!?]+/).filter(Boolean);
  const keyPoints = sentences.slice(0, 5); // Get first 5 sentences as key points
  
  return `🎯 Key Insights:

${keyPoints.map(point => `• ${point.trim()}`).join('\n')}

Want to learn more? Check out the full video! 

#ContentCreation #ProfessionalDevelopment`;
}

function generateTemplateContent(transcription: string): string {
  return `📚 Valuable Insights from Latest Video

Key Takeaways:
1. [First Key Point]
2. [Second Key Point]
3. [Third Key Point]

💡 Pro Tip: [Insert actionable advice]

🔍 Deep Dive:
[Insert detailed explanation of most important point]

Want to stay updated on more content like this? Follow for daily insights!

#ProfessionalGrowth #Learning #Innovation`;
}

function generateSegmentedContent(transcription: string): string {
  return `🎯 Context:
[Brief introduction to the topic]

🔑 Main Points:
1. [Point One]
2. [Point Two]
3. [Point Three]

💡 Supporting Evidence:
[Include relevant examples or data]

🎬 Conclusion:
[Wrap up with key takeaway]

📣 Call to Action:
[What should readers do next?]

#ThoughtLeadership #Innovation`;
}
