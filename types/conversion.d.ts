declare namespace Conversion {
  interface Request {
    videoUrl: string;
    userId?: string;
  }

  interface Response {
    content: string;
    metadata: {
      title: string;
      duration: string;
      thumbnail: string;
    };
    templates: string[];
  }
}
