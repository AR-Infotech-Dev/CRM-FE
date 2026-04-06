import ConfigurableModulePage from "../shared/ConfigurableModulePage";
import {
  userRoleMasterColumns,
  userRoleMasterFormFields,
  userRoleMasterInitialValues,
  userRoleMasterRows,
} from "./data/userRoleMasterData";

function UserRoleMasterModulePage() {
  return (
    <ConfigurableModulePage
      title="User Role Master"
      description="Manage reusable role definitions, access scope, and approval ownership."
      selectedLabel="3 Selected"
      resultsLabel="42 Results"
      summary="Showing 1 to 20 of 42 entries"
      flyoutTitle="Create User Role"
      columns={userRoleMasterColumns}
      rows={userRoleMasterRows}
      storageKey="user-role-master-column-widths"
      formFields={userRoleMasterFormFields}
      initialValues={userRoleMasterInitialValues}
      flyoutColumnsClassName="form-grid form-grid-two"
    />
  );
}

export default UserRoleMasterModulePage;
