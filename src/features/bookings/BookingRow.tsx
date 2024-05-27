import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import { BookingObj } from "../../utils/config";
import Menus from "../../ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiXMark,
} from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import { useCheckOut } from "../check-in-out/useCheckOut.hooks";
import useDeleteBooking from "./useDeleteBooking.hooks";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

interface BookingRowProps {
  booking: BookingObj;
}

export default function BookingRow({
  booking: {
    id: bookingID,
    startDate,
    endDate,
    numNights,
    totalPrice,
    status,
    guest: { fullName: guestName, email },
    cabin: { name: cabinName },
  },
}: BookingRowProps) {
  interface StatusToTagName {
    unconfirmed: "blue";
    "checked-in": "green";
    "checked-out": "silver";
  }

  const navigate = useNavigate();
  const [checkOut, isCheckingOut] = useCheckOut();
  const [deleteBooking, isDeletingBooking] = useDeleteBooking();

  const statusToTagName: StatusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <Table.Row>
      <Cabin>{cabinName}</Cabin>

      <Stacked>
        <span>{guestName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(startDate)
            ? "Today"
            : formatDistanceFromNow(startDate.toISOString())}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(startDate, "MMM dd yyyy")} &mdash;{" "}
          {format(endDate, "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Modal>
        <Menus.Menu>
          <Menus.Toggle id={bookingID} />
          <Menus.List id={bookingID}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => navigate(`/bookings/${bookingID}`)}
            >
              See details
            </Menus.Button>

            {status === "unconfirmed" && (
              <Menus.Button
                icon={<HiArrowDownOnSquare />}
                onClick={() => navigate(`/checkin/${bookingID}`)}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked-in" && (
              <Menus.Button
                icon={<HiArrowUpOnSquare />}
                onClick={() => checkOut(bookingID)}
                disabled={isCheckingOut}
              >
                Check out
              </Menus.Button>
            )}

            <Modal.Open opens="delete">
              <Menus.Button icon={<HiXMark />} disabled={isDeletingBooking}>
                Delete
              </Menus.Button>
            </Modal.Open>
          </Menus.List>
        </Menus.Menu>

        <Modal.Window name="delete">
          <ConfirmDelete
            resourceName="booking"
            onConfirm={() => deleteBooking(bookingID)}
            disabled={isDeletingBooking}
          />
        </Modal.Window>
      </Modal>
    </Table.Row>
  );
}
