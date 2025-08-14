import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/LandingPage";
import BMICalculator from "./pages/BMICalculator";
import DietPlans from "./pages/DietPlans";
import Exercise from "./pages/Exercise";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "bmi", element: <BMICalculator /> },
      { path: "diet", element: <DietPlans /> },
      { path: "exercise", element: <Exercise /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "signup", element: <RegisterPage /> }, // Alias for register
      { path: "profile", element: <ProfilePage /> },
    ],
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
