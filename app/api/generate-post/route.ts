import { NextResponse } from 'next/server'
import { generateSocialPost } from '@/lib/social_post_generator'
import { VideoData } from '@/types/video'
import { PostSettings } from '@/types/post'

export async function POST(request: Request) {
  try {
    const { videoData, template, settings } = await request.json()

    // Validate required data
    if (!videoData || !template || !settings) {
      return NextResponse.json(
        { error: 'Missing required data: videoData, template, or settings' },
        { status: 400 }
      )
    }

    // Generate post content
    const content = await generateSocialPost(
      videoData,
      template,
      settings
    )

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating post:', error)
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate post'
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
