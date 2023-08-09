import json
import os
from google.cloud import firestore

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "./GCPkey.json"
db = firestore.Client('csci-5410-391423')


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
}

# Fetch Questions
def fetch_questions(event, context):
    questions_ref = db.collection(u'Questions')
    docs = questions_ref.stream()

    questions = []
    for doc in docs:
        question = doc.to_dict()
        question['id'] = doc.id  
        questions.append(question)

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps(questions)
    }

# Add Question
def add_question(event, context):
    data = json.loads(event['body'])
    question = data.get('question')
    category = data.get('category')
    difficulty = data.get('difficulty')
    answerA = data.get('a')  
    answerB = data.get('b') 
    answerC = data.get('c')
    answerD = data.get('d')
    correctAnswer = data.get('correct')
    explanation = data.get('explanation')

    doc_ref = db.collection(u'Questions').document()
    doc_ref.set({
        u'question': question,
        u'category': category,
        u'difficulty': difficulty,
        u'a': answerA,
        u'b': answerB,
        u'c': answerC,
        u'd': answerD,
        u'correct': correctAnswer,
        u'explanation': explanation
    })

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps('Question added successfully')
    }

# Delete Question
def delete_question(event, context):
    gameId = event['pathParameters'].get('gameId')
    doc_ref = db.collection(u'Questions').document(gameId)
    doc_ref.delete()

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps('Question deleted successfully')
    }

# Update Question
def update_question(event, context):
    gameId = event['pathParameters'].get('gameId')
    data = json.loads(event['body'])
    question = data.get('question')
    category = data.get('category')
    difficulty = data.get('difficulty')
    answerA = data.get('a')  
    answerB = data.get('b') 
    answerC = data.get('c')
    answerD = data.get('d')
    correctAnswer = data.get('correct')
    explanation = data.get('explanation')

    doc_ref = db.collection(u'Questions').document(gameId)
    doc_ref.update({
        u'question': question,
        u'category': category,
        u'difficulty': difficulty,
        u'a': answerA,
        u'b': answerB,
        u'c': answerC,
        u'd': answerD,
        u'correct': correctAnswer,
        u'explanation': explanation
    })

    return {
        'statusCode': 200,
        'headers': CORS_HEADERS,
        'body': json.dumps('Question updated successfully')
    }

# Main Lambda Handler
def lambda_handler(event, context):
    http_method = event['httpMethod']

    if http_method == 'GET':
        return fetch_questions(event, context)
    elif http_method == 'POST':
        return add_question(event, context)
    elif http_method == 'DELETE':
        return delete_question(event, context)
    elif http_method == 'PUT':
        return update_question(event, context)
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