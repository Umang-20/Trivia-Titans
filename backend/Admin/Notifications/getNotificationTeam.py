import boto3
import json
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')

def lambda_handler(event, context):
    try:
        table = dynamodb.Table('notifications-team')
        response = table.scan()

        items = response['Items']

        team_notifications = []
        for item in items:
            team_notification = {
                'notificationId': item['notificationId'],
                'member': item['member'],
                'teamName': item['teamName']
            }
            team_notifications.append(team_notification)

        print(json.dumps(team_notifications, indent=4))

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            },
            'body': json.dumps(team_notifications)
        }
    except Exception as e:
        print("Error fetching items from DynamoDB:", e)

        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error fetching items from DynamoDB',
                'error': str(e),
            }),
        }
