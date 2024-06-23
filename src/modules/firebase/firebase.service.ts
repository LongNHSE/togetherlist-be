import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import * as dotenv from "dotenv";
dotenv.config();

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor() {
    const credential = {
      "type": "service_account",
      "project_id": "togetherlist-e8f05",
      "private_key_id": "329ad43ded444ee54cdaf06c39a01e20ea424ce8",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQD2KEQAM1kVigAE\nSvkx0P5hTtKT5AOaQQtNv9aMUmEjboGezSUubIlLww+mFZLwvrSZsizPgASIwIgk\nbgGbUg9BkCHwaiem2C76oe9o0aihbp+g+RhZIEMWrx4jxuMZGxdqjh873f6ATgiq\nwrDj5F7blQXCHDv0rKdrnwfQhfVikX0YmOj+jlGXPXfuXTLQooN+xBWoIvSe+lQm\nPmpMJZvicZoB+M+O8cbu4b5VENDTMsYb50Ox3BahE67nIq2WvZq+9eWQMXnB3/fr\npDIyMzR8yD6IIKlwqb4b+ZI2Kr3s5rEx/Tpqx6n347FynOQhqY6bPRD36r4s2T6F\nyOzSb1DTAgMBAAECggEAHquXsBq1v9GeUj/xL/wlUISHXPaXsvw7Ef3pbTnFHAAP\nKx/Oa9a0KKTDlLhdbZz6rafInjYKL+vP9Wdg0InMmCkC7DdIfNO0zspRz9KdBeLd\nsCs5QGmc/PzmxCMUyrJYcZCxuD40Zqd9EaGzyUFRcbSYr2iLLoo7S1UuSRStJWb9\nYT+PxmZJksVfnBvx/NssZmLADQYFt6zzKN1xyX67Mb1lSM/NW9+E5eYAGKK7ycNR\nN9AfNaYNxr7zhL23rxmDwGDwaJf93ta6eKriOCnK4h7w+GcQzP/ReNN5hL1bmrCM\n6GLfW4FPoVAomxcJy18lrtXx3AJ8aFhZGBUXJNYKwQKBgQD7EQtqVnDFDAl11U0c\nCdWdhNuzepYC2dat+aMemasfVQVQAlhJPG2IkJYajxEewuyuLZv377tvnvCW7fWi\nnqAiOwW4xrm0iVn+LnGUZqcFoXjJX/+Jn0Yanig1TbM5sLrFRnZHWZyts8u5M9YO\nnZMqKz7PH+uleKV7a2DJvHw7IQKBgQD6/oaIvg8bixRU/BPLt/S6CUZ+zD7zqRyU\nV2mwUxqFZkSui2Aqqa+ej3I7kynkEB0eXTaFJdtH2sTgUy03tmXNOoDi6Giyb8FN\naY2cPztJPw2bklLkerSvwBWnrvPXyzhmvnDwVpFqJC9m18zwzJfb37/eRmyKGDKs\nBqO6UFGhcwKBgQDB0EafsFsdwk0LSb5dBrqA/y8bPmbPjJrNcwkZdkdDyL5xJV5C\nKwPjiLpXhloRBSjwzQS6QbbQVEImQUx+XTYBNs8T9VUmqWFvdyr3BMeq8RvtWM5L\nz0ivA6jGfVT+FBAaemqUafkpnsKGFh4I6lvREdFK07l148zbmej90yOUAQKBgQDG\n1/4dNvUhDP3+lfXY3tOyzsZajdURlFhf7SB94FiSdoLTBPga1HOdWmdVazE0zM9E\nzvPyaBtgwaBXV43rJUVhYYfaO+U19/NcMNNPhYiibqGJLlMdT1j2I2cEgUYNH6J/\nQ0CWJv7s593ly/FAk9V7C7glkAVNIf6C6n+rixYgoQKBgQDFHPx2hHP5lCpg7A2l\nwjLVtiUAAAkG6RCp5SRqat7l0y7gpLUgcvgiNgl1/HrdHa+1UQeWLtnX55hRN2yK\nGr7qSgoUEfUSf+1d98OP4A0Ph6RQg9Ut75B29h5/bP7/VHVYT5xAhquBiGOQaDoQ\n8DiNMWBQCtFCKF5NrVpVcVIS4A==\n-----END PRIVATE KEY-----\n",
      "client_email": "firebase-adminsdk-dwis8@togetherlist-e8f05.iam.gserviceaccount.com",
      "client_id": "103692109602287899281",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://oauth2.googleapis.com/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dwis8%40togetherlist-e8f05.iam.gserviceaccount.com",
      "universe_domain": "googleapis.com",
    }

    admin.initializeApp({
      credential: admin.credential.cert(credential as any),
      storageBucket: 'togetherlist-e8f05.appspot.com'
    });
    this.storage = admin.storage();
  }

  getFirestoreInstance(): admin.storage.Storage {
    return this.storage;
  }
}