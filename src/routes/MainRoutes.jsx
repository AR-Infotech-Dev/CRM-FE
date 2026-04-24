import { Routes, Route, Navigate } from "react-router-dom";
import { UsersModulePage } from "../modules/users";
import { UserRoleMasterModulePage } from "../modules/user-role-master";
import { AccessControlModulePage } from "../modules/access-control";
import { MenuArrangementPage} from "../modules/menu-master";
import { TicketsModulePage } from "../modules/tasks";
import { getAuthRoutes } from "./AuthRoutes";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      {getAuthRoutes()}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/users" element={<UsersModulePage menuID={20} />} />
          <Route path="/tickets" element={<TicketsModulePage menuID={321} />} />
          <Route path="/menus" element={<MenuArrangementPage menuID={28} />} />

          <Route path="/user-roles" element={<UserRoleMasterModulePage />} />
          <Route path="/access-control" element={<AccessControlModulePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default MainRoutes;
