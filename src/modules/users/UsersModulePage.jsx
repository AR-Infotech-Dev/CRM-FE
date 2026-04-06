import { useState } from "react";
import ModuleControls from "../shared/ModuleControls";
import ModulePageLayout from "../shared/ModulePageLayout";
import ModulePagination from "../shared/ModulePagination";
import UserFlyout from "./components/UserFlyout";
import UsersTable from "./components/UsersTable";

function UsersModulePage() {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  return (
    <>
      <ModulePageLayout
        title="Users"
        description="Manage users, permissions, departments, and statuses from a single workspace."
        controls={
          <ModuleControls
            onCreate={() => setIsFlyoutOpen(true)}
            selectedLabel="6 Selected"
            resultsLabel="86 Results"
            createLabel="Add New"
          />
        }
        table={<UsersTable />}
        footer={<ModulePagination summary="Showing 1 to 20 of 86 entries" />}
      />
      <UserFlyout isOpen={isFlyoutOpen} onClose={() => setIsFlyoutOpen(false)} />
    </>
  );
}

export default UsersModulePage;
