import { Container, Heading, Text } from "@medusajs/ui";
import AddressChangeModal from "../settings/settings-address";
import LogoChangeModal from "../settings/settings-logo";
import InvoiceSettingsModal from "../settings/settings-invoice";

export const SettingsTab = () => {
  return (
    <div className="flex flex-row gap-2">
      <div className="flex-1">
        <Container className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div>
              <Heading level="h1">Store information</Heading>
            </div>
            <div>
              <Text size="small">
                Change information about your store to have it included in
                generated documents
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-5">
            <div>
              <AddressChangeModal />
            </div>
            <div>
              <LogoChangeModal />
            </div>
          </div>
        </Container>
      </div>
      <div className="flex-1">
        <Container className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <div>
              <Heading level="h1">Invoice</Heading>
            </div>
            <div>
              <Text size="small">
                Change settings how invoices are generated
              </Text>
            </div>
          </div>
          <div className="flex flex-row gap-2 mt-5">
            <div>
              <InvoiceSettingsModal />
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
};
