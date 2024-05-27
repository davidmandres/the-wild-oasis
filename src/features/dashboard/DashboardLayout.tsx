import styled from "styled-components";
import Spinner from "../../ui/Spinner";
import useRecentBookings from "./useRecentBookings.hooks";
import useRecentStays from "./useRecentStays.hooks";
import Stats from "./Stats";
import useCabins from "../cabins/useCabins.hooks";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

export default function DashboardLayout() {
  const [bookings, isLoading1] = useRecentBookings();
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [_, confirmedStays, isLoading2, numOfDays] = useRecentStays();
  const [cabins, isLoading3] = useCabins();

  if (isLoading1 || isLoading2 || isLoading3) return <Spinner />;

  return (
    <StyledDashboardLayout>
      <Stats
        bookings={bookings ?? []}
        confirmedStays={confirmedStays ?? []}
        numOfDays={numOfDays}
        cabinCount={cabins?.length ?? 1}
      />
      <TodayActivity />
      <DurationChart confirmedStays={confirmedStays ?? []} />
      <SalesChart bookings={bookings ?? []} numOfDays={numOfDays} />
    </StyledDashboardLayout>
  );
}
