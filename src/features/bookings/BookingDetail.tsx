import styled from "styled-components";

import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";

import { useMoveBack } from "../../hooks/useMoveBack.hooks";
import useBooking from "./useBooking.hooks";
import Spinner from "../../ui/Spinner";
import Empty from "../../ui/Empty";
import { useNavigate } from "react-router-dom";
import { useCheckOut } from "../check-in-out/useCheckOut.hooks";
import useDeleteBooking from "./useDeleteBooking.hooks";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

export default function BookingDetail() {
  const [booking, isLoading] = useBooking();
  const [checkOut, isCheckingOut] = useCheckOut();
  const [deleteBooking, isDeletingBooking] = useDeleteBooking();
  const moveBack = useMoveBack();
  const navigate = useNavigate();

  if (!booking) return <Empty resourceName="booking" />;

  const { status, id: bookingID } = booking;

  if (isLoading) return <Spinner />;

  interface StatusToTagName {
    unconfirmed: "blue";
    "checked-in": "green";
    "checked-out": "silver";
  }

  const statusToTagName: StatusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{bookingID}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        <Modal>
          <Modal.Open opens="delete">
            <Button
              variation="danger"
              size="medium"
              onClick={() => deleteBooking(bookingID)}
              disabled={isDeletingBooking}
            >
              Delete
            </Button>
          </Modal.Open>

          <Modal.Window name="delete">
            <ConfirmDelete
              resourceName="booking"
              onConfirm={() =>
                deleteBooking(bookingID, {
                  onSettled() {
                    moveBack();
                  },
                })
              }
              disabled={isDeletingBooking}
            />
          </Modal.Window>
        </Modal>

        {status === "unconfirmed" && (
          <Button
            variation="primary"
            size="medium"
            onClick={() => navigate(`/checkin/${bookingID}`)}
          >
            Check in
          </Button>
        )}

        {status === "checked-in" && (
          <Button
            variation="primary"
            size="medium"
            onClick={() => checkOut(bookingID)}
            disabled={isCheckingOut}
          >
            Check out
          </Button>
        )}

        <Button variation="secondary" size="medium" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}
