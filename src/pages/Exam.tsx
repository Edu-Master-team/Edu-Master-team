import { Dialog, DialogPanel } from "@headlessui/react";
import { useState } from "react";

import {
  useAddExamMutation,
  useDeleteExamMutation,
  useGetAllExamQuery,
  useUpdateExamMutation,
} from "../app/features/APISlice";
import { useForm } from "react-hook-form";
import { MdAssignment } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import { FiEdit } from "react-icons/fi";

const getErrorMessage = (e: unknown) => {
  const err: any = e as any;
  return err?.data?.message || err?.data?.error || err?.message || "Unknown error";
};


interface ExamFormValues {
  title: string;
  description: string;
  duration: number;
  classLevel: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

interface Exam {
  _id: string;
  title: string;
  description: string;
  duration: number;
  classLevel: string;
  startDate: string;
  endDate: string;
  isPublished: boolean;
}

export default function Exam() {
  const { data: exams = [], isFetching, isError } = useGetAllExamQuery();
  const [addExam, { isLoading: isAdding, isError: isErrorAddExam, error: addExamError }] = useAddExamMutation();
  const [deleteExam] = useDeleteExamMutation();
  const [updateExam, { isLoading: isUpdating, isError: isErrorUpdateExam, error: updateExamError }] = useUpdateExamMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);


  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ExamFormValues>({
    defaultValues: {
      title: "",
      description: "",
      duration: 0,
      classLevel: "",
      startDate: "",
      endDate: "",
      isPublished: false,
    },
  });

  const openCreate = () => {
    setEditingExam(null);
    reset();
    setIsOpen(true);
  };

  const openEdit = (exam: Exam) => {
    setEditingExam(exam);
    setValue("title", exam.title);
    setValue("description", exam.description);
    setValue("duration", exam.duration);
    setValue("classLevel", exam.classLevel);
    setValue("startDate", new Date(exam.startDate).toISOString().split("T")[0]);
    setValue("endDate", new Date(exam.endDate).toISOString().split("T")[0]);
    setValue("isPublished", exam.isPublished);
    setIsOpen(true);
  };

  const onSubmit = async (data: ExamFormValues) => {
    try {
      if (editingExam) {
        await updateExam({ id: editingExam._id, body: data }).unwrap();
      } else {
        await addExam(data ).unwrap();
      }
      reset();
      setIsOpen(false);
      setEditingExam(null);
    } catch (e) {
      console.error(editingExam ? "Update exam error:" : "Add exam error:", e);
    }
  };



  if (isFetching) return <p className="text-gray-500 dark:text-gray-400">Loading…</p>;
  if (isError) return <p className="text-red-500">Something went wrong</p>;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Exams</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Create and manage examinations and assessments.
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdAssignment className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-white">
                Exam Management
              </h2>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Create Exam
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exam ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Class Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date Range
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            {exams.length > 0 ? (
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {exams.map((exam: Exam) => (
                  <tr
                    key={exam._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {exam._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-white">
                      {exam.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-white max-w-xs truncate">
                      {exam.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {exam.duration} mins
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                      {exam.classLevel}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(exam.startDate).toLocaleDateString()} -{" "}
                      {new Date(exam.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`text-white rounded px-2 py-1 text-xs font-medium ${
                          exam.isPublished ? "bg-green-400" : "bg-amber-300"
                        }`}
                      >
                        {exam.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="flex gap-3">
                        <RiDeleteBin2Fill
                          onClick={() => deleteExam(exam._id)}
                          aria-label={`Delete exam ${exam.title}`}
                          className="text-lg cursor-pointer text-red-500"
                        />
                        <FiEdit
                          className="text-lg cursor-pointer text-blue-500 hover:text-blue-700"
                          onClick={() => openEdit(exam)}
                          aria-label={`Edit exam ${exam.title}`}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            ) : (
              <tbody>
                <tr>
                  <td
                    colSpan={8}
                    className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    There are no exams yet.
                  </td>
                </tr>
              </tbody>
            )}
          </table>
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => {
          setIsOpen(false);
          setEditingExam(null);
          reset();
        }}
        as="div"
        className="relative z-10"
        aria-labelledby="exam-dialog-title"
      >
    <div className="fixed mt-6 inset-0 z-10 w-screen overflow-y-auto bg-black/60">
      <div className="flex min-h-full items-center justify-center p-4">
      <DialogPanel className="w-full max-w-md rounded-xl bg-white/5 p-6 backdrop-blur-2xl ring-1 ring-white/10">
            <h2
              id="exam-dialog-title"
              className="text-xl font-semibold text-white text-center"
            >
              {editingExam ? "Edit Exam" : "Create New Exam"}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
              <div>
                <label className="block mb-1 text-white">
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

              <div>
                <label className="block mb-1 text-white">
                  Description
                </label>
                <textarea
                  {...register("description", {
                    minLength: {
                      value: 10,
                      message: "Description must be at least 10 characters long",
                    },
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

              <div>
                <label className="block mb-1 text-white">
                  Duration (minutes)
                </label>
                <input
                  type="number"
                  {...register("duration", {
                    required: "Duration is required",
                    min: { value: 1, message: "Duration must be a positive number" },
                  })}
                  className="border rounded p-2 w-full bg-white/90 text-gray-900"
                />
                {errors.duration && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.duration.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-white">
                  Class Level
                </label>
                <select
                  {...register("classLevel", {
                    required: "Class level is required",
                  })}
                  className="border rounded p-2 w-full bg-white/90 text-gray-900"
                >
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

              <div>
                <label className="block mb-1 text-white">
                  Start Date
                </label>
                <input
                  type="date"
                  {...register("startDate", {
                    required: "Start date is required",
                  })}
                  className="border rounded p-2 w-full bg-white/90 text-gray-900"
                />
                {errors.startDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.startDate.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 text-white">
                  End Date
                </label>
                <input
                  type="date"
                  {...register("endDate", {
                    required: "End date is required",
                  })}
                  className="border rounded p-2 w-full bg-white/90 text-gray-900"
                />
                {errors.endDate && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.endDate.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  {...register("isPublished")}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                />
                <label className="ml-2 block text-white">
                  Publish Exam
                </label>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  disabled={isAdding || isUpdating}
                  type="submit"
                  className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {(isAdding || isUpdating) ? (
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  ) : null}
                  {editingExam ? "Update" : "Submit"}
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
                  onClick={() => {
                    setIsOpen(false);
                    setEditingExam(null);
                    reset();
                  }}
                  className="ml-auto inline-flex items-center rounded-md bg-zinc-700 px-3 py-2 text-sm font-semibold text-white hover:bg-zinc-600"
                >
                  Close
                </button>
              </div>

              {isErrorAddExam && !editingExam && (
                <p className="text-red-500">
                  {getErrorMessage(addExamError as any) || "An error occurred while adding the exam."}
                </p>
              )}
              {isErrorUpdateExam && editingExam && (
                <p className="text-red-500">
                  {getErrorMessage(updateExamError as any) || "An error occurred while updating the exam."}
                </p>
              )}
            </form>
          </DialogPanel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
