import { PostgrestError } from "@supabase/supabase-js";
import {
  APIBookingObj,
  BookingData,
  BookingObj,
  BookingStatObj,
  BookingStaysDataObj,
  BookingStaysObj,
  BookingStaysTodayDataObj,
  BookingStaysTodayObj,
  PAGE_SIZE,
  URLBookingFilters,
  URLBookingSorterFields,
  URLSortingDirections,
} from "../utils/config";
import { getToday } from "../utils/helpers";
import supabase from "./supabase";

interface GetBookingsParameters {
  filter: {
    field: string;
    value: URLBookingFilters;
    method?: "eq" | "gte" | "lte";
  } | null;
  sortBy: {
    field: URLBookingSorterFields;
    direction: URLSortingDirections;
  } | null;
  currPage: number;
}

export async function getBookings({
  filter,
  sortBy,
  currPage,
}: GetBookingsParameters) {
  interface RetrievedBookingsData {
    data: BookingData[];
    error: PostgrestError | null;
    count: number;
  }

  let query = supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)", { count: "exact" });

  if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  if (sortBy)
    query = query.order(sortBy.field, {
      ascending: sortBy.direction === "asc",
    });

  if (currPage) {
    const from = (currPage - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    query = query.range(from, to);
  }

  const {
    data,
    error,
    count: numOfResults,
  } = (await query) as RetrievedBookingsData;

  if (error) throw new Error(error.message);

  const bookings: BookingObj[] = data.map<BookingObj>((bookingData) => {
    return {
      id: bookingData.id,
      createdAt: new Date(bookingData.created_at),
      startDate: new Date(bookingData.start_date),
      endDate: new Date(bookingData.end_date),
      numNights: bookingData.num_nights,
      numGuests: bookingData.num_guests,
      cabinPrice: bookingData.cabin_price,
      extrasPrice: bookingData.extras_price,
      totalPrice: bookingData.total_price,
      status: bookingData.status,
      hasBreakfast: bookingData.has_breakfast,
      isPaid: bookingData.is_paid,
      observations: bookingData.observations,
      cabinID: bookingData.cabin_id,
      guestID: bookingData.guest_id,
      guest: {
        id: bookingData.guests.id,
        createdAt: new Date(bookingData.guests.created_at),
        fullName: bookingData.guests.full_name,
        email: bookingData.guests.email,
        nationalID: bookingData.guests.national_id,
        nationality: bookingData.guests.nationality,
        countryFlag: bookingData.guests.country_flag,
      },
      cabin: {
        id: bookingData.cabins.id,
        name: bookingData.cabins.name,
        maxCapacity: bookingData.cabins.max_capacity,
        regPrice: bookingData.cabins.regular_price,
        discount: bookingData.cabins.discount,
        desc: bookingData.cabins.description,
        imgURL: bookingData.cabins.image,
        createdAt: new Date(bookingData.cabins.created_at),
      },
    };
  });

  return [bookings, numOfResults] as const;
}

export async function getBooking(id: number) {
  interface RetrievedBookingData {
    data: BookingData;
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("bookings")
    .select("*, cabins(*), guests(*)")
    .eq("id", id)
    .single()) as RetrievedBookingData;

  if (error) throw new Error("Booking not found");

  const booking: BookingObj = {
    id: data.id,
    createdAt: new Date(data.created_at),
    startDate: new Date(data.start_date),
    endDate: new Date(data.end_date),
    numNights: data.num_nights,
    numGuests: data.num_guests,
    cabinPrice: data.cabin_price,
    extrasPrice: data.extras_price,
    totalPrice: data.total_price,
    status: data.status,
    hasBreakfast: data.has_breakfast,
    isPaid: data.is_paid,
    observations: data.observations,
    cabinID: data.cabin_id,
    guestID: data.guest_id,
    guest: {
      id: data.guests.id,
      createdAt: new Date(data.guests.created_at),
      fullName: data.guests.full_name,
      email: data.guests.email,
      nationalID: data.guests.national_id,
      nationality: data.guests.nationality,
      countryFlag: data.guests.country_flag,
    },
    cabin: {
      id: data.cabins.id,
      name: data.cabins.name,
      maxCapacity: data.cabins.max_capacity,
      regPrice: data.cabins.regular_price,
      discount: data.cabins.discount,
      desc: data.cabins.description,
      imgURL: data.cabins.image,
      createdAt: new Date(data.cabins.created_at),
    },
  };

  return booking;
}

// Returns all BOOKINGS that are were created after the given date. Useful to get bookings created in the last 30 days, for example.
export async function getBookingsAfterDate(date: string) {
  interface RetrievedBookingData {
    data: {
      created_at: string;
      total_price: number;
      extras_price: number;
    }[];
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("bookings")
    .select("created_at, total_price, extras_price")
    .gte("created_at", date)
    .lte("created_at", getToday({ end: true }))) as RetrievedBookingData;

  if (error) throw new Error(error.message);

  const partialBookings: BookingStatObj[] = data.map((booking) => {
    return {
      createdAt: new Date(booking.created_at),
      totalPrice: booking.total_price,
      extrasPrice: booking.extras_price,
    };
  });

  return partialBookings;
}

// Returns all STAYS that are were created after the given date
export async function getStaysAfterDate(date: string) {
  interface RetrievedBookingData {
    data: BookingStaysDataObj[];
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("bookings")
    .select("*, guests(full_name)")
    .gte("start_date", date)
    .lte("start_date", getToday())) as RetrievedBookingData;

  if (error) throw new Error(error.message);

  const bookings: BookingStaysObj[] = data.map<BookingStaysObj>(
    (bookingData) => {
      return {
        id: bookingData.id,
        createdAt: new Date(bookingData.created_at),
        startDate: new Date(bookingData.start_date),
        endDate: new Date(bookingData.end_date),
        numNights: bookingData.num_nights,
        numGuests: bookingData.num_guests,
        cabinPrice: bookingData.cabin_price,
        extrasPrice: bookingData.extras_price,
        totalPrice: bookingData.total_price,
        status: bookingData.status,
        hasBreakfast: bookingData.has_breakfast,
        isPaid: bookingData.is_paid,
        observations: bookingData.observations,
        cabinID: bookingData.cabin_id,
        guestID: bookingData.guest_id,
        guest: {
          fullName: bookingData.guests.full_name,
        },
      };
    }
  );

  return bookings;
}

// Activity means that there is a check in or a check out today
export async function getStaysTodayActivity() {
  interface RetrievedBookingData {
    data: BookingStaysTodayDataObj[];
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("bookings")
    .select("*, guests(full_name, nationality, country_flag)")
    .or(
      `and(status.eq.unconfirmed,start_date.eq.${getToday()}),and(status.eq.checked-in,end_date.eq.${getToday()})`
    )
    .order("created_at")) as RetrievedBookingData;

  // Equivalent to this. But by querying this, we only download the data we actually need, otherwise we would need ALL bookings ever created
  // (stay.status === 'unconfirmed' && isToday(new Date(stay.startDate))) ||
  // (stay.status === 'checked-in' && isToday(new Date(stay.endDate)))

  if (error) throw new Error(error.message);

  const bookings: BookingStaysTodayObj[] = data.map<BookingStaysTodayObj>(
    (bookingData) => {
      return {
        id: bookingData.id,
        createdAt: new Date(bookingData.created_at),
        startDate: new Date(bookingData.start_date),
        endDate: new Date(bookingData.end_date),
        numNights: bookingData.num_nights,
        numGuests: bookingData.num_guests,
        cabinPrice: bookingData.cabin_price,
        extrasPrice: bookingData.extras_price,
        totalPrice: bookingData.total_price,
        status: bookingData.status,
        hasBreakfast: bookingData.has_breakfast,
        isPaid: bookingData.is_paid,
        observations: bookingData.observations,
        cabinID: bookingData.cabin_id,
        guestID: bookingData.guest_id,
        guest: {
          fullName: bookingData.guests.full_name,
          nationality: bookingData.guests.nationality,
          countryFlag: bookingData.guests.country_flag,
        },
      };
    }
  );

  return bookings;
}

export async function updateBooking(id: number, obj: APIBookingObj) {
  interface RetrievedBookingData {
    data: BookingData;
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("bookings")
    .update(obj)
    .eq("id", id)
    .select()
    .single()) as RetrievedBookingData;

  if (error) throw new Error(error.message);

  return data;
}

export async function deleteBooking(id: number) {
  // REMEMBER RLS POLICIES
  const { data, error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) throw new Error("Booking could not be deleted");

  return data;
}
