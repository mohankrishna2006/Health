import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import LandingPage from "./pages/LandingPage";
import BMICalculator from "./pages/BMICalculator";
import DietPlans from "./pages/DietPlans";
import Exercise from "./pages/Exercise";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <LandingPage /> },
      { path: "bmi", element: <BMICalculator /> },
      { path: "diet", element: <DietPlans /> },
      { path: "exercise", element: <Exercise /> },
    ],
  },
]);

const Routes = () => <RouterProvider router={router} />;

export default Routes;
