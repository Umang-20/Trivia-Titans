import boto3
import uuid
import json

def lambda_handler(event, context):

    body = json.loads(event.get('body', '{}'))
    game_name = body.get('gameName', '')


    notification_id = str(uuid.uuid4())


    dynamodb = boto3.resource('dynamodb')

    table_name = 'notifications'
    table = dynamodb.Table(table_name)


    item = {
        'notificationId': notification_id,
        'gameName': game_name

    }

    try:

        response = table.put_item(Item=item)
        print("Item stored successfully:", response)

 
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': 'Item stored successfully',
                'item': item,
            }),
        }
    except Exception as e:
        print("Error storing item in DynamoDB:", e)

        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error storing item in DynamoDB',
                'error': str(e),
            }),
        }
