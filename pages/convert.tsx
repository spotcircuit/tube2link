import { useState, useEffect } from 'react';
import axios from 'axios';

interface VideoData {
  title: string;
  duration: string;
  thumbnail: string;
  transcription?: string;
  linkedInPost?: string;
}

export default function ConvertPage() {
  const [url, setUrl] = useState('');
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      try {
        const response = await axios.get('/api/auth');
        setIsAuthenticated(true);
      } catch (error: any) {
        if (error.response?.data?.authUrl) {
          window.location.href = error.response.data.authUrl;
        }
      }
    };
    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVideoData(null);

    try {
      const response = await axios.post('/api/convert', { videoUrl: url });
      setVideoData(response.data.videoData);
    } catch (error: any) {
      if (error.response?.data?.authUrl) {
        // Redirect to auth if token is invalid or expired
        window.location.href = error.response.data.authUrl;
      } else {
        setError(error.response?.data?.error || 'Failed to process video. Please check the URL and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">YouTube to LinkedIn Converter</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter YouTube URL"
          className="w-full p-2 border rounded mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : 'Convert'}
        </button>
      </form>

      {error && <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading && (
        <div className="mt-8">
          <div className="flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Processing video and generating content...</p>
          </div>
        </div>
      )}

      {videoData && (
        <div className="mt-8 space-y-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">Video Details</h2>
              <img src={videoData.thumbnail} alt={videoData.title} className="w-full max-w-md mb-4 rounded" />
              <h3 className="font-bold text-lg">{videoData.title}</h3>
              <p className="text-gray-600">Duration: {videoData.duration}</p>
            </div>
          </div>

          {videoData.transcription && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">Transcription</h2>
                <div className="bg-gray-50 p-4 rounded max-h-96 overflow-y-auto">
                  <p className="whitespace-pre-wrap">{videoData.transcription}</p>
                </div>
              </div>
            </div>
          )}

          {videoData.linkedInPost && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">LinkedIn Post</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="whitespace-pre-wrap">{videoData.linkedInPost}</p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(videoData.linkedInPost!)}
                  className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Copy to Clipboard
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
