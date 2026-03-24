import {applicationDefault, cert, getApps, initializeApp} from "firebase-admin/app";
import {getFirestore} from "firebase-admin/firestore";

/** Must match client `config/firebase.ts` when using ADC without embedded project_id. */
const DEFAULT_FIREBASE_PROJECT_ID = "video-drive-8d636";

function initAdmin() {
  if (getApps().length) return;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ??
    process.env.GCLOUD_PROJECT ??
    process.env.GOOGLE_CLOUD_PROJECT ??
    DEFAULT_FIREBASE_PROJECT_ID;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (raw?.trim()) {
    try {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      initializeApp({
        credential: cert(parsed),
        projectId:
          (typeof parsed.project_id === "string" && parsed.project_id) ||
          projectId,
      });
      return;
    } catch {
      // fall through to ADC
    }
  }

  initializeApp({
    credential: applicationDefault(),
    projectId,
  });
}

initAdmin();

export function getAdminDb() {
  return getFirestore();
}
