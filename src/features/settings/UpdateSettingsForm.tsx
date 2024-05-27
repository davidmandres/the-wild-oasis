import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import Spinner from "../../ui/Spinner";
import { SettingColumnValues } from "../../utils/config";
import useSettings from "./useSettings.hooks";
import useUpdateSetting from "./useUpdateSetting.hooks";

function UpdateSettingsForm() {
  const [settings, isLoading] = useSettings();
  const [isUpdating, mutateUpdateSetting] = useUpdateSetting();

  if (!settings || isLoading) return <Spinner />;

  const {
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  } = settings;

  function handleUpdate(
    e: React.FocusEvent<HTMLInputElement, Element>,
    columnValue: SettingColumnValues
  ) {
    const { valueAsNumber } = e.target;

    if (!valueAsNumber) return;

    mutateUpdateSetting({ columnValue, value: valueAsNumber });
  }

  return (
    <Form type="regular">
      <FormRow type="horizontal" label="Minimum nights/booking">
        <Input
          type="number"
          id="min-nights"
          defaultValue={minBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "minBookingLength")}
        />
      </FormRow>
      <FormRow type="horizontal" label="Maximum nights/booking">
        <Input
          type="number"
          id="max-nights"
          defaultValue={maxBookingLength}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxBookingLength")}
        />
      </FormRow>
      <FormRow type="horizontal" label="Maximum guests/booking">
        <Input
          type="number"
          id="max-guests"
          defaultValue={maxGuestsPerBooking}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "maxGuestsPerBooking")}
        />
      </FormRow>
      <FormRow type="horizontal" label="Breakfast price">
        <Input
          type="number"
          id="breakfast-price"
          defaultValue={breakfastPrice}
          disabled={isUpdating}
          onBlur={(e) => handleUpdate(e, "breakfastPrice")}
        />
      </FormRow>
    </Form>
  );
}

export default UpdateSettingsForm;
