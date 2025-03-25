import DocumentsModuleService from "./service";
import i18nextLoader from "./loaders/i18next";
import { Module } from "@medusajs/framework/utils";

export const DOCUMENTS_MODULE = "documentsModuleService";

export default Module(DOCUMENTS_MODULE, {
  service: DocumentsModuleService,
  loaders: [i18nextLoader],
});
