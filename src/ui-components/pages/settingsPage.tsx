import { Tabs } from "@medusajs/ui";
import { InvoiceTemplatesTab } from "../tabs/invoice-templates-tab";
import { SettingsTab } from "../tabs/settings-tab";

export const SettingsPage = () => {
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
