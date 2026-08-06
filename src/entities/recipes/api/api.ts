import { api } from "@/shared/api/api";
import { createApiConfig } from "@/shared/api/helper";
import { buildQueryParams } from "@/shared/api//buildQueryParams"
import type { Recipe } from "../model/types";

export const recipesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Получение всех рецептов (идет на корень "/")
    getRecipes: builder.query<Recipe[], Record<string, any> | void>({
      query: (params) => {
        const queryString = params ? buildQueryParams(params) : "";
        const path = queryString ? `?${queryString}` : "";

        return createApiConfig(path, "GET");
      },
      providesTags: ["Recipes"],
    }),

    // 2. Сохранение рецепта (router.post('/saveRecipe'))
    saveRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (newRecipe) => createApiConfig("/saveRecipe", "POST", newRecipe),
      invalidatesTags: ["Recipes"],
    }),

    // 3. Удаление рецепта (router.delete('/deleteRecipe'))
    deleteRecipe: builder.mutation<string, { _id: string }>({
      query: (body) => createApiConfig("/deleteRecipe", "DELETE", body),
      invalidatesTags: ["Recipes"],
    }),

    // 4. Редактирование рецепта (router.put('/editRecipe'))
    editRecipe: builder.mutation<Recipe, Partial<Recipe> & { _id: string }>({
      query: (updatedRecipe) =>
        createApiConfig("/editRecipe", "PUT", updatedRecipe),
      invalidatesTags: ["Recipes"],
    }),
  }),
});

export const {
  useGetRecipesQuery,
  useSaveRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
} = recipesApi;
