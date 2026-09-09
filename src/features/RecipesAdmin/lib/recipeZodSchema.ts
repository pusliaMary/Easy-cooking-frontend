import { z } from "zod";
import { categories, proteins } from "@/entities/recipes";
import {
  MAX_FILE_SIZE_BYTES,
  MAX_FILE_SIZE_MB,
  ACCEPTED_IMAGE_TYPES,
} from "@/shared/ui/UploadImage/lib/constants";

const titleRegex = /^[A-Za-zА-Яа-яЁё0-9\s.,\-"'«»!?:()]+$/;

export const recipeZodSchema = z
  .object({
    category: z.enum(categories, {
      message: "Choose a category",
    }),

    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters long")
      .max(80, "Title must be less than 80 characters")
      .regex(titleRegex, "Title contains invalid characters"),

    containsProtein: z.boolean({
      message: "Protein status is required",
    }),

    whatProtein: z.array(z.enum(proteins)),

    containsFiber: z.boolean({
      message: "Fiber status is required",
    }),

    ingredients: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(3, "Ingredient name cannot be empty")
            .max(100),
        }),
      )
      .min(3, "Add at least three ingredients"),

    steps: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(10, "Step description cannot be empty")
            .max(500),
        }),
      )
      .min(2, "Add at least two steps"),

    keyWords: z
      .array(
        z.object({
          name: z
            .string()
            .trim()
            .min(3, "Keyword's name cannot be empty")
            .max(500),
        }),
      )
      .min(2, "Add at least two keywords"),

    uploadImage: z
      .array(
        z.object({
          id: z.string(),
          preview: z.string(),
          // ИСПРАВЛЕНО: Сделали .optional(), чтобы старая картинка по ссылке проходила валидацию
          file: z
            .instanceof(File)
            .refine(
              (file) => file.size <= MAX_FILE_SIZE_BYTES,
              `Max image size is ${MAX_FILE_SIZE_MB}MB`,
            )
            .refine(
              (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
              "Unsupported format",
            )
            .optional(), 
        }),
      )
      .min(1, "Image is required")
      .max(1, "Only one image is allowed"),
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

export type RecipeFormInput = z.infer<typeof recipeZodSchema>;
