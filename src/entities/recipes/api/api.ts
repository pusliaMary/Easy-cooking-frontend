import { api } from "@/shared/api/api";
import { createApiConfig } from "@/shared/api/helper";
import { buildQueryParams } from "@/shared/api/buildQueryParams";
import { endpoints } from "@/shared/api/endpoints";
import type { Recipe, CategoryType, ProteinType } from "../model/types";

const url = endpoints.path.recipes;

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
        const queryString = params ? buildQueryParams(params) : "";
        const path = queryString ? `${url}?${queryString}` : url;

        return createApiConfig(path, "GET");
      },
      providesTags: ["Recipes"],
    }),

    createRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (newRecipe) =>
        createApiConfig(`${url}/saveRecipe`, "POST", newRecipe),
      invalidatesTags: ["Recipes"],
    }),

    deleteRecipe: builder.mutation<string, { _id: string }>({
      query: (body) => createApiConfig(`${url}/deleteRecipe`, "DELETE", body),
      invalidatesTags: ["Recipes"],
    }),

    editRecipe: builder.mutation<Recipe, Partial<Recipe> & { _id: string }>({
      query: (updatedRecipe) =>
        createApiConfig(`${url}/editRecipe`, "PUT", updatedRecipe),
      invalidatesTags: ["Recipes"],
    }),

    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => 
        createApiConfig(`${url}/uploadImage`, "POST", formData),
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
  useUploadImageMutation,
} = recipesApi;
