import { Storage } from '@google-cloud/storage';

interface CloudFile {
  buffer: Buffer;
  originalname: string;
}

class CloudStorage {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage();
    this.bucketName = process.env.STORAGE_BUCKET || '';
  }

  async uploadFile(file: CloudFile): Promise<string> {
    const { buffer, originalname } = file;
    const bucket = this.storage.bucket(this.bucketName);
    const filename = `${Date.now()}-${originalname}`;
    const fileUpload = bucket.file(filename);

    await fileUpload.save(buffer, {
      metadata: {
        contentType: 'application/octet-stream',
      },
    });

    return `gs://${this.bucketName}/${filename}`;
  }
}

export default CloudStorage;
