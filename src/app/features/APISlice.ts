
export type NewExam = Omit<Exam, "_id">;
export type UpdateExamBody = Partial<Omit<Exam, "_id">>;

// src/features/api/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";

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
//---------------------------------------------------------

export interface Exam {

  _id: string;
  title: string;
  description: string;
  classLevel: string;
  duration: number;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}
//---------------------------------------------------------
export interface Question {
  _id: string;
  text: string;
  type: string;
  options?: string[];
  correctAnswer: string;
  exam: string;
  points: number;
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
    baseUrl: "https://edu-master-psi.vercel.app",
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
  tagTypes: ["Admins", "Users", "Lessons", "Exam", "questions"],
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
        validateStatus: (res) => res.status >= 200 && res.status < 300,
      }),
      invalidatesTags: ["Admins"],
    }),

    getAllAdmins: builder.query<Admin[], void>({
      query: () => {
        return {
          url: "/admin/all-admin",
          method: "GET",
        };
      },
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

    // UPDATE lesson
    updateLesson: builder.mutation<Lesson, { id: string } & IAddLesson>({
      query: ({ id, ...body }) => ({
        url: `/lesson/${id}`,
        method: "PUT",
        body,
      }),
      // حدّث كاش الدرس المعدّل + قايمة الدروس
      invalidatesTags: (_result, _error, arg) =>
        _result
          ? [
              { type: "Lessons", id: arg.id },
              { type: "Lessons", id: "LIST" },
            ]
          : [{ type: "Lessons", id: "LIST" }],
    }),

    // DELETE lesson
    deleteLesson: builder.mutation<
      { message?: string; success?: boolean } | void,
      string
    >({
      query: (id) => ({
        url: `/lesson/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Lessons", id },
        { type: "Lessons", id: "LIST" },
      ],
    }),

    //----------------------------------------------------------------------------------------------------------------
    getAllExam: builder.query<Exam[], void>({
      query: () => ({ url: "/exam", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Exam[]> | Exam[]) =>
        normalizeArray<Exam>(resp),
      providesTags: (result) =>
        result
          ? [
              ...result.map((l) => ({ type: "Exam" as const, id: l._id })),
              { type: "Exam" as const, id: "LIST" },
            ]
          : [{ type: "Exam" as const, id: "LIST" }],
    }),

    addExam: builder.mutation<Exam, NewExam>({
      query: (body) => ({
        url: "/exam",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Exam"],
      async onQueryStarted(_arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(`Exam added successfully`);
        } catch (error) {
          toast.error("Failed to add the new exam");
        }
      },
    }),

    updateExam: builder.mutation<void, { id: string; body: UpdateExamBody }>({
      query: ({ id, body }) => ({
        url: `/exam/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Exam"],
      async onQueryStarted(_id, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(`Exam updated successfully`);
        } catch (error) {
          toast.error("Failed to update exam");
        }
      },
    }),

    deleteExam: builder.mutation<void, string>({
      query: (id) => ({
        url: `/exam/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Exam"],
      async onQueryStarted(_id, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(`Exam deleted successfully`);
        } catch (error) {
          toast.error("Failed to delete exam");
        }
      },
    }),

    //-----------------------------------------------------------------------------------------------

    addQuestion: builder.mutation<void, NewQuestion>({
      query: (body) => ({
        url: `/question`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["questions"],
    }),

    updateQuestion: builder.mutation<void, { id: string; body: UpdateQuestionBody }>({
      query: ({ id, body }) => ({
        url: `/question/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["questions"],
      async onQueryStarted(_id, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(`questions updated successfully`);
        } catch (error) {
          toast.error("Failed to update questions");
        }
      },
    }),

    getAllQuestion: builder.query<Question[], void>({
      query: () => ({ url: "/question", method: "GET" }),
      transformResponse: (resp: ApiEnvelope<Question[]> | Question[]) =>
        normalizeArray<Question>(resp),
      providesTags: (result) =>
        result
          ? [
              ...result.map((l) => ({ type: "questions" as const, id: l._id })),
              { type: "questions" as const, id: "LIST" },
            ]
          : [{ type: "questions" as const, id: "LIST" }],
    }),

    deleteQuestion: builder.mutation<void, string>({
      query: (id) => ({
        url: `/question/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["questions"],
      async onQueryStarted(_id, { queryFulfilled }) {
        try {
          await queryFulfilled;
          toast.success(`Question deleted successfully`);
        } catch (error) {
          toast.error("Failed to delete question");
        }
      },
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
  // الجديد
  useUpdateLessonMutation,
  useDeleteLessonMutation,
  useGetAllExamQuery,
  useAddExamMutation,
  useDeleteExamMutation,
  useUpdateExamMutation,
  useAddQuestionMutation,
  useGetAllQuestionQuery,
  useDeleteQuestionMutation,
  useUpdateQuestionMutation,
} = APISlice;

export type NewQuestion = Omit<Question, "_id">;
export type UpdateQuestionBody = Partial<NewQuestion>;
