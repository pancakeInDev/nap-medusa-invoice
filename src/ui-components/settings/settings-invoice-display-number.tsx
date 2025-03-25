import { Input } from "@medusajs/ui";
import { useEffect, useState } from "react";

const InvoiceSettingsDisplayNumber = ({
  formatNumber,
  forcedNumber,
}: {
  formatNumber?: string;
  forcedNumber?: number;
}) => {
  const result: URLSearchParams = new URLSearchParams();

  if (formatNumber) {
    result.append("formatNumber", formatNumber);
  }
  if (forcedNumber) {
    result.append("forcedNumber", forcedNumber.toString());
  }

  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [formatNumber, forcedNumber]);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/invoice/display-number?${result.toString()}`, {
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
      <div>
        <Input readOnly={true} />
      </div>
    );
  }

  return (
    <div>
      <Input
        key={`display-number-${data.displayNumber}`}
        defaultValue={data.displayNumber}
        readOnly={true}
      />
    </div>
  );
};

export default InvoiceSettingsDisplayNumber;
