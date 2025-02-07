// scripts/test-yt-api.ts
import axios from 'axios';

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const VIDEO_ID = '6_VlmovuN0k';

async function testYouTubeAPI() {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${API_KEY}`
    );
    console.log('Response Status:', response.status);
    console.log('Video Data:', response.data);
  } catch (error: any) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
      console.error('Response Status:', error.response.status);
      console.error('Response Headers:', error.response.headers);
    }
  }
}

testYouTubeAPI();