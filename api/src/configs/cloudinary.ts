import { v2 as cloudinary } from "cloudinary";
import { env } from "../schemas/env.schema.js";

cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
})

export const uploadOnCloudinary = async (file: Express.Multer.File) => {
    const b64 = file.buffer.toString("base64");
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const res = await cloudinary.uploader.upload(dataURI, {
        folder: "neetwork",
        resource_type: "image"
    })
    return res
}