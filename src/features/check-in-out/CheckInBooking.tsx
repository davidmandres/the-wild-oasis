import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack.hooks";
import useBooking from "../bookings/useBooking.hooks";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import { useEffect, useState } from "react";
import Checkbox from "../../ui/Checkbox";
import { formatCurrency } from "../../utils/helpers";
import { useCheckIn } from "./useCheckIn.hooks";
import useSettings from "../settings/useSettings.hooks";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

export default function CheckInBooking() {
  const [confirmPaid, setConfirmPaid] = useState(false);
  const [addBreakfast, setAddBreakfast] = useState(false);
  const [booking, isLoading] = useBooking();
  const [settings, isLoadingSettings] = useSettings();

  useEffect(
    function () {
      setConfirmPaid(booking?.isPaid ?? false);
    },
    [booking?.isPaid]
  );

  const moveBack = useMoveBack();
  const [checkIn, isCheckingIn] = useCheckIn();

  if (isLoading || isLoadingSettings) return <Spinner />;

  if (!booking) return <Empty resourceName="booking" />;

  if (!settings) return <Empty resourceName="settings" />;

  const {
    id: bookingID,
    guest,
    totalPrice,
    numGuests,
    numNights,
    hasBreakfast,
  } = booking;

  const optionalBreakfastPrice =
    settings.breakfastPrice * numGuests * numNights;

  function handleCheckin() {
    if (!confirmPaid) return;

    if (addBreakfast) {
      checkIn({
        bookingID,
        breakfast: {
          has_breakfast: true,
          extras_price: optionalBreakfastPrice,
          total_price: totalPrice + optionalBreakfastPrice,
        },
      });
    } else checkIn({ bookingID });
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingID}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      {!hasBreakfast && (
        <Box>
          <Checkbox
            checked={addBreakfast}
            onChange={() => {
              setAddBreakfast((add) => !add);
              setConfirmPaid(false);
            }}
            disabled={isCheckingIn}
            id="breakfast"
          >
            Want to add breakfast for {formatCurrency(optionalBreakfastPrice)}
          </Checkbox>
        </Box>
      )}

      <Box>
        <Checkbox
          checked={confirmPaid}
          onChange={() => setConfirmPaid((c) => !c)}
          disabled={confirmPaid || isCheckingIn}
          id="confirm"
        >
          I confirm that {guest.fullName} has paid the total amount of{" "}
          {!addBreakfast
            ? formatCurrency(totalPrice)
            : `${formatCurrency(
                totalPrice + optionalBreakfastPrice
              )} (${formatCurrency(totalPrice)} + ${formatCurrency(
                optionalBreakfastPrice
              )})`}
        </Checkbox>
      </Box>

      <ButtonGroup>
        <Button
          variation="primary"
          size="medium"
          onClick={handleCheckin}
          disabled={!confirmPaid || isCheckingIn}
        >
          Check in booking #{bookingID}
        </Button>
        <Button variation="secondary" size="medium" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}
