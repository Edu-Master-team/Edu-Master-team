import { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../app/auth/authSlice";
import { useLoginMutation } from "../app/features/APISlice";

type FormValues = {
  mode: "email" | "phone"; // UI only
  email?: string;
  phoneNumber?: string;
  password: string;
};

export default function LoginPage() {
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { mode: "email", email: "", phoneNumber: "", password: "" },
  });

  const mode = watch("mode");

  const onSubmit = async (data: FormValues) => {
    setServerError(null);

    // Basic guard: ensure the right identifier is present
    if (data.mode === "email" && !data.email) {
      setError("email", { type: "manual", message: "البريد مطلوب" });
      return;
    }
    if (data.mode === "phone" && !data.phoneNumber) {
      setError("phoneNumber", { type: "manual", message: "رقم الهاتف مطلوب" });
      return;
    }

    try {
      const body: { email?: string; phoneNumber?: string; password: string } = {
        password: data.password,
      };
      if (data.mode === "email") body.email = data.email?.trim();
      else body.phoneNumber = data.phoneNumber?.trim();

      const res = await login(body).unwrap();
      // Save token into Redux (authSlice also persists to localStorage)
      dispatch(setToken(res.token));
      // Optionally redirect here (if you use react-router):
      navigate("/");
    } catch (e: any) {
      // Try to surface backend message if available
      const msg = e?.data?.message || e?.error || "فشل تسجيل الدخول";
      setServerError(String(msg));
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-slate-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur border border-slate-200 shadow-xl rounded-2xl p-6 md:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold tracking-tight">تسجيل الدخول</h1>
            <p className="text-sm text-slate-500 mt-1">
              ادخل بياناتك للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Mode Switch */}
          <div
            className="grid grid-cols-2 gap-2 mb-5"
            role="tablist"
            aria-label="login-mode">
            <label
              className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-sm transition ${
                mode === "email"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <input
                type="radio"
                value="email"
                {...register("mode")}
                className="hidden"
              />
              عبر البريد
            </label>
            <label
              className={`cursor-pointer rounded-xl border px-3 py-2 text-center text-sm transition ${
                mode === "phone"
                  ? "bg-slate-900 text-white border-slate-900"
                  : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <input
                type="radio"
                value="phone"
                {...register("mode")}
                className="hidden"
              />
              عبر الهاتف
            </label>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-4">
            {/* Email */}
            {mode === "email" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "البريد مطلوب",
                    pattern: {
                      value: /[^@\s]+@[^@\s]+\.[^@\s]+/,
                      message: "صيغة بريد غير صحيحة",
                    },
                  })}
                  autoComplete="email"
                  inputMode="email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>
            )}

            {/* Phone */}
            {mode === "phone" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-900/10 ltr:text-left rtl:text-right"
                  placeholder="01XXXXXXXXX"
                  {...register("phoneNumber", {
                    required: "رقم الهاتف مطلوب",
                    minLength: { value: 8, message: "رقم غير صحيح" },
                  })}
                  autoComplete="tel"
                  inputMode="tel"
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-xs text-red-600">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 pr-10 text-sm outline-none focus:ring-2 focus:ring-slate-900/10"
                  placeholder="••••••••"
                  {...register("password", {
                    required: "كلمة المرور مطلوبة",
                    minLength: { value: 6, message: "أقل طول 6 أحرف" },
                  })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute inset-y-0 right-2 grid place-items-center px-1 text-slate-500 hover:text-slate-700"
                  aria-label={
                    showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                  }>
                  {showPassword ? (
                    <IoEyeOffOutline size={18} />
                  ) : (
                    <IoEyeOutline size={18} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-white text-sm font-medium shadow hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed">
              {isLoading && (
                <AiOutlineLoading3Quarters
                  className="animate-spin"
                  size={16}
                  aria-hidden
                />
              )}
              {isLoading ? "جاري الدخول" : "دخول"}
            </button>
          </form>

          {/* Helper Links */}
          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <a className="hover:text-slate-700" href="#/forgot">
              نسيت كلمة المرور؟
            </a>
            <a className="hover:text-slate-700" href="#/register">
              حساب جديد
            </a>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-4">
          © {new Date().getFullYear()} Edu‑Master
        </p>
      </div>
    </div>
  );
}
