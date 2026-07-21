import { useEffect, useState } from "react";
import { getMessaging, getToken } from "firebase/messaging";
import { app } from "../utils/firebase";

const messaging = getMessaging(app);

export function useNotifications() {
  const [token, setToken] = useState("");

  useEffect(() => {
    async function init() {
      const permission = await Notification.requestPermission();

      if (permission !== "granted") return;

      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      setToken(token);
    }

    init();
  }, []);

  return { token };
}
