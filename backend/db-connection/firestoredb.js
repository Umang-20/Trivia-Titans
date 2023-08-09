const AWS = require("aws-sdk");
const admin = require("firebase-admin");

exports.getFirestoreInstance = async (appName) => {
    let firestore = null;
    const firebaseApp = admin.apps.some((app) => app.name === appName);

    if (!firebaseApp) {
        const client = new AWS.SecretsManager({ region: "us-east-1" });
        const secret = await client.getSecretValue({ SecretId: process.env.SECRET_NAME }).promise();
        const secretsObj = JSON.parse(secret.SecretString);
        console.log(secretsObj);

        admin.initializeApp(
            {
                credential: admin.credential.cert(secretsObj),
            },
            appName
        );

        firestore = admin.app(appName).firestore();
        console.log("SUCCEEDED");
    } else {
        firestore = admin.app(appName).firestore();
    }

    return firestore;
};
