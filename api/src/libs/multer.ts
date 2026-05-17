import multer from "multer"
import type { Request } from "express"
import type { FileFilterCallback } from "multer"
import { UploadValidationError } from "../utils/UploadValidationError.js"

const storage = multer.memoryStorage()
const limits = { fileSize: 2 * 1024 * 1024 }

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    return file.mimetype.startsWith("image/")
        ? cb(null, true)
        : cb(new UploadValidationError("Only images are allowed"));
}

export const upload = multer({ storage, limits, fileFilter });