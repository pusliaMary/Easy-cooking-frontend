import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { apiUrl } from "./endpoints";
import { getRouteAuth } from "../lib";

const baseQuery = fetchBaseQuery({
  baseUrl: `${apiUrl}/api`,
  credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authUser"); 
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
