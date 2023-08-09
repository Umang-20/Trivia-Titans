const AWS = require("aws-sdk");
const { getFirestoreInstance } = require("./layer/firestoredb");
const util = require("util");

// const ENDPOINT = "y47zhd8zv8.execute-api.us-east-1.amazonaws.com/dev/";
const client = new AWS.ApiGatewayManagementApi({ endpoint: process.env.ENDPOINT });
let db = null;

let gGameId = null;
const BASE_SCORE = 500;
const SEC_PER_QUESTION = 20; // This is in seconds
const BONOUS_PER_SECOND = 15;

const createCronJob = async (game) => {
    console.log(game.startTime);

    const eventBridge = new AWS.EventBridge({ apiVersion: "2015-10-07" });

    // Promisify the putTargets method
    const putTargetsPromise = util.promisify(eventBridge.putTargets.bind(eventBridge));

    try {
        const ruleParams = {
            Name: game.gameId,
            ScheduleExpression: `cron(${game.startTime})`,
            State: "ENABLED",
            RoleArn: "arn:aws:iam::848102883742:role/LabRole",
        };

        console.log(ruleParams);

        const ruleData = await eventBridge.putRule(ruleParams).promise();
        console.log("Rule updated successfully:", ruleData.RuleArn);

        const targetParams = {
            Rule: game.gameId,
            Targets: [
                {
                    Id: game.gameId,
                    Arn: "arn:aws:lambda:us-east-1:848102883742:function:sendQuestions",
                    Input: JSON.stringify({ gameId: game.gameId }),
                },
            ],
        };

        console.log(targetParams);

        const targetData = await putTargetsPromise(targetParams);
        console.log("Target attached successfully:", targetData);

        // try {
        //     const lambda = new AWS.Lambda();
        //     const addPermissionParams = {
        //         FunctionName: "sendQuestions",
        //         StatementId: `AllowEventBridgeInvoke`,
        //         Action: "lambda:InvokeFunction",
        //         Principal: "events.amazonaws.com",
        //         SourceArn: "arn:aws:events:us-east-1:848102883742:rule/*",
        //     };

        //     const addPermissionResponse = await lambda.addPermission(addPermissionParams).promise();
        //     console.log("Permission added successfully:", addPermissionResponse);
        // } catch (err) {
        //     console.log("Error adding permission : ", err.message);
        // }
    } catch (err) {
        console.log("Error:", err);
    }
};

const deleteConnectionFromDb = async (gameId, userId) => {
    const collectionRef = db.collection("Games");
    const connectionRef = await collectionRef.doc(gameId).collection("Connections");
    console.log(userId);
    const snapshot = await connectionRef.where("userId", "==", userId).get();

    console.log(snapshot);

    if (snapshot.size !== 0) {
        console.log("DELETED");
        for (const doc of snapshot.docs) {
            await connectionRef.doc(doc.id).delete();
        }
    }
};

exports.handler = async (event) => {
    console.log(event);

    if (!db) {
        db = await getFirestoreInstance("TRIVIA_TITANS_PLAY_GAME");
    }
    // const connectionColRef = await db.collection("Connections");

    if (event.requestContext) {
        const { connectionId, routeKey } = event.requestContext;
        let body = {};

        if (event.body) {
            body = JSON.parse(event?.body);
        }

        console.log(routeKey);

        switch (routeKey) {
            case "$connect":
                break;

            case "$disconnect":
                // await db.collection("Games").doc(body.gameId).collection("Connections").doc(connectionId).delete();
                break;

            case "$default":
                const { gameId, startTime, userId } = body;
                gGameId = gameId;
                const collectionRef = db.collection("Games");
                const connectionRef = await collectionRef.doc(gameId).collection("Connections");
                console.log(userId);
                const snapshot = await connectionRef.where("userId", "==", userId).get();

                console.log(snapshot);

                if (snapshot.size !== 0) {
                    console.log("DELETED");
                    for (const doc of snapshot.docs) {
                        await connectionRef.doc(doc.id).delete();
                    }
                }

                await connectionRef.doc(connectionId).set({
                    userId,
                });

                // const snapshot = await collectionRef.doc(gameId).get();
                // const connections = snapshot.data().connections || [];

                // const alreadyConnected = connections.some((connection) => connection === connectionId);
                // console.log(alreadyConnected);

                // if (!alreadyConnected) {
                //     connections.push(connectionId);
                //     await collectionRef.doc(gameId).set(
                //         {
                //             connections,
                //         },
                //         { merge: true }
                //     );
                // }

                const connections = await connectionRef.get();
                console.log(connections);

                if (connections.size === 1) {
                    console.log("CREATE EVENT");
                    await createCronJob({ startTime, gameId });
                }

                break;

            case "SubmitAnswer":
                console.log("HANDLE SUBMIT ANSWER");
                console.log(body);

                const question = await db.collection("Questions").doc(body.questionId).get();
                console.log(question.data());

                let score = 0;
                if (question.data().correct === body.userAnswer) {
                    console.log("===== INSIDE =====");

                    const bonusScore = (SEC_PER_QUESTION - body.timeTaken) * BONOUS_PER_SECOND;
                    console.log(bonusScore);

                    score = BASE_SCORE + bonusScore;
                }

                const userAnswersRef = await db.collection("Games").doc(body.gameId).collection("Answers").doc(body.userId);

                await userAnswersRef.set(
                    {
                        [body.questionId]: {
                            userAnswer: body.userAnswer,
                            at: body.at,
                            score,
                        },
                    },
                    { merge: true }
                );

                const docSnapshot = await db.collection("Games").doc(body.gameId).collection("Answers").get();
                const scores = {};

                for (const doc of docSnapshot.docs) {
                    const answers = doc.data();
                    console.log(Object.values(answers));

                    const total = Object.values(answers).reduce((acc, question) => {
                        return acc + (question?.score || 0);
                    }, 0);

                    // scores[doc.id] = total;

                    const userDetails = await db.collection("Users").doc(doc.id).get();

                    scores[doc.id] = {
                        total,
                        ...userDetails.data(),
                    };
                }
                console.log(scores);

                try {
                    await client
                        .postToConnection({
                            ConnectionId: connectionId,
                            Data: Buffer.from(JSON.stringify({ scores })),
                        })
                        .promise();
                } catch (err) {
                    console.log(err);
                }

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
