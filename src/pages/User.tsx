// src/pages/AdminsPage.tsx
import { useMemo } from "react";
import { MdAdminPanelSettings } from "react-icons/md";
import { useGetAllUsersQuery } from "../app/features/APISlice";

export default function UserPage() {
  const { data = [], isFetching, isError, refetch } = useGetAllUsersQuery();

  // شيل أي حقول حساسة لو راجعة بالغلط (زي password)
  const admins = useMemo(
    () =>
      Array.isArray(data) ? data.map(rest => rest) : [],
    [data]
  );

  const roleBadgeClass = (role?: string) => {
    switch (role) {
      case "superAdmin":
        return "text-red-700 bg-red-50 ring-red-600/20 dark:text-red-300 dark:bg-red-500/10 dark:ring-red-400/30";
      case "admin":
        return "text-blue-700 bg-blue-50 ring-blue-600/20 dark:text-blue-300 dark:bg-blue-500/10 dark:ring-blue-400/30";
      default:
        return "text-gray-700 bg-gray-50 ring-gray-600/20 dark:text-gray-300 dark:bg-gray-500/10 dark:ring-gray-400/30";
    }
  };

  const verifiedBadgeClass = (ok: boolean) =>
    ok
      ? "text-emerald-700 bg-emerald-50 ring-emerald-600/20 dark:text-emerald-300 dark:bg-emerald-500/10 dark:ring-emerald-400/30"
      : "text-amber-700 bg-amber-50 ring-amber-600/20 dark:text-amber-300 dark:bg-amber-500/10 dark:ring-amber-400/30";

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Manage system administrators and their permissions.
        </p>
      </div>

      <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 dark:bg-gray-800 dark:ring-gray-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <MdAdminPanelSettings className="h-6 w-6 text-gray-400 mr-3" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Users Accounts
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={refetch}
                className="inline-flex items-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600">
                Refresh
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Verified
                </th>
              </tr>
            </thead>

            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {isFetching && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-sm text-gray-500 dark:text-gray-300">
                    Loading…
                  </td>
                </tr>
              )}

              {isError && !isFetching && (
                <tr>
                  <td colSpan={5} className="px-6 py-6 text-sm text-red-600">
                    Failed to load admins. Try refresh.
                  </td>
                </tr>
              )}

              {!isFetching && !isError && admins.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-6 text-sm text-gray-500 dark:text-gray-300">
                    No admins found.
                  </td>
                </tr>
              )}

              {!isFetching &&
                !isError &&
                admins.map((admin: any) => (
                  <tr
                    key={admin._id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {admin.fullName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {admin.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {admin.phoneNumber || "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${roleBadgeClass(
                          admin.role
                        )}`}>
                        {admin.role || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${verifiedBadgeClass(
                          !!admin.isVerified
                        )}`}>
                        {admin.isVerified ? "Verified" : "Pending"}
                      </span>
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
