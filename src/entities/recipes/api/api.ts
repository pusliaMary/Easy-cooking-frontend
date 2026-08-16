import { api } from "@/shared/api/api";
import { createApiConfig } from "@/shared/api/helper";
import { buildQueryParams } from "@/shared/api/buildQueryParams";
import { endpoints } from "@/shared/api/endpoints";
import type { Recipe } from "../model/types";

// Переменная со значением "/recipes"
const url = endpoints.path.recipes;

export const recipesApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Получение рецептов (Идет на: /api/recipes)
    getRecipes: builder.query<Recipe[], Record<string, any> | void>({
      query: (params) => {
        const queryString = params ? buildQueryParams(params) : "";
        const path = queryString ? `${url}?${queryString}` : url;
        
        return createApiConfig(path, "GET"); 
      },
      providesTags: ["Recipes"],
    }),

    // 2. Сохранение рецепта (Идет на: /api/recipes/saveRecipe) - ИСПРАВЛЕНО
    saveRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (newRecipe) => createApiConfig(`${url}/saveRecipe`, "POST", newRecipe),
      invalidatesTags: ["Recipes"],
    }),

    // 3. Удаление рецепта (Идет на: /api/recipes/deleteRecipe) - ИСПРАВЛЕНО
    deleteRecipe: builder.mutation<string, { _id: string }>({
      query: (body) => createApiConfig(`${url}/deleteRecipe`, "DELETE", body),
      invalidatesTags: ["Recipes"],
    }),

    // 4. Редактирование рецепта (Идет на: /api/recipes/editRecipe) - ИСПРАВЛЕНО
    editRecipe: builder.mutation<Recipe, Partial<Recipe> & { _id: string }>({
      query: (updatedRecipe) =>
        createApiConfig(`${url}/editRecipe`, "PUT", updatedRecipe),
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
