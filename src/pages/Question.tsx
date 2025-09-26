import { useEffect, useState } from "react"; // Added useEffect
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FiEdit } from "react-icons/fi";
import { MdQuiz } from "react-icons/md";
import { RiDeleteBin2Fill } from "react-icons/ri";
import {
  useAddQuestionMutation,
  useDeleteQuestionMutation,
  useGetAllExamQuery,
  useGetAllQuestionQuery,
  useUpdateQuestionMutation,
} from "../app/features/APISlice";

// removed unused QuestionObject
function createQuestion(data: any) {
  console.log(data);
  const baseQuestion = {
    type: data.type,
    text: data.text,
    exam: data.exam,
    points: parseInt(data.points),
    correctAnswer: data.correctAnswer,
  };

  if (data.type === "multiple-choice") {
    return {
      ...baseQuestion,
      options: [data.option1, data.option2, data.option3],
    };
  } else {
    return {
      ...baseQuestion,
    };
  }
}

function Dialog({ isOpen, onClose, children, title }: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full m-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
            ✕
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function QuestionForm({ onClose, defaultValues, isUpdate = false }: any) {
  const { data: allExams = [] } = useGetAllExamQuery();
  const [addQuestion, { isLoading: addLoading }] = useAddQuestionMutation();
  const [updateQuestion, { isLoading: updateLoading }] =
    useUpdateQuestionMutation();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: defaultValues || {
      type: "",
      text: "",
      option1: "",
      option2: "",
      option3: "",
      correctAnswer: "",
      exam: "",
      points: "",
    },
  });

  const questionType = watch("type", defaultValues?.type || "true-false");
  const isLoading = isUpdate ? updateLoading : addLoading;

  // Enhanced validation for correctAnswer: required and non-empty
  const correctAnswerValidation = {
    required: "Correct answer is required",
    validate: (value: string) =>
      value.trim() !== "" || "Correct answer cannot be empty",
  };

  const handleFormSubmit = async (data: any) => {
    const questionData = createQuestion(data);
    try {
      console.log("Submitting:", questionData);
      if (isUpdate) {
        await updateQuestion({
          id: defaultValues._id,
          body: questionData,
        }).unwrap(); // Corrected syntax
        toast.success(`Question updated successfully`);
      } else {
        await addQuestion(questionData).unwrap();
        toast.success(`Question added successfully`);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Failed to process question:", error);
      toast.error(
        (error as any)?.data?.message || "Failed to process question"
      );
    }
  };

  // Pre-fill form for updates
  useEffect(() => {
    if (defaultValues && isUpdate) {
      setValue("type", defaultValues.type);
      setValue("text", defaultValues.text);
      setValue("correctAnswer", defaultValues.correctAnswer || "");
      setValue("exam", defaultValues.exam);
      setValue("points", defaultValues.points || "");
      if (defaultValues.type === "multiple-choice" && defaultValues.options) {
        setValue("option1", defaultValues.options[0] || "");
        setValue("option2", defaultValues.options[1] || "");
        setValue("option3", defaultValues.options[2] || "");
      }
    }
  }, [defaultValues, isUpdate, setValue]);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label className="block font-semibold mb-1 text-white">
          Choose Question Type
        </label>
        <select
          {...register("type")}
          className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isUpdate} // Prevent type change during update
        >
          <option value="multiple-choice">Multiple Choice</option>
          <option value="true-false">True/False</option>
          <option value="short-answer">Short Answer</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1 text-white">Question</label>
        <input
          {...register("text", { required: "Question is required" })}
          className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Is the earth flat?"
        />
        {errors.text && (
          <p className="text-red-500 text-sm">{String(errors.text.message)}</p>
        )}
      </div>

      {questionType === "multiple-choice" && (
        <div>
          <label className="block font-semibold mb-1 text-white">Options</label>
          <div className="flex gap-3">
            <input
              type="text"
              {...register("option1", { required: "Option is required" })}
              placeholder="Option one"
              className="bg-white/90 text-gray-900 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <input
              type="text"
              {...register("option2", { required: "Option is required" })}
              placeholder="Option two"
              className="bg-white/90 text-gray-900 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
            <input
              type="text"
              {...register("option3", { required: "Option is required" })}
              placeholder="Option three"
              className="bg-white/90 text-gray-900 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
            />
          </div>
          {errors.option1 && (
            <p className="text-red-500 text-sm">
              {String(errors.option1.message)}
            </p>
          )}
          {errors.option2 && (
            <p className="text-red-500 text-sm">
              {String(errors.option2.message)}
            </p>
          )}
          {errors.option3 && (
            <p className="text-red-500 text-sm">
              {String(errors.option3.message)}
            </p>
          )}

          <label className="block font-semibold mb-1 mt-2 text-white">
            Correct Answer
          </label>
          <input
            type="text"
            {...register("correctAnswer", correctAnswerValidation)}
            className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="No, the Earth is spherical"
          />
          {errors.correctAnswer && (
            <p className="text-red-500 text-sm">
              {String(errors.correctAnswer.message)}
            </p>
          )}
        </div>
      )}

      {questionType === "true-false" && (
        <div>
          <label className="block font-semibold mb-1 text-white">
            Correct Answer
          </label>
          <select
            {...register("correctAnswer", correctAnswerValidation)}
            className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select...</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
          {errors.correctAnswer && (
            <p className="text-red-500 text-sm">
              {String(errors.correctAnswer.message)}
            </p>
          )}
        </div>
      )}

      {questionType === "short-answer" && (
        <div>
          <label className="block font-semibold mb-1 text-white">
            Correct Answer
          </label>
          <input
            type="text"
            {...register("correctAnswer", correctAnswerValidation)}
            className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter reference answer"
          />
          {errors.correctAnswer && (
            <p className="text-red-500 text-sm">
              {String(errors.correctAnswer.message)}
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block font-semibold mb-1 text-white">Exam</label>
        <select
          {...register("exam", { required: "You must choose an exam" })}
          className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select Exam...</option>
          {allExams?.map((exam) => (
            <option key={exam._id} value={exam._id}>
              {exam.title}
            </option>
          ))}
        </select>
        {errors.exam && (
          <p className="text-red-500 text-sm">{String(errors.exam.message)}</p>
        )}
      </div>

      <div>
        <label className="block font-semibold mb-1 text-white">Points</label>
        <input
          type="number"
          {...register("points", {
            required: "Points are required",
            min: { value: 1, message: "Points must be greater than 0" },
          })}
          className="bg-white/90 text-gray-900 w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="3 points"
        />
        {errors.points && (
          <p className="text-red-500 text-sm">
            {String(errors.points.message)}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        disabled={isLoading}>
        {isLoading
          ? "Processing..."
          : isUpdate
          ? "Update Question"
          : "Create Question"}
      </button>
    </form>
  );
}

export default function Question() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState("multiple");
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const { data: questions = [] } = useGetAllQuestionQuery();
  const [deleteQuestion] = useDeleteQuestionMutation();

  const handleOpenDialog = (type: any) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleOpenUpdateDialog = (question: any) => {
    setSelectedQuestion(question);
    setUpdateDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuestion(null);
    setUpdateDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Questions
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage your question bank and create assessments.
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdQuiz className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Question Bank
              </h2>
            </div>
            <button
              onClick={() => handleOpenDialog("multiple")}
              className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Add Question
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Correct Answer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exam
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exam Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Points
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {questions.map((question) => (
                <tr
                  key={question._id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {question.text}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {question.correctAnswer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {question.exam}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {question.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {question.points}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="flex gap-3">
                      <RiDeleteBin2Fill
                        onClick={() => deleteQuestion(question._id)}
                        className="text-lg cursor-pointer text-red-500"
                      />
                      <FiEdit
                        onClick={() => handleOpenUpdateDialog(question)}
                        className="text-lg cursor-pointer text-blue-500 hover:text-blue-700"
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog
        isOpen={dialogOpen}
        onClose={handleCloseDialog}
        title={`Add ${
          dialogType === "multiple-choice"
            ? "Multiple Choice"
            : dialogType === "true-false"
            ? "True/False"
            : "Short Answer"
        } Question`}>
        <QuestionForm onClose={handleCloseDialog} defaultValues={null} />
      </Dialog>

      <Dialog
        isOpen={updateDialogOpen}
        onClose={handleCloseDialog}
        title="Update Question">
        <QuestionForm
          onClose={handleCloseDialog}
          defaultValues={selectedQuestion}
          isUpdate={true}
        />
      </Dialog>
    </div>
  );
}
