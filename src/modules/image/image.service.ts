import { Injectable } from "@nestjs/common";
import { FirebaseService } from "../firebase/firebase.service";

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) { }

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const storage = this.firebaseService.getFirestoreInstance();
    const bucket = storage.bucket();

    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

    return new Promise((resolve, reject) => {
      stream.on('erroe', error => {
        reject(error);
      });

      stream.on('finish', () => {
        const imageUrl = `https://storage.googleapis.com.${bucket.name}/${fileName}`;
        resolve(imageUrl);
      });

      stream.end(file.buffer);
    });
  }
}