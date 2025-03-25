import { Alert } from "@medusajs/ui";
import {
  Container,
  Heading,
  RadioGroup,
  Label,
  Button,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { InvoiceTemplateKind } from "../types/template-kind";

const ViewExampleInvoice = ({ kind }: { kind: InvoiceTemplateKind }) => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  const [lastKind, setLastKind] = useState(kind);

  useEffect(() => {
    if (lastKind !== kind) {
      setLastKind(kind);
      if (!isLoading) {
        setLoading(true);
      }
    }
  }, [kind]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const result: URLSearchParams = new URLSearchParams({
      template: kind,
    });

    fetch(`/admin/documents/invoice/generate?${result.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result) => {
        if (result && result.message) {
          setError({
            message: result.message,
          });
        } else {
          toast.dismiss();
          setError(undefined);
          setData(result);
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        console.error(error);
      });
  }, [isLoading]);
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    const trueError = error as any;
    if (trueError.response?.data?.message || trueError.message) {
      if (trueError.message) {
        return <Alert variant="error">{trueError.message}</Alert>;
      }
      return <Alert variant="error">{trueError.response.data.message}</Alert>;
    } else {
      return <Alert variant="error">Preview can't be generated</Alert>;
    }
  }
  if (data && data.buffer) {
    const anyBuffer = data.buffer as any;
    const blob = new Blob([new Uint8Array(anyBuffer.data)], {
      type: "application/pdf",
    });
    const pdfURL = URL.createObjectURL(blob);
    return <iframe src={pdfURL} width={660} height={1000}></iframe>;
  } else {
    return <Alert variant="error">Preview can't be generated</Alert>;
  }
};

type ChooseTemplateProps = {
  lastKind: InvoiceTemplateKind;
  setKind: (kind: InvoiceTemplateKind) => void;
};

const ChooseTemplate = (props: ChooseTemplateProps) => {
  const handleChange = (checked: string) => {
    props.setKind(checked as InvoiceTemplateKind);
  };

  return (
    <RadioGroup
      onValueChange={handleChange}
      defaultValue={props.lastKind.toString()}
    >
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC.toString()}
          id={InvoiceTemplateKind.BASIC.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          Basic
        </Label>
      </div>
      <div className="flex items-center gap-x-3">
        <RadioGroup.Item
          value={InvoiceTemplateKind.BASIC_LOGO.toString()}
          id={InvoiceTemplateKind.BASIC_LOGO.toString()}
        />
        <Label htmlFor="radio_1" weight="plus">
          Basic with logo
        </Label>
      </div>
    </RadioGroup>
  );
};

const TemplatesTabContent = ({
  lastKind,
}: {
  lastKind?: InvoiceTemplateKind;
}) => {
  const [templateKind, setTemplateKind] = useState<InvoiceTemplateKind>(
    lastKind !== undefined && lastKind !== null
      ? lastKind
      : InvoiceTemplateKind.BASIC
  );

  const onSubmit = () => {
    fetch(`/admin/documents/document-invoice-settings/invoice-template`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        template: templateKind,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Template", {
            description: "New template saved",
          });
        } else {
          const error = await response.json();
          toast.error("Template", {
            description: `New template cannot be saved, some error happened. ${error.message}`,
          });
        }
      })
      .catch((e) => {
        toast.error("Template", {
          description: `New template cannot be saved, some error happened. ${e.toString()}`,
        });
        console.error(e);
      });
  };

  return (
    <div className="flex flex-row gap-2">
      <div
        className="flex-wrap min-w-[660px]"
        style={{
          minWidth: "660px",
        }}
      >
        <ViewExampleInvoice kind={templateKind} />
      </div>
      <div className="flex flex-row gap-2 justify-start">
        <div className="flex flex-col gap-2">
          <Alert>Preview is based on the last order</Alert>
          <div>
            <Container>
              <div className="flex flex-col gap-2">
                <div>
                  <Heading level="h1">Choose template</Heading>
                </div>
                <div>
                  <ChooseTemplate
                    lastKind={templateKind}
                    setKind={setTemplateKind}
                  />
                </div>
                <div>
                  <Button variant="primary" onClick={onSubmit}>
                    Save
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </div>
  );
};

export const InvoiceTemplatesTab = () => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (isLoading) {
    return <span>Loading...</span>;
  }

  return <TemplatesTabContent lastKind={data?.settings?.template} />;
};
