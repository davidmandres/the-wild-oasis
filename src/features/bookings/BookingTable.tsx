import BookingRow from "./BookingRow";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import Empty from "../../ui/Empty";
import useBookings from "./useBookings.hooks";
import Spinner from "../../ui/Spinner";
import { BookingObj } from "../../utils/config";
import Pagination from "../../ui/Pagination";

export default function BookingTable() {
  const [bookings, numOfResults, isLoading] = useBookings();

  if (isLoading) return <Spinner />;

  if (!bookings || !bookings?.length) return <Empty resourceName="bookings" />;

  return (
    <Menus>
      <Table columns="0.6fr 2fr 2.4fr 1.4fr 1fr 3.2rem">
        <Table.Header>
          <div>Cabin</div>
          <div>Guest</div>
          <div>Dates</div>
          <div>Status</div>
          <div>Amount</div>
          <div></div>
        </Table.Header>

        <Table.Body<BookingObj>
          data={bookings}
          render={(booking) => (
            <BookingRow key={booking.id} booking={booking} />
          )}
        />

        <Table.Footer>
          <Pagination numOfResults={numOfResults ?? 1} />
        </Table.Footer>
      </Table>
    </Menus>
  );
}