import { getConfig } from './config';

export async function generateLinkedInPost(transcription: string, title: string, videoUrl: string): Promise<string> {
  const config = await getConfig();
  const maxLength = (config as any).linkedInMaxLength || 3000;

  // Create a summary from the transcription
  let summary = transcription;
  if (summary.length > maxLength) {
    summary = summary.substring(0, maxLength - 200) + '...';
  }

  // Format the LinkedIn post
  const post = `🎥 New Video Summary: ${title}\n\n` +
    `📝 Key Points:\n${summary}\n\n` +
    `🔗 Watch the full video: ${videoUrl}\n\n` +
    `#VideoContent #ContentCreation #LinkedIn`;

  return post;
}
