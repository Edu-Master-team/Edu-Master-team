// LoginOnce.tsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../features/APISlice";
import { setToken } from "./authSlice";

export default function LoginOnce() {
  const dispatch = useDispatch();
  const [login] = useLoginMutation();

  useEffect(() => {
    (async () => {
      try {
        const res = await login({
          email: "S_admin@gmail.com",
          password: "Sadmin123@",
        }).unwrap();
        dispatch(setToken(res.token));
      } catch (e) {
        console.error("Login failed:", e);
      }
    })();
  }, [login, dispatch]);

  return null; // مفيش UI
}
