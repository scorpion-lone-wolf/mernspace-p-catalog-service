import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import config from "config";
import type {
  FileData,
  FileStorage,
} from "../../interface/storage.interface.js";
export class S3StorageService implements FileStorage {
  private s3Client: S3Client;
  private bucketName: string;
  private bucketRegion: string;
  constructor() {
    this.bucketName = config.get("s3.bucket");
    this.bucketRegion = config.get("s3.region");
    this.s3Client = new S3Client({
      region: this.bucketRegion,
      credentials: {
        accessKeyId: config.get("s3.access_key_id"),
        secretAccessKey: config.get("s3.access_key_secret"),
      },
    });
  }

  async upload(data: FileData): Promise<void> {
    await this.s3Client.send(
      new PutObjectCommand({
        Bucket: this.bucketName, // this is the bucket name
        Key: data.fileName, // this will be the file name
        Body: data.fileData, // this will be binary data
        ContentType: data.contentType,
      }),
    );
  }
  //  TODO : Implement this method
  delete(fileNmae: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  getObjectUrl(fileName: string): string {
    // public url format : https://[bucket-name].s3.[region].amazonaws.com/[object-key]
    return `https://${this.bucketName}.s3.${this.bucketRegion}.amazonaws.com/${fileName}`;
  }
}
