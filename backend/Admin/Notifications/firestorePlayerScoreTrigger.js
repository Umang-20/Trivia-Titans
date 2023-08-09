const functions = require('firebase-functions');
const axios = require('axios'); 

exports.playerScoreUpdateTrigger = functions.firestore.document('Score/{scoreId}')
    .onWrite((change, context) => {

        if (!change.before.exists) {

            const playerData = change.after.data();

            const entityType = playerData.entity_type;
            const name = playerData.name;
            const score = playerData.score;
            

            sendToLambda(entityType, name, score);
        } else if (change.before.exists && change.after.exists) {

            const beforeData = change.before.data();
            const afterData = change.after.data();

            if (beforeData.score !== afterData.score) {
    

                const entityType = afterData.entity_type;
                const name = afterData.name;
                const score = afterData.score;

                sendToLambda(entityType, name, score);
            }
        }
    });


function sendToLambda(entityType, name, score) {
    const awsLambdaEndpoint = " https://wdwj0buap7.execute-api.us-east-1.amazonaws.com/default/scorenotifications"; 

    console.log('Firestore Trigger: Sending data to AWS Lambda via API Gateway');


    const awsLambdaPayload = {
        entityType: entityType,
        name: name,
        score: score
    };


    return axios.post(awsLambdaEndpoint, awsLambdaPayload)
        .then((response) => {
            console.log('Successfully sent entityType, name, and score to AWS Lambda function.');
            console.log('AWS Lambda response:', response.data);
            return;
        })
        .catch((error) => {
            console.log('Error sending entityType, name, and score to AWS Lambda function:', error);
        });
}
