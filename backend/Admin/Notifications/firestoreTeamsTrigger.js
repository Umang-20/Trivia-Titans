const functions = require('firebase-functions');
const axios = require('axios'); 

exports.firestoregamestrigger = functions.firestore.document('Teams/{teamId}')
    .onWrite((change, context) => {

        if (!change.before.exists) {
  
            const teamData = change.after.data();


        } else if (change.before.exists && change.after.exists) {

            const beforeData = change.before.data();
            const afterData = change.after.data();

            if (JSON.stringify(beforeData.members) !== JSON.stringify(afterData.members)) {


                const teamName = afterData.t_name;
                const members = afterData.members; 

                const awsLambdaEndpoint = "https://k0wkpv52re.execute-api.us-east-1.amazonaws.com/default/teamnotifications"; 

                console.log('Firestore Trigger: Sending data to AWS Lambda via API Gateway');


                const awsLambdaPayload = {
                    teamName: teamName,
                    members: members
                };

                return axios.post(awsLambdaEndpoint, awsLambdaPayload)
                    .then((response) => {
                        console.log('Successfully sent teamName and Members to AWS Lambda function.');
                        console.log('AWS Lambda response:', response.data);
                        return;
                    })
                    .catch((error) => {
                        console.log('Error sending teamName and Members to AWS Lambda function:', error);
                    });
            }
        }
    });