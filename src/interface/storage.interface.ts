export interface FileData {
  fileName: string;
  fileData: Buffer;
  contentType: string;
}
export interface FileStorage {
  upload(data: FileData): Promise<void>;
  delete(fileNmae: string): Promise<void>;
  getObjectUrl(fileNmae: string): string;
}
