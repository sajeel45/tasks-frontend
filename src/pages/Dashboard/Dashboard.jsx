import React from "react";
import { Outlet } from "react-router-dom";

import DashboardHeader from "../../components/DashboardHeader";

export default function Dashboard() {
    return (
        <div className="dashboard-page">
            <DashboardHeader />
            <Outlet />
        </div>
    )
}
