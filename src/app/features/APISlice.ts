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

export interface Lesson {
  _id: string;
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string;
  price: number;
}

export interface IAddLesson {
  _id?: string;
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string;
  price: number;
}

export interface Admin {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  classLevel?: string;
  role: string;
  isVerified: boolean;
}

type ApiEnvelope<T> = { message: string; success: boolean; data: T };

const normalizeArray = <T>(res: any): T[] => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.items)) return res.items;
  if (res == null) return [];
  return [res];
};

export const APISlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://edu-master-delta.vercel.app",
    prepareHeaders: (headers, { getState }) => {
      const token =
        (getState() as any)?.auth?.token || localStorage.getItem("token");
      if (token) {
        headers.set("token", token);

        // لو في المستقبل غيّرته لـ Bearer:
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Admins", "Users", "Lessons"],
  endpoints: (builder) => ({
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
        responseHandler: (r) => r.text(),
        validateStatus: (res) => res.status >= 200 && res.status < 300,
      }),
      invalidatesTags: ["Admins"],
    }),

    getAllAdmins: builder.query<Admin[], void>({
      query: () => ({ url: "/admin/all-admin", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Admin[]> | Admin[]) =>
        normalizeArray<Admin>(resp),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a) => ({ type: "Admins" as const, id: a._id })),
              { type: "Admins" as const, id: "LIST" },
            ]
          : [{ type: "Admins" as const, id: "LIST" }],
    }),

    getAllUsers: builder.query<Admin[], void>({
      query: () => ({ url: "/admin/all-user", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Admin[]> | Admin[]) =>
        normalizeArray<Admin>(resp),
      providesTags: (result) =>
        result
          ? [
              ...result.map((u) => ({ type: "Users" as const, id: u._id })),
              { type: "Users" as const, id: "LIST" },
            ]
          : [{ type: "Users" as const, id: "LIST" }],
    }),

    addLesson: builder.mutation<Lesson, IAddLesson>({
      query: (body) => ({
        url: "/lesson",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lessons"],
    }),

    getAllLesson: builder.query<Lesson[], void>({
      query: () => ({ url: "/lesson", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Lesson[]> | Lesson[]) =>
        normalizeArray<Lesson>(resp),
      providesTags: (result) =>
        result
          ? [
              ...result.map((l) => ({ type: "Lessons" as const, id: l._id })),
              { type: "Lessons" as const, id: "LIST" },
            ]
          : [{ type: "Lessons" as const, id: "LIST" }],
    }),
  }),
});

export const {
  useLoginMutation,
  useCreateAdminMutation,
  useGetAllAdminsQuery,
  useGetAllUsersQuery,
  useAddLessonMutation,
  useGetAllLessonQuery,
} = APISlice;
