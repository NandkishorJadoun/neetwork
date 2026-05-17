export class UploadValidationError extends Error {
    field: string;

    constructor(message: string) {
        super(message);
        this.name = "UploadValidationError";
        this.field = 'avatar';
    }
}