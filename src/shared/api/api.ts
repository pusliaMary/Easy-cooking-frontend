import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import Cookies from 'js-cookie'
import { apiUrl } from "./endpoints";
import { getRouteAuth } from '../lib/getRoutes/getRoutes'


const baseQuery = fetchBaseQuery({
        baseUrl: `${apiUrl}/api`,
        prepareHeaders: (headers) => {
        const token = Cookies.get("authToken");
        if (token) {
            headers.set("Authorization", token);
        }
        return headers;
    }
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
        Cookies.remove("authToken");

        if (typeof window !== "undefined") {
            window.location.href = getRouteAuth();
        }
    }

    return result;
};

export const api = createApi({
    reducerPath: "api",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["Recipes"],
    endpoints: () => ({}),
});
