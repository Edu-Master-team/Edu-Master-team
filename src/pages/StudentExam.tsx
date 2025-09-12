import { MdSchool } from "react-icons/md";

const studentExams = [
  {
    id: "SE-001",
    studentName: "Ahmed Hassan",
    examTitle: "JavaScript Fundamentals",
    score: 85,
    totalQuestions: 25,
    status: "Completed",
    submittedAt: "2024-01-18 14:30",
    duration: "58 minutes",
  },
  {
    id: "SE-002",
    studentName: "Fatima Ali",
    examTitle: "CSS Grid and Flexbox",
    score: 92,
    totalQuestions: 20,
    status: "Completed",
    submittedAt: "2024-02-02 10:15",
    duration: "42 minutes",
  },
  {
    id: "SE-003",
    studentName: "Mohammed Omar",
    examTitle: "JavaScript Fundamentals",
    score: 0,
    totalQuestions: 25,
    status: "In Progress",
    submittedAt: null,
    duration: "35 minutes",
  },
  {
    id: "SE-004",
    studentName: "Aisha Khalil",
    examTitle: "Database Design Principles",
    score: 78,
    totalQuestions: 28,
    status: "Completed",
    submittedAt: "2024-02-22 16:45",
    duration: "72 minutes",
  },
  {
    id: "SE-005",
    studentName: "Omar Ibrahim",
    examTitle: "React Advanced Concepts",
    score: 0,
    totalQuestions: 30,
    status: "Not Started",
    submittedAt: null,
    duration: "0 minutes",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/20 dark:text-green-400 dark:ring-green-400/20";
    case "In Progress":
      return "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-400/20";
    case "Not Started":
      return "bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/20 dark:text-gray-400 dark:ring-gray-400/20";
    case "Expired":
      return "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/20 dark:text-red-400 dark:ring-red-400/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20 dark:bg-gray-900/20 dark:text-gray-400 dark:ring-gray-400/20";
  }
};

const getScoreColor = (score: number, total: number) => {
  const percentage = (score / total) * 100;
  if (percentage >= 80) {
    return "text-green-600 dark:text-green-400";
  } else if (percentage >= 60) {
    return "text-yellow-600 dark:text-yellow-400";
  } else {
    return "text-red-600 dark:text-red-400";
  }
};

export default function StudentExam() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Student Exams
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Monitor student exam progress and results.
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdSchool className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Student Exam Records
              </h2>
            </div>
            <button className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
              Export Results
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Record ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exam Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Score
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Submitted At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {studentExams.map((studentExam) => (
                <tr
                  key={studentExam.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {studentExam.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {studentExam.studentName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {studentExam.examTitle}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${getScoreColor(
                        studentExam.score,
                        studentExam.totalQuestions
                      )}`}>
                      {studentExam.score}/{studentExam.totalQuestions}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(
                        studentExam.status
                      )}`}>
                      {studentExam.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {studentExam.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {studentExam.submittedAt || "Not submitted"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
