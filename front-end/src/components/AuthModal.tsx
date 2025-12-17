import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

export default function AuthModal() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [auth, setAuth] = useState<"login"|"register"|null>(null);

  useEffect(() => {
    const a = params.get("auth");
    setAuth(a === "login" || a === "register" ? a : null);
  }, [params]);

  if (!auth) return null;

  const close = () => navigate(".", { replace: true });

  return (
    <div className="auth-modal-backdrop" onClick={close}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-close" onClick={close}>×</button>
        {auth === "login" ? <Login /> : <Register />}
      </div>
    </div>
  );
}
