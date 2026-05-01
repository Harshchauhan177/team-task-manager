import React from "react";
import "./PageLoading.css";

const PageLoading = ({ message = "Loading…" }) => (
  <div className="page-loading" role="status" aria-live="polite">
    <span className="page-loading__spinner" aria-hidden />
    <span>{message}</span>
  </div>
);

export default PageLoading;
