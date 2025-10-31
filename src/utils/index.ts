import { uploadToCloudinary } from "./core/upload_image.cloudinary";
import { validation } from "./core/validation";

export const validate = {
    validation: validation,
}

export const upload = {
    image: uploadToCloudinary,
}