import { api } from "@/shared/api/api";
import { endpoints } from "@/shared/api/endpoints";
import { createApiConfig } from "@/shared/api/helper";

const authApi = api.injectEndpoints({
  endpoints: (build) => ({
    loginAdmin: build.mutation({
      query: (admin) => createApiConfig(endpoints.auth.login, "POST", admin),
    }),
    logoutAdmin: build.mutation<void, void>({
      query: () => createApiConfig(endpoints.auth.logout, "DELETE"),
    }),
    
    checkMe: build.query<{ username: string }, void>({
      query: () => createApiConfig("/me", "GET"),
    }),
  }),
});

export const { 
  useLoginAdminMutation, 
  useLogoutAdminMutation, 
  useCheckMeQuery
} = authApi;
