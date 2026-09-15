import { api } from "@/shared/api/api";
import { createApiConfig } from "@/shared/api/helper";
import { endpoints } from "@/shared/api/endpoints";
import type { Recipe, CategoryType, ProteinType } from "../model/types";

const url = endpoints.path.recipes; // "/recipes"

export interface GetRecipesParams {
  limit?: number;
  page?: number;
  sort?: string;
  title?: string;
  category?: CategoryType;
  containsProtein?: boolean;
  containsFiber?: boolean;
  whatProtein?: ProteinType | ProteinType[];
  keyWords?: string | string[];
  "ingredients.name"?: string | string[];
  [key: string]:
    | string
    | number
    | boolean
    | string[]
    | ProteinType[]
    | undefined;
}

export const recipesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecipes: builder.query<Recipe[], GetRecipesParams | void>({
      query: (params) => {
        const path = params
          ? `${url}?${new URLSearchParams(params as unknown as Record<string, string>).toString()}`
          : url;

        return createApiConfig(path, "GET");
      },
      providesTags: ["Recipes"],
    }),

    getRecipeById: builder.query<Recipe, string>({
      query: (id) => createApiConfig(`${url}/${id}`, "GET"),
      providesTags: (_result, _error, id) => [{ type: "Recipes", id }],
    }),

    // ИСПРАВЛЕНО: Мутация теперь принимает чистый FormData
    createRecipe: builder.mutation<Recipe, FormData>({
      query: (formData) => createApiConfig(`${url}`, "POST", formData),
      invalidatesTags: ["Recipes"],
    }),

    deleteRecipe: builder.mutation<string, { _id: string }>({
      query: ({ _id }) => createApiConfig(`${url}/${_id}`, "DELETE"),
      invalidatesTags: ["Recipes"],
    }),

    // ИСПРАВЛЕНО: Мутация принимает ID и FormData отдельно
    editRecipe: builder.mutation<Recipe, { id: string; formData: FormData }>({
      query: ({ id, formData }) =>
        createApiConfig(`${url}/${id}`, "PUT", formData),
      invalidatesTags: (_result, _error, { id }) => [
        "Recipes",
        { type: "Recipes", id },
      ],
    }),

    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) =>
        createApiConfig(`${url}/uploadImage`, "POST", formData),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
  useUploadImageMutation,
} = recipesApi;
