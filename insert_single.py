import os
import json
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from dotenv import load_dotenv

def main():
    if len(os.sys.argv) != 2:
        print('Usage: python insert_single.py <x_payload_output.json>')
        return

    file_path = os.sys.argv[1]

    with open(file_path, 'r') as f:
        data = json.load(f)

    load_dotenv()

    client = Client()
    databases = Databases(client)

    client.set_endpoint(os.getenv('NEXT_PUBLIC_APPWRITE_ENDPOINT'))  # Your Appwrite Endpoint
    client.set_project(os.getenv('NEXT_PUBLIC_APPWRITE_PROJECT_ID'))  # Your project ID
    client.set_key(os.getenv('APPWRITE_API_KEY'))  # Your API key with permissions

    try:
        # Split ingredients and instructions by newline characters to create arrays
        if 'ingredients' in data and isinstance(data['ingredients'], str):
            data['ingredients'] = data['ingredients'].split('\n')
        if 'instructions' in data and isinstance(data['instructions'], str):
            data['instructions'] = data['instructions'].split('\n')
        if 'chefTips' in data and isinstance(data['chefTips'], str):
            data['chefTips'] = data['chefTips'].split('\n')

        response = databases.create_document(
            database_id=os.getenv('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
            collection_id=os.getenv('NEXT_PUBLIC_APPWRITE_RECIPES_COLLECTION_ID'),
            document_id=ID.unique(),
            data=data
        )
        print(response)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
