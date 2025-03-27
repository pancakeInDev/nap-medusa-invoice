import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Receipt } from "@medusajs/icons";
import { SettingsPage } from "../../../../ui-components/pages/settingsPage";

const DocumentsPage = () => {
  return <SettingsPage />;
};

export const config = defineRouteConfig({
  label: "Factures",
  icon: Receipt,
});

export default DocumentsPage;
