import json 

def lambda_handler(event, context):
    print("Novo objeto adicionado")
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
