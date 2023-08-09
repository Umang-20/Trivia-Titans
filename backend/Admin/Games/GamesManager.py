import json
import os
from google.cloud import firestore
from google.api_core.datetime_helpers import DatetimeWithNanoseconds
from google.cloud.firestore_v1._helpers import DatetimeWithNanoseconds
from datetime import datetime
import dateutil.parser
import logging

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./GCPkey.json"
db = firestore.Client('csci-5410-391423')


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
}

def convert_to_dict(obj):
    if isinstance(obj, DatetimeWithNanoseconds):
        return obj.isoformat()
    elif isinstance(obj, dict):
        return {k: convert_to_dict(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_dict(v) for v in obj]
    else:
        return obj

# Fetch Games
def fetch_games(event, context):
    games_ref = db.collection(u'Games')
    docs = games_ref.stream()

    games = []
    for doc in docs:
        game = doc.to_dict()
        game = convert_to_dict(game)  
        game['id'] = doc.id  
        games.append(game)

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps(games)
    }


# Add Game
def add_game(event, context):
    try:
        data = json.loads(event['body'])
        gameName = data['gameName']
        category = data['category']
        difficulty = data['difficulty']
        gameDescription = data['gameDescription']

        
        time_string = data['time']
        dt = dateutil.parser.parse(time_string)
        time = dt.replace(tzinfo=None)

        timeframe = data['timeframe']

        doc_ref = db.collection(u'Games').document()
        doc_ref.set({
            u'gameName': gameName,
            u'category': category,
            u'difficulty': difficulty,
            u'gameDescription': gameDescription,
            u'time': time,
            u'timeframe': timeframe
        })

        return {
            'statusCode': 200,
            'headers': CORS_HEADERS,
            'body': json.dumps('Game added successfully')
        }
    except Exception as e:
        logging.error("Error adding game: %s", e)
        return {
            'statusCode': 500,
            'headers': CORS_HEADERS,
            'body': json.dumps('Internal Server Error')
        }

# Delete Game
def delete_game(event, context):
    document_id = event['pathParameters'].get('gameId')
    if document_id is None:
        return {
            'statusCode': 400,
            'headers': CORS_HEADERS,
            'body': json.dumps('Missing gameId in path parameters')
        }
    doc_ref = db.collection(u'Games').document(document_id)
    doc_ref.delete()

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps('Game deleted successfully')
    }

# Update Game
def update_game(event, context):
    document_id = event['pathParameters'].get('gameId')
    if document_id is None:
        return {
            'statusCode': 400,
            'headers': CORS_HEADERS,
            'body': json.dumps('Missing gameId in path parameters')
        }

    data = json.loads(event['body'])
    gameName = data['gameName']
    category = data['category']
    difficulty = data['difficulty']
    gameDescription = data['gameDescription']

    time_string = data['time']
    dt = dateutil.parser.parse(time_string)
    time = dt.replace(tzinfo=None)


    timeframe = data['timeframe']

    doc_ref = db.collection(u'Games').document(document_id)
    doc_ref.update({
        u'gameName': gameName,
        u'category': category,
        u'difficulty': difficulty,
        u'gameDescription': gameDescription,
        u'time': time,
        u'timeframe': timeframe
    })

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps('Game updated successfully')
    }

# Main Lambda Handler
def lambda_handler(event, context):
    http_method = event['httpMethod']

    if http_method == 'GET':
        return fetch_games(event, context)
    elif http_method == 'POST':
        return add_game(event, context)
    elif http_method == 'DELETE':
        return delete_game(event, context)
    elif http_method == 'PUT':
        return update_game(event, context)
    elif http_method == 'OPTIONS':

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT,DELETE',
            },
            'body': 'Done'
        }
    else:
        return {
            'statusCode': 400,
            'body': 'Invalid HTTP Method'
        }

if __name__ == "__main__":
    event = {}  
    context = {} 
    print(lambda_handler(event, context))