import json
import os
import sys
import requests
import time
from tqdm import tqdm
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi, TranscriptsDisabled, NoTranscriptFound

def get_video_id(youtube_url):
    """Extract video ID from a YouTube URL."""
    if "v=" in youtube_url:
        return youtube_url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in youtube_url:
        return youtube_url.split("youtu.be/")[1].split("?")[0]
    else:
        return None

def fetch_video_details(youtube_url):
    """Fetch video details using yt_dlp with a progress bar."""
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
        print("Fetching video details...")
        with tqdm(total=100, desc="Fetching Details") as pbar:
            for _ in range(10):  # Simulated progress for this step
                pbar.update(10)
                time.sleep(0.1)

            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                info = ydl.extract_info(youtube_url, download=False)
                title = info.get('title', 'Unknown')
                uploader = info.get('uploader', 'Unknown')
                view_count = info.get('view_count', 0)
                duration = info.get('duration', 0)  # in seconds

                # Convert duration to HH:MM:SS format
                hours = duration // 3600
                minutes = (duration % 3600) // 60
                seconds = duration % 60
                playtime = f"{hours}:{minutes:02d}:{seconds:02d}"

                return {
                    'title': title,
                    'creator': uploader,
                    'views': view_count,
                    'playtime': playtime,
                }
    except yt_dlp.utils.DownloadError as e:
        print(f"Error fetching video details: {e}")
    except Exception as e:
        print(f"An unexpected error occurred while fetching video details: {e}")
    return None

def fetch_transcript(video_id, language="en"):
    """Fetch the transcript for a given YouTube video ID."""
    try:
        print("Fetching transcript...")
        transcript = YouTubeTranscriptApi.get_transcript(video_id, languages=[language])
        return transcript
    except TranscriptsDisabled:
        print("Transcripts are disabled for this video.")
        raise
    except NoTranscriptFound:
        print("No transcript found for this video.")
        raise
    except Exception as e:
        print(f"An error occurred while fetching the transcript: {e}")
        raise

def save_transcript_to_json(transcript, output_file):
    """Save transcript data to a JSON file."""
    try:
        with open(output_file, "w", encoding="utf-8") as file:
            json.dump(transcript, file, indent=2, ensure_ascii=False)
        print(f"Transcript saved to {output_file}.")
    except Exception as e:
        print(f"An error occurred while saving the transcript: {e}")
        raise
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


def main():
    if len(sys.argv) < 2:
        print("Usage: python get_transcript.py <YouTube_URL>")
        sys.exit(1)

    youtube_url = sys.argv[1]
    models = ["llama3-gradient:8b", "openhermes", "llama3.2"]

    video_id = get_video_id(youtube_url)

    if not video_id:
        print("Invalid YouTube URL.")
        sys.exit(1)

    video_details = fetch_video_details(youtube_url)

    transcript_file = f"{video_id}_transcript.json"
    summary_file = f"{video_id}_summary.json"

    try:
        if os.path.exists(transcript_file):
            print(f"Transcript file {transcript_file} exists. Running summary generation.")
            with open(transcript_file, "r", encoding="utf-8") as file:
                transcript_data = json.load(file)
                transcript_text = " ".join([entry["text"] for entry in transcript_data])
        else:
            transcript = fetch_transcript(video_id)
            save_transcript_to_json(transcript, transcript_file)
            transcript_text = " ".join([entry["text"] for entry in transcript])

        structured_summary = generate_summary_with_fallback(transcript_text, summary_file, models)

        if video_details:
            structured_summary.update({
                "id": video_id,
                "sourceUrl": f"https://youtu.be/{video_id}",
                "isSubtitlesProcessed": True,
                "isNeedsReview": False,
                "totalTimeMinutes": (int(video_details["playtime"].split(":")[0]) * 60) +
                                    int(video_details["playtime"].split(":")[1]),
                **video_details
            })

        with open(summary_file, "w", encoding="utf-8") as file:
            json.dump(structured_summary, file, indent=2, ensure_ascii=False)

        print("\nStructured Summary:\n")
        # print(json.dumps(structured_summary, indent=2, ensure_ascii=False))

        # After summary is generated and saved
        if structured_summary["summary"] != "Unable to generate a satisfactory summary.":
            print("Summary generation successful. Running insert_transcript.py...")
            os.system(f"python insert_transcript.py {summary_file}")
        else:
            print("Summary generation failed. Skipping database insertion.")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    main()
