var admin = require("firebase-admin");

var serviceAccount = require("../firebase-secret.json");

const config = {
  credential: admin.credential.cert(serviceAccount),
};

const firebase = admin.apps.length ? admin.app() : admin.initializeApp(config);

function sendPushNotification(token, title, body) {
  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
  };

  firebase
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:", error);
    });
}

sendPushNotification(
  "eh85PyxfQUGePhymJqTSTW:APA91bG-bdjkFAPVjSrPpPeZLh062OtKrhi2BBt_bzTB3lpUNVt-LanYJCf9O_d6bV_VPuq_734-2BSzpYczUnlSzQ0qJ2Sodk0VfnrscVGFQsGowRD7_204kxYGTEajSo2gEX9kT4yt",
  "Test title",
  "Test body"
);

module.exports = { sendPushNotification, firebase };
