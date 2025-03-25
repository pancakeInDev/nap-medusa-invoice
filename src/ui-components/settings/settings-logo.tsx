import { Heading, Text, FocusModal, Button, Input, Label } from "@medusajs/ui";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui";
import { useEffect, useState } from "react";

const LogoFields = ({
  logoSource,
  register,
}: {
  logoSource?: string;
  register: any;
}) => {
  const [logoUrl, setLogoUrl] = useState(logoSource);
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [imgLoaded, setIsImageLoaded] = useState(false);

  const [error, setError] = useState(undefined);

  const handleInputChange = (event) => {
    setLogoUrl(event.target.value);
    setIsValidUrl(true);
  };

  const handleImageError = () => {
    setIsValidUrl(false);
    setIsImageLoaded(false);
  };

  const handleOnLoad = (event) => {
    setIsImageLoaded(true);
  };

  return (
    <div className="flex flex-col gap-1">
      <div>
        <Label size="small">Link to logo</Label>
      </div>
      <div>
        <Input
          placeholder="https://raw.githubusercontent.com/RSC-Labs/medusa-store-analytics/main/docs/store-analytics-logo.PNG"
          {...register}
          defaultValue={logoSource}
          onChange={handleInputChange}
        />
      </div>
      <div className="flex justify-center items-center mt-5">
        <div
          style={{
            height: "200px",
            width: "300px",
            overflow: "hidden",
            border: imgLoaded ? undefined : "1px solid rgba(0, 0, 0, 0.12)",
          }}
        >
          {logoUrl && isValidUrl && (
            <div className="text-center">
              <img
                src={logoUrl}
                alt="Preview"
                style={{ maxWidth: 300, maxHeight: 200 }}
                onLoad={handleOnLoad}
                onError={handleImageError}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LogoForm = ({
  logoSource,
  setOpenModal,
}: {
  logoSource?: string;
  setOpenModal: any;
}) => {
  const { register, handleSubmit } = useForm<{
    logoSource: string;
  }>();

  const onSubmit = (data: { logoSource: string }) => {
    fetch(`/admin/documents/document-settings/logo`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        logoSource: data.logoSource,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Logo", {
            description: "New logo saved",
          });
          setOpenModal(false);
        } else {
          const error = await response.json();
          toast.error("Logo", {
            description: `Logo cannot be saved, some error happened. ${error.message}`,
          });
          toast.error("Invoice settings", {
            description: `New invoice settings cannot be saved, some error happened.`,
          });
        }
      })
      .catch((e) => {
        toast.error("Logo", {
          description: `Logo cannot be saved, some error happened. ${e.toString()}`,
        });
        console.error(e);
      });
  };

  return (
    <form>
      <div className="flex flex-col gap-4 mt-8">
        <LogoFields logoSource={logoSource} register={register("logoSource")} />
        <div>
          <Button
            type="submit"
            variant={"primary"}
            onClick={handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

const LogoModalDetails = ({ setOpenModal }) => {
  const [data, setData] = useState<any | undefined>(undefined);

  const [error, setError] = useState<any>(undefined);

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    fetch(`/admin/documents/document-settings`, {
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
      <div className="flex flex-col items-center mt-8">
        <div>
          <Heading>Store logo</Heading>
        </div>
        <div>
          <Text>This logo will be used on your documents.</Text>
        </div>
        <div>
          <Text>Presence of logo on document depends on template.</Text>
        </div>
        <div>
          <LogoForm
            logoSource={
              data.settings && data.settings.storeLogoSource
                ? (data.settings.storeLogoSource as string)
                : undefined
            }
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </FocusModal.Body>
  );
};

const LogoChangeModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>Change logo</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header />
        <LogoModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default LogoChangeModal;
