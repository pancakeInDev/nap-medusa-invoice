import {
  Heading,
  Text,
  FocusModal,
  Button,
  Input,
  Label,
  Alert,
} from "@medusajs/ui";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { DocumentInvoiceSettings } from "../types/api";
import InvoiceSettingsDisplayNumber from "./settings-invoice-display-number";

type InvoiceSettings = {
  formatNumber: string;
  forcedNumber?: number;
};

const InvoiceSettingsForm = ({
  invoiceSettings,
  setOpenModal,
}: {
  invoiceSettings?: DocumentInvoiceSettings;
  setOpenModal: any;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InvoiceSettings>();
  const [formatNumber, setFormatNumber] = useState(
    invoiceSettings?.numberFormat
  );
  const [forcedNumber, setForcedNumber] = useState(
    invoiceSettings?.forcedNumber
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const onSubmit = (data: InvoiceSettings) => {
    fetch(`/admin/documents/document-invoice-settings`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        formatNumber: data.formatNumber,
        forcedNumber:
          data.forcedNumber !== undefined && data.forcedNumber.toString().length
            ? data.forcedNumber
            : undefined,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Invoice settings", {
            description: "New invoice settings saved",
          });
          setOpenModal(false);
        } else {
          const error = await response.json();
          toast.error("Invoice settings", {
            description: `New invoice settings cannot be saved, some error happened. ${error.message}`,
          });
        }
      })
      .catch((e) => {
        toast.error("Invoice settings", {
          description: `New invoice settings cannot be saved, some error happened. ${e.toString()}`,
        });
        console.error(e);
      });
  };
  const INVOICE_NUMBER_PLACEHOLDER = "{invoice_number}";
  const errorText = `Text ${INVOICE_NUMBER_PLACEHOLDER} needs to be included in input.`;
  const LABEL_MUST_FORMAT = `Format must include ${INVOICE_NUMBER_PLACEHOLDER}`;
  const LABEL_MUST_FORCED = `Forced number must be a number`;
  const LABEL_INFO_FORCED = `It will auto-increment starting from this number.`;

  const validateFormatNumber = (value) => {
    if (!value.includes(INVOICE_NUMBER_PLACEHOLDER)) {
      return LABEL_MUST_FORMAT;
    }
    return true;
  };
  const validateForcedNumber = (value) => {
    if (value.length && isNaN(Number(value))) {
      return LABEL_MUST_FORCED;
    }
    return true;
  };

  return (
    <form>
      <div className="flex flex-col gap-4 mt-8">
        <div className="flex flex-col gap-1 mt-2">
          <div>
            <div className="flex flex-col">
              <div>
                <Label size="small">Number format</Label>
              </div>
              <div>
                <Label size="xsmall">{LABEL_MUST_FORMAT}</Label>
              </div>
            </div>
          </div>
          <div>
            <Input
              placeholder={INVOICE_NUMBER_PLACEHOLDER}
              defaultValue={
                invoiceSettings?.numberFormat
                  ? invoiceSettings.numberFormat
                  : INVOICE_NUMBER_PLACEHOLDER
              }
              {...register("formatNumber", {
                validate: validateFormatNumber,
                onChange(e) {
                  const value = e.target.value;
                  if (typeof validateFormatNumber(value) === "string") {
                    const result: string = validateFormatNumber(
                      value
                    ) as unknown as any;
                    setError(result);
                  } else {
                    setError(undefined);
                    setFormatNumber(value);
                  }
                },
              })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div>
            <div className="flex flex-col">
              <div>
                <Label size="small">Forced number</Label>
              </div>
              <div>
                <Label size="xsmall">{LABEL_INFO_FORCED}</Label>
              </div>
            </div>
          </div>
          <div>
            <Input
              defaultValue={
                invoiceSettings?.forcedNumber !== undefined &&
                invoiceSettings.forcedNumber !== null
                  ? invoiceSettings.forcedNumber
                  : ""
              }
              type="number"
              {...register("forcedNumber", {
                validate: validateForcedNumber,
                onChange(e) {
                  const value = e.target.value;
                  if (typeof validateForcedNumber(value) === "string") {
                    const result: string = validateForcedNumber(
                      value
                    ) as unknown as any;
                    setError(result);
                  } else {
                    setError(undefined);
                    setForcedNumber(value);
                  }
                },
              })}
            />
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-2">
          <div>
            <Label size="small">Your next invoice number will be:</Label>
          </div>
          {errors.formatNumber == undefined &&
            errors.forcedNumber == undefined &&
            error == undefined && (
              <div>
                <InvoiceSettingsDisplayNumber
                  formatNumber={formatNumber}
                  forcedNumber={
                    forcedNumber !== undefined && forcedNumber !== null
                      ? parseInt(forcedNumber)
                      : undefined
                  }
                />
              </div>
            )}
        </div>
        <div>
          <Button
            type="submit"
            variant={"primary"}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </div>
        {(errors.formatNumber || errors.forcedNumber) && (
          <div>
            <Alert variant="error">{errorText}</Alert>
          </div>
        )}
        {error && (
          <div>
            <Alert variant="error">{error}</Alert>
          </div>
        )}
      </div>
    </form>
  );
};

const InvoiceSettingsModalDetails = ({ setOpenModal }) => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/document-invoice-settings`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <FocusModal.Body>
        <span>Loading...</span>
      </FocusModal.Body>
    );
  }

  return (
    <FocusModal.Body>
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <Heading>Invoice settings</Heading>
        </div>
        <div>
          <Text>
            These settings will be applied for newly generated invoices.
          </Text>
        </div>
        <div>
          <InvoiceSettingsForm
            invoiceSettings={data?.settings}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </FocusModal.Body>
  );
};

const InvoiceSettingsModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>Change settings</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header />
        <InvoiceSettingsModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default InvoiceSettingsModal;
