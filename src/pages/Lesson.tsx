import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { MdPlayLesson } from "react-icons/md";
import {
  useAddLessonMutation,
  useGetAllLessonQuery,
} from "../app/features/APISlice";
import type { Lesson } from "../app/features/types";

type LessonFormValues = {
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string;
  price: number;
};

export default function LessonPage() {
  const { data: lessons = [], isFetching, isError } = useGetAllLessonQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [addLesson, { isLoading }] = useAddLessonMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LessonFormValues>();

  const onSubmit = async (data: LessonFormValues) => {
    try {
      await addLesson(data).unwrap();
      reset();
      setIsOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  if (isFetching) return <p>Loading…</p>;
  if (isError) return <p>Something went wrong</p>;

  const safeLessons: Lesson[] = Array.isArray(lessons)
    ? lessons
    : Array.isArray((lessons as any)?.data)
    ? (lessons as any).data
    : [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Lessons
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your lesson catalog and course content.
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdPlayLesson className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Lesson Catalog
              </h2>
            </div>
            <button
              onClick={() => setIsOpen(true)}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              Add Lesson
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lesson ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  video
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Class Level
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {safeLessons.map((lesson) => (
                <tr
                  key={lesson._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    {lesson._id}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                    <video src={lesson.video} width={200} controls />
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {lesson.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                    {lesson.description}
                  </td>
                  <td className="px-6 py-4">
                    <span className=" text-gray-900 dark:text-white">
                      {lesson.classLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {/* أزرار أكشن هنا لو عايز */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        as="div"
        className="relative z-10"
      >
        <div className="fixed mt-6 inset-0 z-10 w-screen overflow-y-auto bg-black/60">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl ring-1 ring-white/10">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-3"
              >
                {/* Title */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Title
                  </label>
                  <input
                    {...register("title", { required: "Title is required" })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900"
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Description
                  </label>
                  <textarea
                    {...register("description", {
                      required: "Description is required",
                    })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900 min-h-[100px]"
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Video */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Video URL
                  </label>
                  <input
                    {...register("video", {
                      required: "Video URL is required",
                    })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900"
                  />
                  {errors.video && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.video.message}
                    </p>
                  )}
                </div>

                {/* Class Level */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Class Level
                  </label>
                  <input
                    {...register("classLevel", {
                      required: "Class Level is required",
                    })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900"
                  />
                  {errors.classLevel && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.classLevel.message}
                    </p>
                  )}
                </div>

                {/* Date */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Scheduled Date
                  </label>
                  <input
                    type="date"
                    {...register("scheduledDate", {
                      required: "Date is required",
                    })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900"
                  />
                  {errors.scheduledDate && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.scheduledDate.message}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Price
                  </label>
                  <input
                    type="number"
                    {...register("price", {
                      required: "Price is required",
                      valueAsNumber: true,
                    })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900"
                  />
                  {errors.price && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    disabled={isLoading}
                    type="submit"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => reset()}
                    className="inline-flex items-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-600"
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="ml-auto inline-flex items-center rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
                  >
                    Close
                  </button>
                </div>
              </form>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
