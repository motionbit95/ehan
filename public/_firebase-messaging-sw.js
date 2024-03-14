importScripts("https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js");

importScripts(
  "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js"
);

firebase.initializeApp({
  messagingSenderId: "773807449409", //이곳은 자신의 프로젝트 설정 => 클라우드 메세징 => 발신자ID를 기입
});

const messaging = firebase.messaging();

self.addEventListener("push", function (event) {
  const data = event.data.json();
  const fcmMessageId = data.fcmMessageId;

  event.waitUntil(
    // 클라이언트를 등록하고 메시지를 전달합니다.
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: "push",
          fcmMessageId: fcmMessageId,
          data: data,
        });
      });
    })
  );
});

self.addEventListener("notificationclick", function (event) {
  console.log("notification click");
  const url = "/";
  event.notification.close();
  event.waitUntil(clients.openWindow(url));
});

self.addEventListener("install", function (e) {
  console.log("fcm sw install..");
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  console.log("fcm sw activate..");
});

// onMessage 이벤트 핸들러 설정
self.addEventListener("message", function (event) {
  console.log("Message received in service worker:", event);

  // 클라이언트에서 전달된 데이터 추출
  const message = event.data;

  console.log(message);

  // 메시지 처리
  // 이곳에서 푸시 알림을 받은 후 실행할 동작을 정의합니다.
});
