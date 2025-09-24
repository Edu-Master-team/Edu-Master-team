// src/features/auth/LoginOnce.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../features/APISlice";
import { setToken } from "./authSlice";

export default function LoginOnce() {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  useEffect(() => {
    const doLogin = async () => {
      try {
        const res = await login({
          email: "basmalayassser22@gmail.com",
          password: "123456@Aa",

          // email: "S_admin@gmail.com",
          // password: "Sadmin123@",
        }).unwrap();

        // نخزن التوكن في redux + localStorage (عن طريق الـ reducer)
        dispatch(setToken(res.token));
        console.log("Logged in, token:", res.token);
      } catch (e) {
        console.error("Login failed:", e);
      }
    };

    doLogin();
  }, [login, dispatch]);

  return null; // مفيش UI
}
