import json
import os
import time
import requests
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.id import ID
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound
from tqdm import tqdm
import yt_dlp
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Appwrite client
client = Client()
databases = Databases(client)
client.set_endpoint(os.getenv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))  # Your Appwrite Endpoint
client.set_project(os.getenv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))  # Your project ID
client.set_key(os.getenv("APPWRITE_API_KEY"))  # Your API key with permissions


from appwrite.query import Query

def fetch_unprocessed_records():
    """Fetch records with isSubtitlesProcessed set to false."""
    try:
        response = databases.list_documents(
            database_id=os.getenv("NEXT_PUBLIC_APPWRITE_DATABASE_ID"),
            collection_id=os.getenv("NEXT_PUBLIC_APPWRITE_WATCHSAVER_COLLECTION_ID"),
            queries=[
                Query.equal("isSubtitlesProcessed", [False]),  # Use Query helper for booleans
                # Query.isNotNull("sourceUrl")  # Ensure sourceUrl is not null
            ]
        )
        return response.get("documents", [])
    except Exception as e:
        print(f"Error fetching unprocessed records: {e}")
        return []




def update_record(record_id, data):
    """Update a record in the database."""
    try:
        databases.update_document(
            database_id=os.getenv("NEXT_PUBLIC_APPWRITE_DATABASE_ID"),
            collection_id=os.getenv("NEXT_PUBLIC_APPWRITE_WATCHSAVER_COLLECTION_ID"),
            document_id=record_id,
            data=data,
        )
        print(f"Record {record_id} updated successfully.")
    except Exception as e:
        print(f"Error updating record {record_id}: {e}")


def get_video_id(youtube_url):
    """Extract video ID from a YouTube URL."""
    if "v=" in youtube_url:
        return youtube_url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in youtube_url:
        return youtube_url.split("youtu.be/")[1].split("?")[0]
    else:
        return None


def fetch_transcript(video_id, language="en"):
    """Fetch the transcript for a given YouTube video ID."""
    try:
        print(f"Fetching transcript for video ID: {video_id}...")
        return YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
    except (TranscriptsDisabled, NoTranscriptFound) as e:
        print(f"Transcript error for video ID {video_id}: {e}")
        raise
    except Exception as e:
        print(f"Error fetching transcript: {e}")
        raise


def fetch_video_details(youtube_url):
    """Fetch video details using yt_dlp."""
    ydl_opts = {
        'quiet': True,
        'skip_download': True,
        'forcejson': True,
        'simulate': True,
        'noplaylist': True,
        'extract_flat': 'in_playlist',
        'no_warnings': True,
    }
    try:
        print(f"Fetching video details for URL: {youtube_url}...")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(youtube_url, download=False)
            title = info.get('title', 'Unknown')
            uploader = info.get('uploader', 'Unknown')
            view_count = info.get('view_count', 0)
            duration = info.get('duration', 0)  # in seconds
            playtime = f"{duration // 3600}:{(duration % 3600) // 60:02d}:{duration % 60:02d}"

            return {
                'title': title,
                'creator': uploader,
                'views': view_count,
                'playtime': playtime,
            }
    except Exception as e:
        print(f"Error fetching video details: {e}")
        return None

def generate_summary_with_fallback(transcript_text, output_file, models):
    """Generate a summary using specified models in priority order and select the best result."""
    all_responses = {}
    best_summary = "Unable to generate a satisfactory summary."
    model_used = None

    for model in models:
        print(f"Generating summary using model: {model}...")
        prompt = (
            "You are an expert tasked with summarizing a YouTube video transcript. "
            "Keep it concise, remove ads or sponsorships, and avoid mentioning the video or author. Don't use prefixes like: Here is a concise summary of the YouTube video transcript\n\n"
            "Based on the transcript provided, create a structured summary in the following format:\n\n"
            "{\n"
            "  \"summary\": \"<A concise summary of the video content>\",\n"
            "  \"key_points\": [\n"
            "    \"<Bullet point summarizing key information>\",\n"
            "    \"...\"\n"
            "  ]\n"
            "}\n\n"
            f"Transcript:\n{transcript_text}\n"
        )

        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False
        }
        api_url = "http://localhost:11434/api/generate"

        try:
            response = requests.post(api_url, json=payload, timeout=60)  # Set timeout (e.g., 60 seconds)
            if response.status_code != 200:
                print(f"Error from API: {response.text}")
                response.raise_for_status()

            raw_response = response.json().get("response", "")
            print(f"Received raw response:\n{raw_response}")

            all_responses[model] = raw_response

            # Check if the summary is valid and meaningful
            if "no other summaries available" not in raw_response.lower() and "unable to" not in raw_response.lower():
                best_summary = raw_response
                model_used = model
                break
        except requests.exceptions.Timeout:
            print(f"Model {model} timed out. Moving to the next model...")
        except requests.exceptions.RequestException as e:
            print(f"Error communicating with the local API for model {model}: {e}")
        except Exception as e:
            print(f"Failed to process the model's response with {model}: {e}")

    # Ensure a structured output
    structured_output = {
        "all_responses": all_responses,
        "summary": best_summary,
        "modelUsed": model_used or "None"
    }

    try:
        with open(output_file, "w", encoding="utf-8") as file:
            json.dump(structured_output, file, indent=2, ensure_ascii=False)
        print(f"Structured summary saved to {output_file}.")
    except Exception as e:
        print(f"Failed to save the structured summary: {e}")

    return structured_output

def process_record(record):
    """Process a single record."""
    source_url = record.get("sourceUrl")
    record_id = record["$id"]
    video_id = get_video_id(source_url)

    if not video_id:
        print(f"Invalid source URL: {source_url}")
        return

    try:
        # Fetch video details
        video_details = fetch_video_details(source_url)

        # Fetch transcript
        transcript = fetch_transcript(video_id)
        transcript_text = " ".join([entry["text"] for entry in transcript])

        # Generate summary
        summary = generate_summary_with_fallback(transcript_text, f"{video_id}_summary.json", ["llama3-gradient:8b", "openhermes", "llama3.2"])

        # Prepare update data
        update_data = {
            "isSubtitlesProcessed": True,
            "title": video_details["title"],
            "creator": video_details["creator"],
            "views": video_details["views"],
            "totalTimeMinutes": (int(video_details["playtime"].split(":")[0]) * 60) +
                                int(video_details["playtime"].split(":")[1]),
            "markdownData": summary["summary"],
            "modelUsed": summary["modelUsed"],
        }

        # Update record
        update_record(record_id, update_data)
    except Exception as e:
        print(f"Error processing record {record_id}: {e}")
        # Mark as needing review
        update_record(record_id, {"isNeedsReview": True})


def main():
    print("Starting real-time processing...")
    while True:
        try:
            unprocessed_records = fetch_unprocessed_records()
            if not unprocessed_records:
                print("No new records found. Retrying in 30 seconds...")
                time.sleep(30)
                continue

            for record in unprocessed_records:
                process_record(record)

        except KeyboardInterrupt:
            print("Script stopped by user.")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            time.sleep(30)  # Avoid rapid retries


if __name__ == "__main__":
    main()
