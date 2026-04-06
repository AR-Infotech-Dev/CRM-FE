import { useState } from "react";
import ModuleControls from "./ModuleControls";
import ModulePageLayout from "./ModulePageLayout";
import ModulePagination from "./ModulePagination";
import ConfigurableModuleTable from "./ConfigurableModuleTable";
import ConfigurableModuleFlyout from "./ConfigurableModuleFlyout";

function ConfigurableModulePage({
  title,
  description,
  selectedLabel,
  resultsLabel,
  summary,
  createLabel = "Add New",
  flyoutTitle,
  columns,
  rows,
  storageKey,
  formFields,
  initialValues,
  flyoutColumnsClassName,
}) {
  const [isFlyoutOpen, setIsFlyoutOpen] = useState(false);

  return (
    <>
      <ModulePageLayout
        title={title}
        description={description}
        controls={
          <ModuleControls
            onCreate={() => setIsFlyoutOpen(true)}
            selectedLabel={selectedLabel}
            resultsLabel={resultsLabel}
            createLabel={createLabel}
          />
        }
        table={<ConfigurableModuleTable columns={columns} rows={rows} storageKey={storageKey} />}
        footer={<ModulePagination summary={summary} />}
      />
      <ConfigurableModuleFlyout
        isOpen={isFlyoutOpen}
        onClose={() => setIsFlyoutOpen(false)}
        title={flyoutTitle}
        fields={formFields}
        initialValues={initialValues}
        columnsClassName={flyoutColumnsClassName}
      />
    </>
  );
}

export default ConfigurableModulePage;
