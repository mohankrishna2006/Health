import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Add padding-top to account for fixed navbar */}
      <main className="pt-20">
        <Outlet />
      </main>
      {/* Add your footer here if needed */}
    </div>
  );
}
