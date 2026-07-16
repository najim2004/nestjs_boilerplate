export interface IStorageAdapter {
  uploadFile(file: Express.Multer.File, directory?: string): Promise<string>;
  deleteFile(url: string): Promise<void>;
  getFileUrl(key: string): string;
}
