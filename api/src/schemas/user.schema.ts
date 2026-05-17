import * as z from "zod"

export const PatchFormDataSchema = z.object({
     fullname: z
        .string()
        .trim()
        .nonempty({ message: "Name field can't be empty" })
        .max(20, { message: "Name must be at most 20 characters long" })
    ,

    about: z
        .string()
        .trim()
        .max(100, { message: "About field must be at most 100 characters long" })
        .transform((val) => (val.length === 0 ? null : val))
        .nullable()
})