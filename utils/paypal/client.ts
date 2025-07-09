import axios from "axios";

let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getPayPalAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  if (cachedToken && now < tokenExpiry) {
    return cachedToken;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  const baseUrl = process.env.PAYPAL_BASE_URL!;

  if (!clientId || !clientSecret) throw Error("paypal credentials idiot!");

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString(
    "base64"
  );

  const res = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${basicAuth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error("Failed to fetch PayPal access token");

  const data = await res.json();

  cachedToken = data.access_token;
  tokenExpiry = now + data.expires_in - 60; // subtract 60s as buffer

  return cachedToken!;
}

export async function getPayPalClient() {
  const token = await getPayPalAccessToken();
  console.log(token);

  return axios.create({
    baseURL: process.env.PAYPAL_BASE_URL!,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      Prefer: "return=minimal",
    },
  });
}
