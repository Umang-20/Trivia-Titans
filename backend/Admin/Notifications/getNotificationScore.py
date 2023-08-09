import json
import boto3
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('notifications-score')

def lambda_handler(event, context):
    print('Event: ', json.dumps(event))

    response = table.scan()

    # Get items from response
    items = response['Items']

    try:
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Credentials': 'true',  
            },
            'body': json.dumps(items, cls=DecimalEncoder)  # Use the custom encoder
        }
    except Exception as e:
        print("Error fetching items from DynamoDB:", e)
        # Prepare the error response
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Error fetching items from DynamoDB',
                'error': str(e),
            }),
        }
