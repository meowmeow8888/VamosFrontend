importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/12.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBz_amKvXRexwrAo8UsVHgHlXAQI_QPaY8",
  authDomain: "vamos-brazil.firebaseapp.com",
  projectId: "vamos-brazil",
  storageBucket: "vamos-brazil.firebasestorage.app",
  messagingSenderId: "78592299888",
  appId: "1:78592299888:web:cde5498a6ab791c5e735b5",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/icon-192.png",
  });
});
