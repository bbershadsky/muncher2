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
    video_id = '_'.join(os.path.basename(file_path).split('_')[:-1])  # Extract video ID correctly
    if '?' in video_id:
        video_id = video_id.split('?')[0]

    load_dotenv()

    client = Client()
    databases = Databases(client)

    client.set_endpoint(os.getenv('NEXT_PUBLIC_APPWRITE_ENDPOINT'))  # Your Appwrite Endpoint
    client.set_project(os.getenv('NEXT_PUBLIC_APPWRITE_PROJECT_ID'))  # Your project ID
    client.set_key(os.getenv('APPWRITE_API_KEY'))  # Your API key with permissions

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        if data is None:
            raise ValueError("No data found in the JSON file.")
        
        # Add ID to the data
        data['id'] = video_id

        # Ensure the subtitles file path does not contain __payload_
        subtitles_file_path = f"{video_id}__subtitles.txt".replace("__payload_", "")
        if os.path.exists(subtitles_file_path):
            with open(subtitles_file_path, 'r') as f:
                data['rawSubtitles'] = f.read()
        else:
            raise FileNotFoundError(f"Subtitles file {subtitles_file_path} not found.")

        # Add sourceUrl to the data
        data['sourceUrl'] = f"https://youtu.be/{video_id}"

        # Split ingredients, instructions, and chefTips by newline characters to create arrays
        if 'ingredients' in data and isinstance(data['ingredients'], str):
            data['ingredients'] = data['ingredients'].split('\n')
        if 'instructions' in data and isinstance(data['instructions'], str):
            data['instructions'] = data['instructions'].split('\n')
        if 'chefTips' in data and isinstance(data['chefTips'], str):
            data['chefTips'] = data['chefTips'].split('\n')

        # Load additional metadata from the meta file
        try:
            meta_file_path = f"{video_id}__meta.json"
            if os.path.exists(meta_file_path):
                with open(meta_file_path, 'r') as f:
                    meta_data = json.load(f)
                    data.update(meta_data)
            else:
                raise FileNotFoundError(f"Meta file {meta_file_path} not found.")
        except json.JSONDecodeError:
            print("Failed to decode JSON from the meta file.")
        except FileNotFoundError as e:
            print(f"File not found: {e}")

        # Set isSubtitlesProcessed and isNeedsReview
        data['isSubtitlesProcessed'] = True
        data['isNeedsReview'] = False

        response = databases.create_document(
            database_id=os.getenv('NEXT_PUBLIC_APPWRITE_DATABASE_ID'),
            collection_id=os.getenv('NEXT_PUBLIC_APPWRITE_RECIPES_COLLECTION_ID'),
            document_id=ID.unique(),
            data=data
        )
        print(response)
    except json.JSONDecodeError:
        print("Failed to decode JSON.")
    except FileNotFoundError as e:
        print(f"File not found: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
        if data is not None:
            data['isSubtitlesProcessed'] = False
            data['isNeedsReview'] = True
            # Save the updated data with error status back to the file for review
            with open(file_path, 'w') as f:
                json.dump(data, f, indent=4)

if __name__ == "__main__":
    main()
