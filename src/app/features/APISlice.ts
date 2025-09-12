// src/features/api/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface LoginBody {
  email?: string;
  phoneNumber?: string;
  password: string;
}
export interface LoginResp {
  message: string;
  success: boolean;
  token: string;
}

export interface CreateAdminBody {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  cpassword: string;
}
export interface CreateAdminBody {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  cpassword: string;
}

export interface Admin {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  classLevel?: string;
  role: string; // "admin" | "superAdmin" | ...
  isVerified: boolean;
  // password?: string;   // جاي من السيرفر كهاش أحياناً — ما نستخدموش
}

type ApiEnvelope<T> = { message: string; success: boolean; data: T };

export const APISlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://edu-master-delta.vercel.app",
    // هنمرّر التوكن من الـ auth slice تحت
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any)?.auth?.token;
      if (token) headers.set("token", token);
      return headers;
    },
  }),
  tagTypes: ["Admins", "Users"],
  endpoints: (builder) => ({
    // POST /auth/login  -> بيرجع token
    login: builder.mutation<LoginResp, LoginBody>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),

    createAdmin: builder.mutation<void, CreateAdminBody>({
      query: (body) => ({
        url: "/admin/create-admin",
        method: "POST",
        body,
        responseHandler: (response) => response.text(),
        validateStatus: (response, _body) =>
          response.status >= 200 && response.status < 300,
      }),
      invalidatesTags: ["Admins"],
    }),

    getAllAdmins: builder.query<Admin[], void>({
      query: () => ({ url: "/admin/all-admin", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Admin[]>) => resp?.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: "Admins" as const, id: a._id })),
              { type: "Admins" as const, id: "LIST" },
            ]
          : [{ type: "Admins" as const, id: "LIST" }],
    }),

    // GET /admin/all-user
    getAllUsedrs: builder.query<any[], void>({
      query: () => ({
        url: "/admin/all-user",
        method: "GET",
      }),
      providesTags: ["Users"],
    }),

    getAllUsers: builder.query<Admin[], void>({
      query: () => ({ url: "/admin/all-user", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Admin[]>) => resp?.data ?? [],
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: "Users" as const, id: a._id })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useGetAllUsersQuery,
} = APISlice;
