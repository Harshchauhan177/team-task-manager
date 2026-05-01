import React from "react";
import { Navigate } from "react-router-dom";
import AppLayout from "./AppLayout";

const ProtectedLayout = () => {
  if (!localStorage.getItem("token")) {
    return <Navigate to="/login" replace />;
  }
  return <AppLayout />;
};

export default ProtectedLayout;
