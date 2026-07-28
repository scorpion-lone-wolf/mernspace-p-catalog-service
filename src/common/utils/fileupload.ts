import type { FileStorage } from "../../interface/storage.interface.js";

export const imageUploadToS3 = async (
  file: Express.Multer.File,
  storage: FileStorage,
  imageName: string,
) => {
  // save image to s3 -> will return s3 public url
  await storage.upload({
    fileName: imageName,
    fileData: file.buffer,
    contentType: file.mimetype,
  });
};
