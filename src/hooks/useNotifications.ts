import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../utils/firebase";

const messaging = getMessaging(app);

export function useNotifications() {
  const [token, setToken] = useState("");
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    async function init() {
      try {
        // 1. Check if the browser actually supports notifications
        if (!("Notification" in window)) {
          console.warn("This browser does not support desktop notifications.");
          return;
        }

        // 2. Only request permission if it hasn't been granted or denied yet
        let permission = Notification.permission;
        if (permission === "default") {
          permission = await Notification.requestPermission();
        }

        if (permission !== "granted") {
          console.warn("Notification permission not granted.");
          return;
        }

        // 3. Get the token with error handling
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          setToken(currentToken);
        } else {
          console.warn(
            "No registration token available. Request permission to generate one.",
          );
        }
      } catch (err) {
        console.error("An error occurred while retrieving token:", err);

        // 2. Check if 'err' is an actual Error object before setting it
        if (err instanceof Error) {
          setError(err);
        } else {
          // Fallback for string-based throws or custom objects
          setError(new Error(String(err)));
        }
      }
    }

    init();
  }, []);

  return { token, error };
}
