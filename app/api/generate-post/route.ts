import { NextResponse } from 'next/server'
import { generateLinkedInPost } from '@/lib/ai'
import { VideoData } from '@/types/video'

export async function POST(request: Request) {
  try {
    const { videoData, template, settings } = await request.json()

    const content = await generateLinkedInPost(
      videoData as VideoData,
      template,
      settings
    )

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating post:', error)
    return NextResponse.json(
      { error: 'Failed to generate post' },
      { status: 500 }
    )
  }
}
