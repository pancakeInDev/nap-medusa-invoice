import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types";
import { Eye } from "@medusajs/icons";
import {
  Button,
  Container,
  Heading,
  IconButton,
  StatusBadge,
  Text,
  toast,
} from "@medusajs/ui";
import { useEffect, useState } from "react";
import { DocumentInvoiceDTO } from "../../modules/documents/types/dto";
import { InvoiceResult } from "../../ui-components/types/api";

const OrderInvoiceWidget = ({ data: order }: DetailWidgetProps<AdminOrder>) => {
  const [invoice, setInvoice] = useState<DocumentInvoiceDTO | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const params: URLSearchParams = new URLSearchParams({
    orderId: order.id,
  });

  function fetchInvoices() {
    fetch(`/admin/documents/invoice?${params.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data.invoice);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      });
  }

  useEffect(() => {
    // Fetch invoices when component mounts
    fetchInvoices();
  }, [order.id]);

  async function createInvoice() {
    setLoading(true);
    await fetch(`/admin/documents/invoice`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: order.id,
      }),
    })
      .then((res) => res.json())
      .then((responseJson) => {
        if (responseJson && responseJson.message) {
          toast.error("Invoice", {
            description: `Problem happened when generating invoice. ${responseJson.message}`,
          });
        } else {
          if (responseJson.buffer) {
            const anyBuffer = responseJson.buffer as any;
            const blob = new Blob([new Uint8Array(anyBuffer.data)], {
              type: "application/pdf",
            });
            toast.dismiss();
            const pdfURL = URL.createObjectURL(blob);
            window.open(pdfURL, "_blank");
          } else {
            toast.dismiss();
            toast.error("Invoice", {
              description: "Problem happened when generating invoice",
            });
          }
        }
      });
    setLoading(false);
    fetchInvoices();
  }

  const openPdf = (invoiceResult?: InvoiceResult) => {
    if (invoiceResult && invoiceResult.buffer) {
      const anyBuffer = invoiceResult.buffer as any;
      const blob = new Blob([new Uint8Array(anyBuffer.data)], {
        type: "application/pdf",
      });
      const pdfURL = URL.createObjectURL(blob);
      window.open(pdfURL, "_blank");
    }
  };

  const viewInvoice = () => {
    setLoading(true);
    toast.loading("Invoice", {
      description: "Preparing invoice...",
      duration: Infinity,
    });
    const result: URLSearchParams = new URLSearchParams({
      includeBuffer: "true",
      orderId: order.id,
    });

    fetch(`/admin/documents/invoice?${result.toString()}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((result: InvoiceResult) => {
        if (result && result.buffer) {
          toast.dismiss();
          openPdf(result);
        } else {
          toast.dismiss();
          toast.error("Invoice", {
            description: "Problem happened when preparing invoice",
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.dismiss();
        toast.error("Invoice", {
          description: error,
        });
      });
    setLoading(false);
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Facture associée à la commande</Heading>
      </div>

      <div className="px-6 py-4">
        {invoice === undefined ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Text className="text-ui-fg-subtle">
              Aucune facture trouvée pour cette commande
            </Text>
            <Button
              variant="primary"
              onClick={createInvoice}
              disabled={loading}
              isLoading={loading}
            >
              Créer une facture
            </Button>
          </div>
        ) : (
          <div className="text-ui-fg-subtle">
            <div className="flex flex-row justify-between">
              <p className="font-normal font-sans txt-compact-small">
                Facture N°{invoice?.number}
              </p>
              <div>
                <StatusBadge color={"green"}>{"Facture"}</StatusBadge>
              </div>
              <div>
                <p className="font-normal font-sans txt-compact-small">
                  {new Date(invoice.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <IconButton
                  variant="transparent"
                  onClick={() => viewInvoice()}
                  disabled={loading}
                  isLoading={loading}
                >
                  <Eye />
                </IconButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "order.details.side.after",
});

export default OrderInvoiceWidget;
