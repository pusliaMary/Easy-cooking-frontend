import { api } from "@/shared/api/api";
import { endpoints } from "@/shared/api/endpoints";
import { createApiConfig } from "@/shared/api/helper";

const authApi = api.injectEndpoints({
    endpoints: (build) => ({
        loginAdmin: build.mutation({
            query: (admin) => createApiConfig('POST', endpoints.auth.login, admin),
        }),
    }),
});

export const { useLoginAdminMutation } = authApi;