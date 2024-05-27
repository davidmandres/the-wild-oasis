import { PostgrestError } from "@supabase/supabase-js";
import {
  APICabinObj,
  CabinData,
  CabinEditData,
  CabinObj,
  SUPABASE_URL,
} from "../utils/config";
import supabase from "./supabase";

export async function getCabins() {
  interface RetrievedCabinData {
    data: CabinData[];
    error: PostgrestError | null;
  }

  const { data, error } = (await supabase
    .from("cabins")
    .select("*")) as RetrievedCabinData;

  if (error) {
    console.error(error);
    throw error;
  }

  const cabins: CabinObj[] = data.map<CabinObj>((cabinData) => {
    return {
      id: cabinData.id,
      name: cabinData.name,
      maxCapacity: cabinData.max_capacity,
      regPrice: cabinData.regular_price,
      discount: cabinData.discount,
      desc: cabinData.description,
      imgURL: cabinData.image,
      createdAt: new Date(cabinData.created_at),
    };
  });

  return cabins;
}

export async function createCabin(
  newCabin: APICabinObj | CabinEditData,
  id?: number
) {
  interface RetrievedCabinData {
    data: CabinData;
    error: PostgrestError | null;
  }

  const {
    imgURL: imageURL,
    name,
    description,
    discount,
    regular_price,
    max_capacity,
    image,
  } = newCabin as CabinEditData;
  const editCabin: APICabinObj = {
    name,
    description,
    discount,
    regular_price,
    max_capacity,
    image,
  };
  const imageFile = newCabin.image as File;
  // https://muqcppkpthqwvexdshou.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg
  const imageName = `${Math.random()}-${
    imageFile ? imageFile.name : ""
  }`.replace("/", "");
  const imagePath = `${SUPABASE_URL}/storage/v1/object/public/cabin-images/${imageName}`;

  const from = supabase.from("cabins");
  let query;

  const hasImage = Boolean(newCabin.image);
  const checkedImagePath = hasImage ? imagePath : imageURL;

  // 1. Create Cabin
  // A) CREATE
  if (!id)
    query = from.insert([
      {
        ...(hasImage ? (newCabin as APICabinObj) : editCabin),
        image: checkedImagePath,
      },
    ]);
  // B) EDIT
  else
    query = from
      .update({
        ...editCabin,
        image: checkedImagePath,
      })
      .eq("id", id);

  const { data, error } = (await query
    ?.select()
    .single()) as RetrievedCabinData;

  if (error) throw new Error(error.message);

  // 2. Image
  if (imageURL?.includes(image?.name ?? "BOMBOCLAAT")) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, imageFile);

  if (storageError) {
    deleteCabin(data?.id ?? 0);
    throw new Error(storageError.message);
  }

  return data;
}

export async function deleteCabin(id: number) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);
  if (error) throw new Error("Cabin could not be deleted");
  return data;
}
