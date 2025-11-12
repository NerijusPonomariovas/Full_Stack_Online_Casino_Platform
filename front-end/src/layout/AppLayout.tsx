import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AuthModal from "../components/AuthModal";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <AuthModal />
    </>
  );
}
