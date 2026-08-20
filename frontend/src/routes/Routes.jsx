import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import CreatePost from "../pages/CreatePost.jsx";
import EditPost from "../pages/EditPost.jsx";
import PostDetails from "../pages/PostDetails.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  REGISTER_ROUTE,
  POST_CREATE_ROUTE,
  POST_DETAILS_ROUTE,
  POST_EDIT_ROUTE,
  ADMIN_ROUTE,
} from "./route.js";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={HOME_ROUTE} element={<Home />} />
      <Route path={LOGIN_ROUTE} element={<Login />} />
      <Route path={REGISTER_ROUTE} element={<Register />} />
      <Route path={POST_DETAILS_ROUTE} element={<PostDetails />} />
      <Route
        path={POST_CREATE_ROUTE}
        element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        }
      />
      <Route
        path={POST_EDIT_ROUTE}
        element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        }
      />
      <Route
        path={ADMIN_ROUTE}
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
