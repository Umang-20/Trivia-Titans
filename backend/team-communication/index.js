const AWS = require("aws-sdk");
const { getFirestoreInstance } = require("/opt/firestoredb");

const ENDPOINT = "b4jraa64r9.execute-api.us-east-1.amazonaws.com/development/";
const client = new AWS.ApiGatewayManagementApi({ endpoint: ENDPOINT });
let db = null;

const sendMessage = async (connectionId, body) => {
    try {
        await client
            .postToConnection({
                ConnectionId: connectionId,
                Data: Buffer.from(JSON.stringify(body)),
            })
            .promise();
    } catch (err) {
        console.log(err);
    }
};

const sendMessageToTeam = async (connectionIds, body) => {
    return Promise.all(connectionIds.map((id) => sendMessage(id, body)));
};

const saveMessageToDb = async (message, teamId, userId, db) => {
    const collectionRef = await db.collection("Teams");
    const snapshot = await collectionRef.doc(teamId).get();

    const chats = snapshot.data()?.chats || [];

    const messageObj = {
        at: new Date(),
        sender: userId,
        message,
    };

    chats.push(messageObj);

    await collectionRef.doc(teamId).set(
        {
            chats,
        },
        { merge: true }
    );

    return messageObj;
};

exports.handler = async (event) => {
    console.log(event);

    if (!db) {
        db = await getFirestoreInstance("TRIVIA_TITANS_TEAM_COMMUNICATION");
    }
    const connectionColRef = await db.collection("Connections");

    if (event.requestContext) {
        const { connectionId, routeKey } = event.requestContext;
        let body = {};

        if (event.body) {
            body = JSON.parse(event?.body);
        }

        switch (routeKey) {
            case "$connect":
                break;

            case "$disconnect":
                await connectionColRef.doc(connectionId).delete();
                break;

            case "$default":
                console.log("===== DEFAULT EXECUTED =====");

                console.log(body.userId);
                await connectionColRef.doc(connectionId).set({
                    userId: body.userId,
                    teamId: body.teamId,
                });
                break;

            case "sendMessageToTeam":
                console.log("===== sendMessageToTeam EXECUTED =====");

                const { message, teamId, userId } = body;
                const snapshot = await connectionColRef.where("teamId", "==", teamId).get();

                const connectionIds = [];
                for (const doc of snapshot.docs) {
                    connectionIds.push(doc.id);
                }

                console.log("===== CONNECTION ARRAY =====");
                console.log(connectionIds);

                const res = await saveMessageToDb(message, teamId, userId, db);
                await sendMessageToTeam(connectionIds, res);

                break;

            default:
                break;
        }
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify("Hello from Lambda!"),
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
            "Content-Type": "application/json",
        },
    };
    return response;
};
