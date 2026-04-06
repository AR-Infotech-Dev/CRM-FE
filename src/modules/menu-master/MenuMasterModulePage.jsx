import ConfigurableModulePage from "../shared/ConfigurableModulePage";
import {
  menuMasterColumns,
  menuMasterFormFields,
  menuMasterInitialValues,
  menuMasterRows,
} from "./data/menuMasterData";

function MenuMasterModulePage() {
  return (
    <ConfigurableModulePage
      title="Menu Master"
      description="Control navigation items, route hierarchy, and menu sequencing from one place."
      selectedLabel="2 Selected"
      resultsLabel="28 Results"
      summary="Showing 1 to 20 of 28 entries"
      flyoutTitle="Create Menu"
      columns={menuMasterColumns}
      rows={menuMasterRows}
      storageKey="menu-master-column-widths"
      formFields={menuMasterFormFields}
      initialValues={menuMasterInitialValues}
      flyoutColumnsClassName="form-grid form-grid-two"
    />
  );
}

export default MenuMasterModulePage;
