import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { DOCUMENTS_MODULE } from "../../../../modules/documents";
import DocumentsModuleService from "../../../../modules/documents/service";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const documentsModuleService: DocumentsModuleService =
    req.scope.resolve(DOCUMENTS_MODULE);

  try {
    const lastDocumentSettings =
      await documentsModuleService.listDocumentSettings(
        {},
        {
          order: {
            created_at: "DESC",
          },
          take: 1,
        }
      );
    res.status(200).json({
      settings:
        lastDocumentSettings && lastDocumentSettings.length
          ? lastDocumentSettings[0]
          : undefined,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
