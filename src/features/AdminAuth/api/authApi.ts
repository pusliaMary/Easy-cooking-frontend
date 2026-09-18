import { api } from "@/shared/api/api";
import { endpoints } from "@/shared/api/endpoints";
import { createApiConfig } from "@/shared/api/helper";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginAdmin: build.mutation({
      query: (admin) => createApiConfig(endpoints.auth.login, "POST", admin),
    }),
    // ДОБАВЛЕНО: Эндпоинт фоновой проверки активной куки на бэкенде
    checkMe: build.query<{ username: string }, void>({
      query: () => createApiConfig("/me", "GET"), 
    }),
  }),
});

export const { useLoginAdminMutation, useCheckMeQuery } = authApi;
