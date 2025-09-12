import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateAdminMutation } from "../app/features/APISlice";

type FormValues = {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  cpassword: string;
};

export default function AddAdminDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [createAdmin, { isLoading }] = useCreateAdminMutation();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    mode: "onChange",
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
      cpassword: "",
    },
  });

  const pwd = watch("password");

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      await createAdmin(values).unwrap(); // سيرفر بيرجع No body بس 2xx = نجاح
      console.log(values);

      reset();
      onClose();
    } catch (e: any) {
      // لو السيرفر رجّع رسالة خطأ
      setError("root", {
        message:
          e?.data?.message ||
          e?.error ||
          "Failed to create admin. Please try again.",
      });
    }
  };

  const closeAndReset = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={closeAndReset}
      as="div"
      className="relative z-50">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl duration-200 ease-out
                     data-[closed]:scale-95 data-[closed]:opacity-0">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Create Admin
          </DialogTitle>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-4 grid gap-3">
            {/* Full Name */}
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Full name</span>
              <input
                className="rounded border p-2"
                autoFocus
                {...register("fullName", {
                  required: "Required",
                  minLength: { value: 3, message: "Too short" },
                })}
              />
              {errors.fullName && (
                <p className="text-xs text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </label>

            {/* Email */}
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Email</span>
              <input
                type="email"
                className="rounded border p-2"
                {...register("email", {
                  required: "Required",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-600">{errors.email.message}</p>
              )}
            </label>

            {/* Phone */}
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Phone</span>
              <input
                className="rounded border p-2"
                {...register("phoneNumber", {
                  required: "Required",
                  pattern: {
                    value: /^[0-9+\-() ]{7,15}$/,
                    message: "Invalid phone",
                  },
                })}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </label>

            {/* Password */}
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Password</span>
              <input
                type="password"
                className="rounded border p-2"
                {...register("password", {
                  required: "Required",
                  minLength: { value: 8, message: "Min 8 chars" },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).+$/,
                    message: "Include Aa, number, symbol",
                  },
                })}
              />
              {errors.password && (
                <p className="text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </label>

            {/* Confirm Password */}
            <label className="grid gap-1">
              <span className="text-sm text-gray-700">Confirm password</span>
              <input
                type="password"
                className="rounded border p-2"
                {...register("cpassword", {
                  required: "Required",
                  validate: (v) => v === pwd || "Passwords do not match",
                })}
              />
              {errors.cpassword && (
                <p className="text-xs text-red-600">
                  {errors.cpassword.message}
                </p>
              )}
            </label>

            {/* Server error */}
            {"root" in errors && (errors as any).root?.message && (
              <p className="text-sm text-red-600">
                {(errors as any).root?.message}
              </p>
            )}

            <div className="mt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeAndReset}
                className="rounded bg-gray-200 px-3 py-2">
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || isLoading}
                className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60">
                {isLoading ? "Saving…" : "Save"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
