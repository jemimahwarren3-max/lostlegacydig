// Thin wrapper around the Paynow SDK. Returns null when no integration
// credentials are configured yet, so the rest of the app can fall back to
// test mode without crashing. Set PAYNOW_INTEGRATION_ID and
// PAYNOW_INTEGRATION_KEY (from paynow.co.zw, after your merchant account is
// approved) plus PAYNOW_RESULT_URL / PAYNOW_RETURN_URL to go live.
import { Paynow } from "paynow";

export function getPaynow() {
  const id = process.env.PAYNOW_INTEGRATION_ID;
  const key = process.env.PAYNOW_INTEGRATION_KEY;
  if (!id || !key) return null;

  const paynow = new Paynow(id, key);
  if (process.env.PAYNOW_RESULT_URL) paynow.resultUrl = process.env.PAYNOW_RESULT_URL;
  if (process.env.PAYNOW_RETURN_URL) paynow.returnUrl = process.env.PAYNOW_RETURN_URL;
  return paynow;
}

export function isPaynowConfigured() {
  return Boolean(process.env.PAYNOW_INTEGRATION_ID && process.env.PAYNOW_INTEGRATION_KEY);
}
