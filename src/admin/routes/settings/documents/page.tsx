import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Tabs } from "@medusajs/ui";
import { Receipt } from "@medusajs/icons";
import { InvoiceTemplatesTab } from "../../../../ui-components/tabs/invoice-templates-tab";
import { SettingsTab } from "../../../../ui-components/tabs/settings-tab";

const DocumentsPage = () => {
  return (
    <Tabs defaultValue="templates">
      <Tabs.List>
        <Tabs.Trigger value="templates">Templates</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>

      <div className="mt-2">
        <Tabs.Content value="templates">
          <InvoiceTemplatesTab />
        </Tabs.Content>
        <Tabs.Content value="settings">
          <SettingsTab />
        </Tabs.Content>
      </div>
    </Tabs>
  );
};

export const config = defineRouteConfig({
  label: "Factures",
  icon: Receipt,
});

export default DocumentsPage;
