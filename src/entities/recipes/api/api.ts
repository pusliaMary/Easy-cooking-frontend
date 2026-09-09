import { api } from "@/shared/api/api";
import { createApiConfig } from "@/shared/api/helper";
import { buildQueryParams } from "@/shared/api/buildQueryParams";
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
        const queryString = params ? buildQueryParams(params) : "";
        const path = queryString ? `${url}?${queryString}` : url;

        return createApiConfig(path, "GET");
      },
      providesTags: ["Recipes"],
    }),

    // НОВЫЙ ЭНДПОИНТ: Получение одного рецепта по ID для предзаполнения формы
    getRecipeById: builder.query<Recipe, string>({
      query: (id) => createApiConfig(`${url}/${id}`, "GET"),
      providesTags: (_result, _error, id) => [{ type: "Recipes", id }],
    }),

    createRecipe: builder.mutation<Recipe, Partial<Recipe>>({
      query: (newRecipe) =>
        createApiConfig(`${url}`, "POST", newRecipe),
      invalidatesTags: ["Recipes"],
    }),

    deleteRecipe: builder.mutation<string, { _id: string }>({
      query: ({ _id }) => 
        createApiConfig(`${url}/${_id}`, "DELETE"),
      invalidatesTags: ["Recipes"],
    }),

        editRecipe: builder.mutation<Recipe, Partial<Recipe> & { _id: string }>({
      query: ({ _id, ...updatedRecipeData }) => {
        // Подставляем _id в URL, как прописано в роутере Express: "/recipes/:id"
        const pathWithId = `${url}/${_id}`; 
        
        // Передаем pathWithId аргументом в хелпер, метод PUT и payload в body
        return createApiConfig(pathWithId, "PUT", updatedRecipeData);
      },
      invalidatesTags: (_result, _error, { _id }) => [
        "Recipes", 
        { type: "Recipes", id: _id }
      ],
    }),

    uploadImage: builder.mutation<{ url: string }, FormData>({
      query: (formData) => 
        createApiConfig(`${url}/uploadImage`, "POST", formData),
    }),
  }),
});

// Экспортируем новый хук useGetRecipeByIdQuery
export const {
  useGetRecipesQuery,
  useGetRecipeByIdQuery, // <-- Добавлен сюда
  useCreateRecipeMutation,
  useDeleteRecipeMutation,
  useEditRecipeMutation,
  useUploadImageMutation,
} = recipesApi;
