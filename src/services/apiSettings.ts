import { PostgrestError } from "@supabase/supabase-js";
import {
  SettingColumnValues,
  SettingsData,
  SettingsObj,
} from "../utils/config";
import supabase from "./supabase";

export async function getSettings() {
  interface RetrievedSettingData {
    data: SettingsData;
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("settings")
    .select("*")
    .single()) as RetrievedSettingData;

  if (error) {
    console.error(error);
    throw new Error("Settings could not be loaded");
  }

  const {
    id,
    created_at: createdAt,
    min_booking_length: minBookingLength,
    max_booking_length: maxBookingLength,
    max_guests_per_booking: maxGuestsPerBooking,
    breakfast_price: breakfastPrice,
  } = data;

  const settings: SettingsObj = {
    id,
    createdAt: new Date(createdAt),
    minBookingLength,
    maxBookingLength,
    maxGuestsPerBooking,
    breakfastPrice,
  };

  return settings;
}

interface UpdateSettingProps {
  columnValue: SettingColumnValues;
  value: number;
}

// We expect a newSetting object that looks like {setting: newValue}
export async function updateSetting({
  columnValue,
  value,
}: UpdateSettingProps) {
  let snakeColumnValue: string = "";

  for (let i = 0; i < columnValue.length; i++) {
    const char = columnValue[i];
    if (char === char.toUpperCase()) snakeColumnValue += "_";
    snakeColumnValue += char.toLowerCase();
  }

  const newSetting = {
    [snakeColumnValue]: value,
  };

  const { data, error } = await supabase
    .from("settings")
    .update(newSetting)
    // There is only ONE row of settings, and it has the ID=1, and so this is the updated one
    .eq("id", 1)
    .single();

  if (error) throw new Error(error.message);

  return data;
}
