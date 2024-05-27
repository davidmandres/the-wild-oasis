interface ID {
  id: number;
}

interface CreatedAtSnake {
  created_at: string; // ISO8601 format
}

interface CreatedAtCamel {
  createdAt?: Date;
}

export interface CabinBaseObj {
  name: string;
  max_capacity: number;
  regular_price: number;
  discount: number;
  description: string;
}

export interface FormCabinObj extends CabinBaseObj {
  image: FileList;
}

export interface APICabinObj extends CabinBaseObj {
  image?: File;
}

export interface CabinObjToSend extends CabinBaseObj {
  image: string;
}

export interface CabinData extends CabinBaseObj, ID, CreatedAtSnake {
  image: string;
}

export interface CabinEditData extends APICabinObj, CreatedAtCamel {
  createdAt: Date;
  imgURL: string;
}

export interface CabinObj extends CreatedAtCamel {
  name: string;
  maxCapacity: number;
  regPrice: number;
  discount: number;
  desc: string;
  imgURL: string;
  id: number;
}

export interface SettingsData extends ID, CreatedAtSnake {
  min_booking_length: number;
  max_booking_length: number;
  max_guests_per_booking: number;
  breakfast_price: number;
}

export interface SettingsObj extends ID, CreatedAtCamel {
  minBookingLength: number;
  maxBookingLength: number;
  maxGuestsPerBooking: number;
  breakfastPrice: number;
}

export type StatusOptions = "unconfirmed" | "checked-in" | "checked-out";

export interface BookingBaseObj {
  status: StatusOptions;
  observations: string;
}

export interface BreakfastObj {
  has_breakfast: boolean;
  extras_price: number;
  total_price: number;
}

export interface BookingStatObj {
  createdAt: Date;
  totalPrice: number;
  extrasPrice: number;
}

export interface APIBookingObj {
  status: StatusOptions;
  is_paid?: boolean;
  has_breakfast?: boolean;
  extras_price?: number;
  total_price?: number;
}

export interface SampleBookingObj extends CreatedAtSnake {
  start_date: string;
  end_date: string;
  num_guests: number;
  has_breakfast: boolean;
  is_paid: boolean;
  cabin_id: number;
  guest_id: number;
  observations: string;
}

export interface BookingDataWithoutForeignKeys
  extends BookingBaseObj,
    SampleBookingObj,
    BreakfastObj {
  start_date: string;
  end_date: string;
  num_nights: number;
  num_guests: number;
  cabin_price: number;
  is_paid: boolean;
  cabin_id: number;
  guest_id: number;
}

export interface BookingStaysDataObj extends BookingDataWithoutForeignKeys, ID {
  guests: {
    full_name: string;
  };
}

export interface BookingStaysTodayDataObj
  extends BookingDataWithoutForeignKeys,
    ID {
  guests: {
    full_name: string;
    nationality: string;
    country_flag: string;
  };
}

export interface BookingData extends BookingDataWithoutForeignKeys, ID {
  guests: GuestData;
  cabins: CabinData;
}

export interface BookingWithoutForeignKeysObj extends CreatedAtCamel, ID {
  startDate: Date;
  endDate: Date;
  numNights: number;
  numGuests: number;
  cabinPrice: number;
  extrasPrice: number;
  totalPrice: number;
  hasBreakfast: boolean;
  isPaid: boolean;
  cabinID: number;
  guestID: number;
}

export interface BookingStaysObj
  extends BookingWithoutForeignKeysObj,
    BookingBaseObj {
  guest: {
    fullName: string;
  };
}

export interface BookingStaysTodayObj
  extends BookingWithoutForeignKeysObj,
    BookingBaseObj {
  guest: {
    fullName: string;
    nationality: string;
    countryFlag: string;
  };
}

export interface BookingObj
  extends BookingWithoutForeignKeysObj,
    BookingBaseObj {
  guest: GuestObj;
  cabin: CabinObj;
}

export interface GuestBaseObj {
  email: string;
  nationality: string;
}

export interface GuestData extends ID, CreatedAtSnake, GuestBaseObj {
  full_name: string;
  national_id: string;
  country_flag?: string;
}

export interface GuestObjToSend {
  email: string;
  nationality: string;
  full_name: string;
  national_id: string;
  country_flag?: string;
}

export interface GuestObj extends CreatedAtCamel, GuestBaseObj, ID {
  fullName: string;
  nationalID: string;
  countryFlag?: string;
}

export interface OperationOptionObj<T extends string> {
  value: T;
  label: string;
}

export interface AuthUserObj {
  email: string;
  password: string;
}

export interface UserMetadataObj {
  fullName: string;
  avatar: string;
}

export type SettingColumnValues =
  | "minBookingLength"
  | "maxBookingLength"
  | "maxGuestsPerBooking"
  | "breakfastPrice";

export type URLCabinFilters = "all" | "no-discount" | "with-discount";

export type URLCabinSorters =
  | "name-asc"
  | "name-desc"
  | "regPrice-asc"
  | "maxCapacity-asc"
  | "regPrice-desc"
  | "maxCapacity-desc";

export type URLBookingFilters =
  | "all"
  | "unconfirmed"
  | "checked-in"
  | "checked-out";

export type URLBookingSorters =
  | "startDate-asc"
  | "startDate-desc"
  | "totalPrice-asc"
  | "totalPrice-desc";

export type URLBookingSorterFields = "start_date" | "total_price";

export type URLSortingDirections = "asc" | "desc";

export const SUPABASE_URL = "https://muqcppkpthqwvexdshou.supabase.co";

export const PAGE_SIZE = 8;
