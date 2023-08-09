const functions = require('firebase-functions');
const axios = require('axios'); 

exports.firestoreGamesTrigger = functions.firestore.document('Games/{gameId}')
    .onCreate((snap, context) => {
        const game = snap.data();
        const awsLambdaEndpoint = "https://07c4hsswo7.execute-api.us-east-1.amazonaws.com/default/notifications"; 

        console.log('Firestore Trigger: Sending data to AWS Lambda via API Gateway');

      
        const gameName = game.gameName;

        
        const awsLambdaPayload = {
            gameName: gameName 
        };

      
        return axios.post(awsLambdaEndpoint, awsLambdaPayload)
            .then((response) => {
                console.log('Successfully sent gameName to AWS Lambda function.');
                console.log('AWS Lambda response:', response.data);
                return;
            })
            .catch((error) => {
                console.log('Error sending gameName to AWS Lambda function:', error);
            });
    });
