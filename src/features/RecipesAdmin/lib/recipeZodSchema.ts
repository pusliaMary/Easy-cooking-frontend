import { categories, proteins } from "@/entities/recipes";
import { z } from "zod";

const titleRegex = /^[A-Za-zА-Яа-яЁё0-9\s.,\-"'«»!?:()]+$/;

const MAX_FILE_SIZE = 6 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
];

export const recipeZodShema = z
  .object({
    category: z
      .array(z.enum(categories))
      .min(1, "Choose at least one category"),
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long")
      .max(80, "Title must be less than 80 characters")
      .regex(titleRegex, "Title contains invalid characters"),

    containsProtein: z.boolean().default(false),

    whatProtein: z.array(z.enum(proteins)).default([]),

    containsFiber: z.boolean(),

    ingredients: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(3, "Ingredient name cannot be empty")
            .max(100, "Ingredient name is too long"),
        }),
      )
      .min(1, "Add at least three ingredients"),

    steps: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(10, "Step description cannot be empty")
            .max(500, "Step description is too long"),
        }),
      )
      .min(2, "Add at least two steps"),

    keyWords: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(15, "Keyword's name cannot be empty")
            .max(500, "Keyword's name is too long"),
        }),
      )
      .min(2, "Add at least two keywords"),

    uploadImage: z
      .instanceof(File, { message: "Image is required" })
      .refine((file) => file.size <= MAX_FILE_SIZE, "Max image size is 5MB")
      .refine(
        (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
        "Only .jpg, .jpeg, .png and .webp formats are supported",
      )
    
    })

  .superRefine((data, ctx) => {
    if (data.containsProtein && data.whatProtein.length === 0) {
      ctx.addIssue({
        code: "custom",
        message: "Choose at least one protein type",
        path: ["whatProtein"],
      });
    }
  });
