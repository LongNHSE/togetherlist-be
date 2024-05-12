import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ImageService } from "./image.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { FirebaseService } from "../firebase/firebase.service";
import { apiFailed, apiSuccess } from "src/common/api-response";
import { ApiResponse } from "src/common/dto/response.dto";
import { getNameImageFromUrl } from "src/utils";

@Controller('images')
export class ImageController {
  constructor(
    private readonly imageService: ImageService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<ApiResponse> {
    try {
      const imageUrl = await this.imageService.uploadImage(file);
      const imageName = getNameImageFromUrl(imageUrl);

      return apiSuccess(200, { url: imageUrl, name: imageName}, 'Upload image successfully');
    } catch (error) {
      return apiFailed(error.statusCode, null, error.message);
    }
  }

  @Get(':imageName')
  async getImage(@Param('imageName') imageName: string, @Res() res: any): Promise<any> {
    try {
      const bucket = this.firebaseService.getFirestoreInstance().bucket();
      const file = bucket.file(imageName);
      const fileStream = file.createReadStream();

      fileStream.pipe(res);
    } catch (error) {
      return apiFailed(error.statusCode, null, error.message);
    }
  } 
}