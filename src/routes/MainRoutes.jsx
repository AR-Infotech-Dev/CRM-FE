import { Routes, Route, Navigate } from "react-router-dom";
import { UsersModulePage } from "../modules/users";
import { UserRoleMasterModulePage } from "../modules/user-role-master";
import { AccessControlModulePage } from "../modules/access-control";
import { MenuMasterModulePage } from "../modules/menu-master";
import { getAuthRoutes } from "./AuthRoutes";
import ProtectedRoute from "./ProtectedRoute";
import AppLayout from "../layouts/AppLayout";

function MainRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/users" replace />} />
      {getAuthRoutes()}
      <Route path="/usersList" element={<Navigate to="/users" replace />} />
      <Route path="/roleList" element={<Navigate to="/user-roles" replace />} />
      <Route path="/menuList" element={<Navigate to="/menus" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/users" element={<UsersModulePage />} />
          <Route path="/user-roles" element={<UserRoleMasterModulePage />} />
          <Route path="/access-control" element={<AccessControlModulePage />} />
          <Route path="/menus" element={<MenuMasterModulePage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default MainRoutes;
