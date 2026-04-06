import ConfigurableModulePage from "../shared/ConfigurableModulePage";
import {
  loginModuleColumns,
  loginModuleFormFields,
  loginModuleInitialValues,
  loginModuleRows,
} from "./data/loginModuleData";

function LoginModulePage() {
  return (
    <ConfigurableModulePage
      title="Login"
      description="Review login accounts, device activity, and account status across the CRM."
      selectedLabel="5 Selected"
      resultsLabel="19 Results"
      summary="Showing 1 to 19 of 19 entries"
      flyoutTitle="Create Login"
      columns={loginModuleColumns}
      rows={loginModuleRows}
      storageKey="login-module-column-widths"
      formFields={loginModuleFormFields}
      initialValues={loginModuleInitialValues}
      flyoutColumnsClassName="form-grid form-grid-two"
    />
  );
}

export default LoginModulePage;
