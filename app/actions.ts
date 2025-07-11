"use server";

import { createSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/redirect";
import { ICardRequest } from "@/utils/types";
import GenericError from "@/utils/error";
import { revalidatePath } from "next/cache";

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const client = await createSupabaseClient();

  const { error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/admin");
};

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const client = await createSupabaseClient();

  const { error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-up", error.message);
  }

  return redirect("/admin");
};

export const signOutAction = async () => {
  const client = await createSupabaseClient();
  await client.auth.signOut();
  return redirect("/sign-in");
};

export const checkCardExists = async (cardNumber: string) => {
  const client = await createSupabaseClient();

  const { data, error } = await client.from('cards').select('*').eq('number', cardNumber).maybeSingle();

  if (error) {
    return {
      exists: false,
      active: false,
      id: null
    };
  }

  if (!data) return {
    exists: false,
    active: false,
    id: null
  }
  console.log(data.id);

  return {
    exists: true,
    active: data.active,
    id: data.id
  };
}

export const saveCard = async (payload: ICardRequest): Promise<boolean> => {
  const client = await createSupabaseClient();
  const { data: userData } = await client.auth.getUser();
  const user_id = userData.user!.id;

  const { error } = await client.from("cards").insert({
    ...payload,
    country_code: "US",
    user_id,
  });

  if (error) {
    console.log(error);
    throw new GenericError("Failed to create card", 500);
  }

  return true;
};

export const getProfile = async (userId: string) => {
  const client = await createSupabaseClient();
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (!error) {
    return data;
  }

  throw error;
};

export const getCards = async () => {
  const client = await createSupabaseClient();
  const { data: userData } = await client.auth.getUser();
  const profile = await getProfile(userData.user!.id);

  if (profile.admin) {
    return await client.from("cards").select("*").eq("active", true);
  }

  return await client
    .from("cards")
    .select("*")
    .eq("user_id", userData.user!.id)
    .eq("active", true);
};

export const disableCard = async (id: number, active: boolean = false) => {
  const client = await createSupabaseClient();

  const result = await client
    .from("cards")
    .update({ active })
    .eq("id", id)
    .select();

  if (!result.error) {
    revalidatePath("/admin/cards");
  }

  return result.error;
};
