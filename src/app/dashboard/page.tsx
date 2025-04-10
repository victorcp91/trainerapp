"use client";

import React from "react";
import { withAuth } from "@/utils/withAuth";

const DashboardPage = () => {
  return <div>Dashboard</div>;
};

export default withAuth(DashboardPage, false);
