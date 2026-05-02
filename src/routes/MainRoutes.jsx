import { Routes, Route, Navigate } from "react-router-dom";
import { UsersModulePage } from "../modules/users";
import { AccessControlModulePage } from "../modules/access-control";
import { MenuArrangementPage} from "../modules/menu-master";
import { TicketsModulePage } from "../modules/tasks";
import { CategoryModulePage } from "../modules/category";
import { CustomerModulePage } from "../modules/customer";
import { CompanyMasterModulePage } from "../modules/company-master";
// import { UserRoleMasterModulePage } from "../modules/user-role-master";
// import { UsersRoleModulePage } from "../modules/users-role";
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
          <Route path="/customers" element={<CustomerModulePage />} />
          <Route path="/tickets" element={<TicketsModulePage menuID={321} />} />
          <Route path="/category" element={<CategoryModulePage menuID={320} />} />
          <Route path="/companyMaster" element={<CompanyMasterModulePage />} />

          <Route path="/menus" element={<MenuArrangementPage menuID={28} />} />
          <Route path="/access-control" element={<AccessControlModulePage />} />
          {/* <Route path="/roles" element={<UsersRoleModulePage menuID={20} />} /> */}
          {/* <Route path="/user-roles" element={<UserRoleMasterModulePage />} /> */}
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default MainRoutes;
