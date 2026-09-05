import { api } from "@/shared/api/api";
import { createApiConfig } from "@/shared/api/helper";
import { buildQueryParams } from "@/shared/api/buildQueryParams";
import { endpoints } from "@/shared/api/endpoints";
import type { Recipe, CategoryType, ProteinType } from "../model/types";

const url = endpoints.path.recipes; // This represents "/recipes"

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

    // FIXED: Changed from `${url}/saveRecipe` to clean root `${url}`
    createRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (newRecipe) =>
        createApiConfig(`${url}`, "POST", newRecipe),
      invalidatesTags: ["Recipes"],
    }),

    // FIXED: ID is now injected into the URL parameters path string safely: `/api/recipes/:id`
    deleteRecipe: builder.mutation<string, { _id: string }>({
      query: ({ _id }) => 
        createApiConfig(`${url}/${_id}`, "DELETE"),
      invalidatesTags: ["Recipes"],
    }),

    // FIXED: ID is pulled into parameters path, while remaining data forms the request body payload
    editRecipe: builder.mutation<Recipe, Partial<Recipe> & { _id: string }>({
      query: ({ _id, ...updatedRecipeData }) =>
        createApiConfig(`${url}/${_id}`, "PUT", updatedRecipeData),
      invalidatesTags: ["Recipes"],
    }),

    // CORRECT: This path string perfectly matches your backend endpoint definition
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
