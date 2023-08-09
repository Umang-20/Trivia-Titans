import json
import boto3
import uuid

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notifications-score')

def lambda_handler(event, context):
    print('Event: ', json.dumps(event))

    body = json.loads(event['body'])

    entityType = body['entityType']
    name = body['name']
    score = body['score']

    item = {
        'notificationId': str(uuid.uuid4()), # Generating a random UUID
        'entityType': entityType,
        'name': name,
        'score': score
    }

    table.put_item(Item=item)

    return {
        'statusCode': 200,
        'body': json.dumps('Item successfully written to DynamoDB')
    }
