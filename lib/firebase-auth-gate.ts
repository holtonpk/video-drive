import {getFunctions, httpsCallable} from "firebase/functions";
import {app, auth} from "@/config/firebase";

export {auth};
export const functions = getFunctions(app, "us-central1");

export const sendEmailCode = httpsCallable<
  {email: string},
  {ok: boolean; expiresInMinutes: number; resendCooldownSeconds: number}
>(functions, "sendEmailCode");

export const verifyEmailCode = httpsCallable<
  {email: string; code: string},
  {ok: boolean; token: string}
>(functions, "verifyEmailCode");
