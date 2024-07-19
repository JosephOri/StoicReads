import path from 'path';
import fs from 'fs';

class UploadService {
  public async saveFile(
    file: Express.Multer.File
  ): Promise<{ filename: string; path: string }> {
    const uploadPath = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    return { filename: file.filename, path: file.path };
  }

  public async getFile(filename: string): Promise<string> {
    const filePath = path.join(__dirname, '..', 'uploads', filename);
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    return filePath;
  }
}

export default new UploadService();
