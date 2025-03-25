import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";

import { DOCUMENTS_MODULE } from "../../../../../modules/documents";
import DocumentsModuleService from "../../../../../modules/documents/service";

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
      logoSource:
        lastDocumentSettings && lastDocumentSettings.length
          ? lastDocumentSettings[0].storeLogoSource
          : undefined,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const body: any = req.body as any;
  const logoSource: string | undefined = body.logoSource;
  const documentsModuleService: DocumentsModuleService =
    req.scope.resolve(DOCUMENTS_MODULE);

  try {
    if (logoSource !== undefined) {
      const newSettings = await documentsModuleService.updateStoreLogo(
        logoSource
      );
      if (newSettings !== undefined) {
        res.status(201).json({
          settings: newSettings,
        });
      } else {
        res.status(400).json({
          message: "Cant update logo",
        });
      }
    } else {
      res.status(400).json({
        message: "Logo not passed",
      });
    }
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
};
