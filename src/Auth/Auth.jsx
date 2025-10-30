import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => {
  const user = localStorage.getItem("user");
  return user !== null;
};

export const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};

export const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user && user.designation?.toLowerCase() === "admin";
  return isAdmin ? <Outlet /> : <Navigate to="/client" replace />;
};
