import {
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineCalendarDays,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { BookingStatObj, BookingStaysObj } from "../../utils/config";
import Stat from "./Stat";
import { formatCurrency } from "../../utils/helpers";

interface StatsProps {
  bookings: BookingStatObj[];
  confirmedStays: BookingStaysObj[];
  numOfDays: number;
  cabinCount: number;
}

export default function Stats({
  bookings,
  confirmedStays,
  numOfDays,
  cabinCount,
}: StatsProps) {
  const numOfBookings = bookings.length;

  const sales = bookings.reduce(
    (sales, currBooking) => sales + currBooking.totalPrice,
    0
  );

  const checkIns = confirmedStays.length;

  const occupancy = Math.round(
    (confirmedStays.reduce(
      (checkedInNights, currStay) => checkedInNights + currStay.numNights,
      0
    ) /
      (numOfDays * cabinCount)) *
      100
  );

  return (
    <>
      <Stat
        icon={<HiOutlineBriefcase />}
        title="Bookings"
        color="blue"
        value={numOfBookings}
      />
      <Stat
        icon={<HiOutlineBanknotes />}
        title="Sales"
        color="green"
        value={formatCurrency(sales)}
      />
      <Stat
        icon={<HiOutlineCalendarDays />}
        title="Check ins"
        color="indigo"
        value={checkIns}
      />
      <Stat
        icon={<HiOutlineChartBar />}
        title="Occupancy rate"
        color="yellow"
        value={occupancy + "%"}
      />
    </>
  );
}
