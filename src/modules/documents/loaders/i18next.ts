import { LoaderOptions } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

import i18next from "i18next";
import path from "path";

type ModuleOptions = {
  document_language?: string;
};

export default async function i18nextLoader({
  container,
  options,
}: LoaderOptions<ModuleOptions>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  logger.info("Starting i18next loader...");

  try {
    const defaultTranslationsPath = path.resolve(
      __dirname,
      `../assets/i18n/locales/fr/translation.json`
    );
    const { default: data } = await import(defaultTranslationsPath, {
      with: { type: "json" },
    });

    await i18next
      .init({
        fallbackLng: "fr",
        defaultNS: "translation",
        ns: "translation",
        resources: {
          fr: {
            translation: data,
          },
        },
      })
      .catch((error) => {
        logger.error(error);
      });
  } catch (error) {
    logger.error("Error initializing i18next: ${error}");
  }

  try {
    const configLanguage = options?.document_language;
    if (configLanguage === undefined) {
      logger.info('Language is not configured, using "fr" by default.');
    } else {
      logger.info(`Language is configured as ${configLanguage}`);
      const translationPath = path.resolve(
        __dirname,
        `../assets/i18n/locales/${configLanguage}/translation.json`
      );
      const translations = await import(translationPath, {
        with: { type: "json" },
      });
      i18next.addResourceBundle(configLanguage, "translation", translations);
      i18next.changeLanguage(configLanguage);
    }
  } catch {
    logger.error(
      'Error adding language configured in config. Fallback to "fr"'
    );
  }

  logger.info("Ending i18next loader...");
}
