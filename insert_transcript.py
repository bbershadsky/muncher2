import os
import json
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from dotenv import load_dotenv


def main():
    if len(os.sys.argv) != 2:
        print("Usage: python insert_transcript.py <x_summary.json>")
        return

    file_path = os.sys.argv[1]
    video_id = "_".join(os.path.basename(file_path).split("_")[:-1])  # Extract video ID correctly
    if "?" in video_id:
        video_id = video_id.split("?")[0]

    # Load environment variables
    load_dotenv()

    # Initialize Appwrite client
    client = Client()
    databases = Databases(client)
    client.set_endpoint(os.getenv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))  # Your Appwrite Endpoint
    client.set_project(os.getenv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))  # Your project ID
    client.set_key(os.getenv("APPWRITE_API_KEY"))  # Your API key with permissions

    # Define allowed attributes based on your schema
    allowed_attributes = {
        "id": "string",
        "title": "string",
        "rawSubtitles": "string20000",
        "modelUsed": "string",
        "enSubtitles": "string20000",
        "sourceUrl": "string",
        "sourceLanguage": "string",
        "image": "string",
        "markdownData": "string20000",
        "totalTimeMinutes": "integer",
        "isSubtitlesProcessed": "boolean",
        "tags": "list_string",
        "score": "integer",
        "views": "integer",
        "creator": "string",
    }

    try:
        # Read summary JSON file
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        if data is None:
            raise ValueError("No data found in the JSON file.")

        # Filter out invalid attributes
        filtered_data = {key: value for key, value in data.items() if key in allowed_attributes}

        # Add additional fields
        filtered_data["id"] = video_id
        filtered_data["sourceUrl"] = f"https://youtu.be/{video_id}"
        filtered_data["isSubtitlesProcessed"] = True
        if "summary" in data:
            filtered_data["markdownData"] = data["summary"]  # Map summary to markdownData

        # Convert playtime to totalTimeMinutes
        if "playtime" in data:
            hours, minutes, seconds = map(int, data["playtime"].split(":"))
            total_time_minutes = hours * 60 + minutes + seconds // 60
            filtered_data["totalTimeMinutes"] = total_time_minutes

        # Add views and creator if available
        if "views" in data:
            filtered_data["views"] = data["views"]
        if "creator" in data:
            filtered_data["creator"] = data["creator"]

        # Read transcript file and add it to enSubtitles
        transcript_file = f"{video_id}_transcript.json"
        if os.path.exists(transcript_file):
            with open(transcript_file, "r", encoding="utf-8") as transcript_f:
                transcript_data = json.load(transcript_f)
                en_subtitles = " ".join(entry["text"] for entry in transcript_data)
                filtered_data["enSubtitles"] = en_subtitles
        else:
            print(f"Transcript file {transcript_file} not found.")
            filtered_data["enSubtitles"] = None

        # Insert data into Appwrite database
        response = databases.create_document(
            database_id=os.getenv("NEXT_PUBLIC_APPWRITE_DATABASE_ID"),
            collection_id=os.getenv("NEXT_PUBLIC_APPWRITE_WATCHSAVER_COLLECTION_ID"),
            document_id=ID.unique(),
            data=filtered_data,
        )
        print("Document inserted successfully:", response)
    except json.JSONDecodeError:
        print("Failed to decode JSON.")
    except FileNotFoundError as e:
        print(f"File not found: {e}")
    except Exception as e:
        print(f"An error occurred: {e}")
        # Mark document as needing review in case of an error
        if "isSubtitlesProcessed" not in filtered_data:
            filtered_data["isSubtitlesProcessed"] = False
        if "isNeedsReview" not in filtered_data:
            filtered_data["isNeedsReview"] = True
        # Save the updated data with error status back to the file for review
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(filtered_data, f, indent=4)


if __name__ == "__main__":
    main()
