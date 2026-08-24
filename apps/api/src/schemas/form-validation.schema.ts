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
        .max(100, { message: "About must be at most 100 characters long" })
        .transform((val) => (val.length === 0 ? null : val))
        .nullable()
})

export const PostFormSchema = z.object({
    content: z
        .string()
        .trim()
        .nonempty({ message: "Post cannot be empty" })
        .max(280, { message: "Post must be at most 280 characters" })
})

export const CommentFormSchema = z.object({
    content: z
        .string()
        .trim()
        .nonempty({ message: "Comment cannot be empty" })
        .max(280, { message: "Comment must be at most 280 characters" })
})