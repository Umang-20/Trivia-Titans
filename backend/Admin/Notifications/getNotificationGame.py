import boto3
import json

def lambda_handler(event, context):

    dynamodb = boto3.client('dynamodb')

    try:
        
        response = dynamodb.scan(
            TableName='notifications',
            ProjectionExpression='gameName',
        )

        items = response['Items']
        gameNames = [item['gameName']['S'] for item in items]

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',  
                'Access-Control-Allow-Credentials': 'true',
    },
            'body': json.dumps(gameNames)
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
