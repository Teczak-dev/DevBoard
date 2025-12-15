import React from "react";
import { Route, Routes } from "react-router-dom"
import AppLayout from "./layout/AppLayout";
import DashboardPage from "./pages/DashboardPage";

const AppRoutes: React.FC = () => {
    return (
	<Routes>
	    <Route path="/" element={<AppLayout />}>
		<Route index element={<DashboardPage/>} />
	    </Route>
	</Routes>
    );
}

export default AppRoutes;
