"use server";

import { createSupabaseClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { encodedRedirect } from "@/utils/redirect";
import {
  ICardRequest,
  IPlan,
  TIntervalUnit,
  TSupabasePlan,
  TTenureType,
} from "@/utils/types";
import GenericError from "@/utils/error";
import { revalidatePath } from "next/cache";
import {
  INTERVAL_UNIT_MAP,
  SUBSCRIPTION_STATUS_MAP,
  TENURE_TYPE_MAP,
} from "@/utils/constants";
import { Database } from "@/database.types";
import { type SupabaseClient } from "@supabase/supabase-js";
type TSupabaseClient = SupabaseClient<Database, "public", Database["public"]>;

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

  const { data, error } = await client
    .from("cards")
    .select("*")
    .eq("number", cardNumber)
    .maybeSingle();

  if (error) {
    return {
      exists: false,
      active: false,
      id: null,
    };
  }

  if (!data)
    return {
      exists: false,
      active: false,
      id: null,
    };
  console.log(data.id);

  return {
    exists: true,
    active: data.active,
    id: data.id,
  };
};

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
    return await client.from("cards").select("*");
  }

  return await client
    .from("cards")
    .select("*")
    .eq("user_id", userData.user!.id);
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

export const checkPlanExists = async (client: TSupabaseClient, id: string) => {
  const result = await client
    .from("plans")
    .select("*")
    .eq("plan_id", id)
    .single();

  if (!result.error) {
    if (result.data) return true;
    return false;
  }

  return false;
};

export const upsertPaypalPlan = async (plan: IPlan) => {
  const client = await createSupabaseClient();

  const userData = await client.auth.getUser();
  console.log(userData.data.user);

  const { id, name, status, billing_cycles, product_id, description } = plan;

  const interval =
    INTERVAL_UNIT_MAP[
      billing_cycles[0].frequency.interval_unit as TIntervalUnit
    ];
  const { currency_code, value: fixed_price } =
    billing_cycles[0].pricing_scheme.fixed_price;
  const tenure = TENURE_TYPE_MAP[billing_cycles[0].tenure_type as TTenureType];

  if (!userData.data.user) throw new GenericError("Failed to get user");

  const { error } = await client.from("plans").upsert(
    {
      paypal_plan_id: id,
      fixed_price: +fixed_price,
      currency_code,
      name,
      status: SUBSCRIPTION_STATUS_MAP[status],
      user_id: userData.data.user!.id,
      description,
      paypal_produt_id: product_id,
      interval_count: billing_cycles[0].frequency.interval_count,
      interval_unit: interval,
      sequence: billing_cycles[0].sequence,
      tenure_type: tenure,
      total_cycles: billing_cycles[0].total_cycles,
    },
    { onConflict: "paypal_plan_id" }
  );

  if (error) throw error;
};

export const getPayPalPlans = async (): Promise<TSupabasePlan[]> => {
  const client = await createSupabaseClient();
  const { data: userData } = await client.auth.getUser();

  const result = await client
    .from("plans")
    .select("*")
    .eq("user_id", userData.user!.id);

  if (!result.error) return result.data;

  throw new GenericError(
    result.error.message ?? "Error happened",
    result.status
  );
};
