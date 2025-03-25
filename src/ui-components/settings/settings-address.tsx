import { Heading, Text, FocusModal, Button, Input, Label } from "@medusajs/ui";
import { useForm } from "react-hook-form";
import { toast } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { DocumentAddress } from "../types/api";

const AddressField = ({
  name,
  placeholder,
  initValue,
  register,
}: {
  name: string;
  placeholder: string;
  initValue?: string;
  register: any;
}) => {
  return (
    <div className="flex flex-col gap-1 mt-2">
      <div>
        <Label size="small">{name}</Label>
      </div>
      <div>
        <Input
          placeholder={placeholder}
          {...register}
          defaultValue={initValue}
        />
      </div>
    </div>
  );
};

const AddressForm = ({
  address,
  setOpenModal,
}: {
  address?: DocumentAddress;
  setOpenModal: any;
}) => {
  const { register, handleSubmit } = useForm<DocumentAddress>();

  const onSubmit = (data: DocumentAddress) => {
    fetch(`/admin/documents/document-settings/document-address`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address: data,
      }),
    })
      .then(async (response) => {
        if (response.ok) {
          toast.success("Address", {
            description: "New address saved",
          });
          setOpenModal(false);
        } else {
          const error = await response.json();
          toast.error("Address", {
            description: `Address cannot be saved. ${error.message}`,
          });
        }
      })
      .catch((e) => {
        toast.error("Address", {
          description: `Address cannot be saved. ${e.toString()}`,
        });
        console.error(e);
      });
  };

  return (
    <form>
      <div className="flex flex-col gap-4 mt-8">
        <AddressField
          name="Company name"
          placeholder="My store"
          register={register("company")}
          initValue={address?.company}
        />
        <AddressField
          name="First name"
          placeholder="John"
          register={register("first_name")}
          initValue={address?.first_name}
        />
        <AddressField
          name="Last name"
          placeholder="Doe"
          register={register("last_name")}
          initValue={address?.last_name}
        />
        <AddressField
          name="Address"
          placeholder="56 Street"
          register={register("address_1")}
          initValue={address?.address_1}
        />
        <AddressField
          name="City"
          placeholder="Warsaw"
          register={register("city")}
          initValue={address?.city}
        />
        <AddressField
          name="Postal code"
          placeholder="55-200"
          register={register("postal_code")}
          initValue={address?.postal_code}
        />
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

const AddressModalDetails = ({ setOpenModal }) => {
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
      <div className="flex flex-col gap-4 mt-8">
        <div>
          <Heading>Store address</Heading>
        </div>
        <div>
          <Text>This address will be used on your documents.</Text>
        </div>
        <div>
          <Text>Presence of field on document depends on template.</Text>
        </div>
        <div>
          <AddressForm
            address={data?.settings?.storeAddress}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </FocusModal.Body>
  );
};

const AddressChangeModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <FocusModal open={open} onOpenChange={setOpen}>
      <FocusModal.Trigger asChild>
        <Button>Change address</Button>
      </FocusModal.Trigger>
      <FocusModal.Content>
        <FocusModal.Header />
        <AddressModalDetails setOpenModal={setOpen} />
      </FocusModal.Content>
    </FocusModal>
  );
};

export default AddressChangeModal;
