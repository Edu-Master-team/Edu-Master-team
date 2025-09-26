import { Dialog, DialogPanel } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { MdDelete, MdPlayLesson } from "react-icons/md";
import ReactPlayer from "react-player";
import {
  useAddLessonMutation,
  useDeleteLessonMutation,
  useGetAllLessonQuery,
  useUpdateLessonMutation,
  type Lesson,
} from "../app/features/APISlice";

type LessonFormValues = {
  title: string;
  description: string;
  video: string;
  classLevel: string;
  scheduledDate: string; // yyyy-mm-dd
  price: number;
};

export default function LessonPage() {
  const {
    data: lessons = [],
    isFetching,
    isError,
    refetch,
  } = useGetAllLessonQuery(undefined, {
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [addLesson, { isLoading: isAdding }] = useAddLessonMutation();
  const [updateLesson, { isLoading: isUpdating }] = useUpdateLessonMutation();
  const [deleteLesson, { isLoading: isDeleting }] = useDeleteLessonMutation();

  const emptyDefaults: LessonFormValues = useMemo(
    () => ({
      title: "",
      description: "",
      video: "",
      classLevel: "",
      scheduledDate: new Date().toISOString().slice(0, 10),
      price: 0,
    }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LessonFormValues>({
    defaultValues: emptyDefaults,
  });

  // تهيئة قيم الفورم عند فتح الديالوج
  useEffect(() => {
    if (!isOpen) return;

    if (mode === "edit" && selectedLesson) {
      reset({
        title: selectedLesson.title ?? "",
        description: selectedLesson.description ?? "",
        video: selectedLesson.video ?? "",
        classLevel: selectedLesson.classLevel ?? "",
        scheduledDate: (selectedLesson as any)?.scheduledDate
          ? String((selectedLesson as any).scheduledDate).slice(0, 10)
          : new Date().toISOString().slice(0, 10),
        price: Number(selectedLesson.price ?? 0),
      });
    } else {
      reset(emptyDefaults);
    }
  }, [isOpen, mode, selectedLesson, reset, emptyDefaults]);

  const onSubmit = async (data: LessonFormValues) => {
    try {
      if (mode === "edit" && selectedLesson?._id) {
        // مهم: في التحديث بنشيل scheduledDate عشان ما يتبعتش ولا يتعدل
        const { scheduledDate, ...updateData } = data;
        await updateLesson({ id: selectedLesson._id, ...updateData , scheduledDate: selectedLesson.scheduledDate }).unwrap();
      } else {
        // في الإضافة بنبعت scheduledDate عادي
        await addLesson(data).unwrap();
      }
      reset(emptyDefaults);
      setIsOpen(false);
      setSelectedLesson(null);
      setMode("create");
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenCreate = () => {
    setMode("create");
    setSelectedLesson(null);
    setIsOpen(true);
  };

  const handleOpenEdit = (lesson: Lesson) => {
    setMode("edit");
    setSelectedLesson(lesson);
    setIsOpen(true);
  };

  const onDelete = async (lesson: Lesson) => {
    const ok = window.confirm(`Delete lesson "${lesson.title}"?`);
    if (!ok) return;
    try {
      await deleteLesson(lesson._id).unwrap();
      if (selectedLesson?._id === lesson._id) {
        setSelectedLesson(null);
        setMode("create");
        setIsOpen(false);
      }
      refetch();
    } catch (e) {
      console.error(e);
    }
  };

  const safeLessons: Lesson[] = Array.isArray(lessons)
    ? lessons
    : Array.isArray((lessons as any)?.data)
    ? (lessons as any).data
    : [];

  if (isError) return <p>Something went wrong</p>;

  const isBusy = isAdding || isUpdating || isDeleting;

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
              onClick={handleOpenCreate}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
              Add Lesson
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <caption className="text-3xl text-center text-gray-900 dark:text-white mb-4">
              Lessons
            </caption>

            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Lesson ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Video
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>

            {/* tbody ثابت لتفادي Unmount وبالتالي تفادي AbortError */}
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {safeLessons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8">
                    <p className="text-center text-gray-600 dark:text-gray-300">
                      No lessons found.
                    </p>
                  </td>
                </tr>
              ) : (
                safeLessons.map((lesson) => (
                  <tr
                    key={lesson._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white break-all">
                      {lesson._id}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      <div className="w-48 max-w-full aspect-video">
                        <ReactPlayer src={lesson.video} controls />
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {lesson.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                      {lesson.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {lesson.classLevel}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-4">
                        <button
                          className="cursor-pointer text-amber-500 text-2xl"
                          aria-label="Edit lesson"
                          onClick={() => handleOpenEdit(lesson)}
                          title="Edit">
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => onDelete(lesson)}
                          className="cursor-pointer text-red-700 text-2xl disabled:opacity-50"
                          aria-label="Delete lesson"
                          disabled={isDeleting}
                          title={isDeleting ? "Deleting..." : "Delete"}>
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {isFetching && safeLessons.length > 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-3">
                    <span className="block text-center text-sm text-gray-500 dark:text-gray-400 animate-pulse">
                      Updating…
                    </span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        as="div"
        className="relative z-10">
        {/* Overlay */}
        <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
        <div className="fixed mt-6 inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl ring-1 ring-white/10">
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 mt-3">
                <h3 className="text-lg font-semibold text-white">
                  {mode === "edit" ? "Edit Lesson" : "Add Lesson"}
                </h3>

                {/* Title */}
                <div>
                  <label className="block mb-1 text-gray-900 dark:text-white">
                    Title
                  </label>
                  <input
                    {...register("title", {
                      required: "Title is required",
                      minLength: { value: 2, message: "Too short" },
                    })}
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
                    placeholder="YouTube/Vimeo URL or direct MP4"
                  />
                  {errors.video && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.video.message}
                    </p>
                  )}
                </div>

                {/* Class Level */}
                <div>
                  <label className="block mb-1 text-white">Class Level</label>
                  <select
                    {...register("classLevel", {
                      required: "Class level is required",
                    })}
                    className="border rounded p-2 w-full bg-white/90 text-gray-900">
                    <option value="Grade 1 Secondary">Grade 1 Secondary</option>
                    <option value="Grade 2 Secondary">Grade 2 Secondary</option>
                    <option value="Grade 3 Secondary">Grade 3 Secondary</option>
                  </select>
                  {errors.classLevel && (
                    <p className="text-red-400 text-sm mt-1">
                      {errors.classLevel.message}
                    </p>
                  )}
                </div>

                {/* Scheduled Date */}
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
                    disabled={isBusy}
                    type="submit"
                    className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50">
                    {mode === "edit"
                      ? isUpdating
                        ? "Saving..."
                        : "Save changes"
                      : isAdding
                      ? "Adding..."
                      : "Submit"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      reset(
                        mode === "edit" && selectedLesson
                          ? {
                              title: selectedLesson.title ?? "",
                              description: selectedLesson.description ?? "",
                              video: selectedLesson.video ?? "",
                              classLevel: selectedLesson.classLevel ?? "",
                              scheduledDate: (selectedLesson as any)
                                ?.scheduledDate
                                ? String(
                                    (selectedLesson as any).scheduledDate
                                  ).slice(0, 10)
                                : new Date().toISOString().slice(0, 10),
                              price: Number(selectedLesson.price ?? 0),
                            }
                          : emptyDefaults
                      )
                    }
                    className="inline-flex items-center rounded-md bg-gray-700 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-600">
                    Reset
                  </button>

                  {mode === "edit" && selectedLesson && (
                    <button
                      type="button"
                      onClick={() => onDelete(selectedLesson)}
                      className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
                      disabled={isDeleting}
                      title={isDeleting ? "Deleting..." : "Delete lesson"}>
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setSelectedLesson(null);
                      setMode("create");
                    }}
                    className="ml-auto inline-flex items-center rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-600">
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
