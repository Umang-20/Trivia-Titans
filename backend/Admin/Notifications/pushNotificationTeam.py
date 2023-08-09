import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notifications-team')

def lambda_handler(event, context):
    print('Event: ', json.dumps(event))

  
    body = json.loads(event['body'])
    notification_id = str(uuid.uuid4())

    members = body['members']  
    teamName = body['teamName']


    for member in members:
        item = {
            'notificationId': notification_id,
            'member': members,
            'teamName': teamName

        }

        table.put_item(Item=item)

    return {
        'statusCode': 200,
        'body': json.dumps('Items successfully written to DynamoDB')
    }
