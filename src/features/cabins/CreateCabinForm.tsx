import { FieldErrors, useForm } from "react-hook-form";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea from "../../ui/Textarea";
import { APICabinObj, CabinObj, FormCabinObj } from "../../utils/config";
import FormRow from "../../ui/FormRow";
import useCreateCabin from "./useCreateCabin.hooks";
import useEditCabin from "./useEditCabin.hooks";

interface CreateCabinFormProps {
  cabinToEdit?: CabinObj;
  onCloseModal?: () => void;
}

export default function CreateCabinForm({
  cabinToEdit,
  onCloseModal,
}: CreateCabinFormProps) {
  const [isCreating, mutateCreateCabin] = useCreateCabin();
  const [isEditing, mutateEditCabin] = useEditCabin();
  const isWorking = isCreating || isEditing;

  const {
    id: editID = 0,
    maxCapacity: max_capacity = 0,
    regPrice: regular_price = 0,
    desc: description = "",
    ...others
  } = cabinToEdit ? cabinToEdit : {};
  const editValues = {
    max_capacity,
    regular_price,
    description,
    ...others,
  };
  const isEditSession = editID !== 0;

  const { register, handleSubmit, reset, getValues, formState } =
    useForm<FormCabinObj>({
      defaultValues: isEditSession ? editValues : {},
    });
  const { errors } = formState;

  const requiredField = {
    required: "This field is required",
  };

  const minValueOne = {
    min: {
      value: 1,
      message: "Capacity should be at least one",
    },
  };

  const requiredMin = {
    ...requiredField,
    ...minValueOne,
  };

  function onSubmit(data: FormCabinObj) {
    const payload: APICabinObj = {
      ...data,
      image: (data.image as FileList).item(0) as File,
    };
    if (isEditSession)
      mutateEditCabin(
        {
          newCabinData: payload,
          id: editID,
        },
        {
          onSuccess,
        }
      );
    else
      mutateCreateCabin(payload, {
        onSuccess,
      });
  }

  function onSuccess() {
    reset();
    onCloseModal?.();
  }

  function onError(errors: FieldErrors<FormCabinObj>) {
    console.log(errors);
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow
        type="horizontal"
        label="Cabin name"
        error={errors.name?.message}
      >
        <Input
          type="text"
          id="cabinName"
          disabled={isWorking}
          {...register("name", requiredField)}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Max capacity"
        error={errors.max_capacity?.message}
      >
        <Input
          type="number"
          id="maxCapacity"
          disabled={isWorking}
          {...register("max_capacity", requiredMin)}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Regular price"
        error={errors.regular_price?.message}
      >
        <Input
          type="number"
          id="regularPrice"
          disabled={isWorking}
          {...register("regular_price", requiredMin)}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Discount"
        error={errors.discount?.message}
      >
        <Input
          type="number"
          id="discount"
          defaultValue={0}
          disabled={isWorking}
          {...register("discount", {
            ...requiredField,
            validate(discount) {
              if (String(discount)[0] === "0")
                discount = Number(String(discount).substring(1));

              return (
                Number(discount) <= Number(getValues().regular_price) ||
                "Discount needs to be less than regular price"
              );
            },
          })}
        />
      </FormRow>

      <FormRow
        type="horizontal"
        label="Description"
        error={errors.description?.message}
      >
        <Textarea
          id="description"
          defaultValue=""
          disabled={isWorking}
          {...register("description", requiredField)}
        />
      </FormRow>

      <FormRow type="horizontal" label="Image" error={errors.image?.message}>
        <FileInput
          id="image"
          accept="image/*"
          disabled={isWorking}
          {...register("image", {
            required: isEditSession ? false : "This field is required",
          })}
        />
      </FormRow>

      <FormRow type="horizontal">
        {/* type is an HTML attribute! */}
        <Button
          variation="secondary"
          size="medium"
          type="reset"
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variation="primary" size="medium" disabled={isWorking}>
          {isEditSession ? "Edit cabin" : "Create new cabin"}
        </Button>
      </FormRow>
    </Form>
  );
}
