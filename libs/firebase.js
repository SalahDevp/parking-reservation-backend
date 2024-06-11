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

/*sendPushNotification(
  "dbF_MAg_T2a_Naodi4hBjE:APA91bHldn5d3rZlAO3nqtrwNeivEkRKdYkueFF5k8pNh2athLTgisBubjA_R_lv0dLWK4BHvlb80o2BFwo14P9iZUILH5MFTIIvId0uzXV_fqlkKq64SIplpHtXd53fe_ppfG_KPahZ",
  "Test title",
  "Test body"
);*/

module.exports = { sendPushNotification, firebase };
