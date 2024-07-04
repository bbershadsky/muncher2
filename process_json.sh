#!/bin/bash

# Load environment variables from .env file
export $(grep -v '^#' .env | xargs)

start_time=$(date +%s)

# Check if yt-dlp is installed
if ! command -v yt-dlp &>/dev/null; then
    echo "yt-dlp could not be found. Please install yt-dlp first."
    exit 1
fi

# Check if youtube_transcript_api is installed
if ! command -v youtube_transcript_api &>/dev/null; then
    echo "youtube_transcript_api could not be found. Please install youtube_transcript_api first."
    exit 1
fi

# Function to extract and translate subtitles
extract_and_translate_subtitles() {
    local video_id="$1"

    # Skip processing if payload.json already exists
    if [[ -f "${video_id}_payload.json" ]]; then
        echo "Payload file ${video_id}_payload.json already exists. Skipping extraction and translation."
        return
    fi

    # Get available subtitles languages
    languages=$(youtube_transcript_api "$video_id" --list 2>/dev/null)

    if [[ -z "$languages" ]]; then
        echo "No subtitles found for the video."
        exit 1
    fi

    if echo "$languages" | grep -q 'en'; then
        echo "Using English subtitles as a fallback."
        subtitles=$(youtube_transcript_api "$video_id" --languages en)
    elif echo "$languages" | grep -q 'a.en'; then
        echo "Using first auto-generated English subtitles as a fallback."
        subtitles=$(youtube_transcript_api "$video_id" --languages a.en)
    elif echo "$languages" | grep -q 'a.es'; then
        echo "Using first auto-generated Spanish subtitles as a fallback."
        subtitles=$(youtube_transcript_api "$video_id" --languages a.en)
    elif echo "$languages" | grep -q 'zh-Hant'; then
        echo "Chinese (Traditional) subtitles are available for translation."
        subtitles=$(youtube_transcript_api "$video_id" --languages zh-Hant --translate en)
    elif echo "$languages" | grep -q 'zh'; then
        echo "Chinese subtitles are available for translation."
        subtitles=$(youtube_transcript_api "$video_id" --languages zh --translate en)
    else
        echo "No translatable subtitles found."
        exit 1
    fi

    if [[ -z "$subtitles" || "$subtitles" == *"Could not retrieve a transcript for the video"* ]]; then
        echo "Failed to retrieve subtitles. Subtitles may be disabled for this video."
        exit 1
    fi

    echo "Extracting: $subtitles"

    # Save subtitles to a JSON file
    echo "$subtitles" >"${video_id}.json"

    # Use Python to process JSON-like structure and save to a text file
    python3 - <<END
import re

# Load the subtitles from the JSON file
with open("${video_id}.json", "r") as file:
    subtitles = file.read()

# Discard everything before 'text: ' and remove single quotes, brackets, curly braces
cleaned_content = re.sub(r".*?'text':\s*", "", subtitles)
cleaned_content = re.sub(r"[\'\[\]\{\}\’]", "", cleaned_content)

# Remove "duration: number" and "start: number" fields
cleaned_content = re.sub(r"duration:\s*\d+\.\d+,\s*", "", cleaned_content)
cleaned_content = re.sub(r"start:\s*\d+\.\d+,\s*", "", cleaned_content)

# Put the entire output into one line
cleaned_content = re.sub(r"\s+", " ", cleaned_content)

# Write the cleaned content to the output file
with open("${video_id}.txt", "w") as file:
    file.write(cleaned_content.strip())
END

    # Read the text content for prompt_prefix
    prompt_prefix=$(cat "${video_id}.txt")

    # Create JSON payload
    payload=$(jq -n --arg prompt "Analyze the following YouTube transcription text and extract the relevant details. The output should be a JSON object with the keys: ingredients, instructions, title, chefTips, culture, isGlutenFree, isVegan, isLactoseFree, isVegetarian, isKosher, isKeto, isLowCarb, isDairyFree. Add a newline for each ingredient and instruction The JSON should look like this:\n\n{\n  \"ingredients\": \"\",\n  \"instructions\": \"\",\n  \"title\": \"\",\n  \"chefTips\": \"\",\n  \"culture\": \"\",\n  \"isGlutenFree\": false,\n  \"isVegan\": false,\n  \"isLactoseFree\": false,\n  \"isVegetarian\": false,\n  \"isKosher\": false,\n  \"isKeto\": false,\n  \"isLowCarb\": false,\n  \"isDairyFree\": false\n}\n\nTranscription Text:\n\n$prompt_prefix" '{model: "openhermes", prompt: $prompt, stream: false}')
    echo "$payload" >"${video_id}_payload.json"

    echo "Subtitles saved to JSON file: ${video_id}.json"
    echo "Subtitles content saved to text file: ${video_id}.txt"
    echo "Payload saved to ${video_id}_payload.json"
}

# Function to send the payload and save the response
send_payload() {
    local payload_file="$1"
    local output_file="${payload_file%.json}_output.json"

    # Skip processing if payload_output.json already exists
    if [[ -f "$output_file" ]]; then
        echo "Output file $output_file already exists. Skipping payload sending."
        return
    fi

    # Read the payload
    payload=$(cat "$payload_file")

    # Make API request and save the output to the JSON file
    response=$(curl -s -X POST http://localhost:11434/api/generate -d "$payload" | jq -r '.response')

    # Save response to output file
    echo "$response" >"$output_file"

    echo "Processed content saved to $output_file"
}

# Function to validate JSON output
validate_json_output() {
    local output_file="$1"

    if ! jq empty "$output_file" 2>/dev/null; then
        echo "Invalid JSON output in $output_file"
        exit 1
    fi

    echo "Valid JSON output in $output_file"
}

# Function to update the record in Appwrite
update_appwrite_record() {
    local payload_file="$1"
    local data=$(cat "$payload_file")

    python3 insert_single.py "$video_id"_payload_output.json
}

# Extract video ID from the URL
extract_video_id() {
    local url="$1"
    if [[ "$url" == *"watch?v="* ]]; then
        video_id=$(echo "$url" | sed -n 's/.*watch?v=\([^&]*\).*/\1/p')
    elif [[ "$url" == *"youtu.be/"* ]]; then
        video_id=$(echo "$url" | sed -n 's/.*youtu.be\/\([^&]*\).*/\1/p')
    else
        echo "Invalid URL format"
        exit 1
    fi
    echo "Extracted video ID: $video_id"
}

# Function to clean up temporary files
cleanup_temp_files() {
    if [[ "$REMOVE_TEMP_FILES" == "true" ]]; then
        rm -f "${video_id}.json" "${video_id}.txt" "${video_id}_payload.json"
        echo "Temporary files removed."
    fi
}

# Check if URL is provided
if [ -z "$1" ]; then
    echo "No URL provided. Usage: $0 <YouTube URL>"
    exit 1
fi

url="$1"
extract_video_id "$url"
video_id="$video_id"

# Timer for subtitle extraction and translation
start_subtitle_extraction=$(date +%s)
# Extract and translate subtitles, then create and save the payload
extract_and_translate_subtitles "$video_id"
end_subtitle_extraction=$(date +%s)
subtitle_extraction_time=$((end_subtitle_extraction - start_subtitle_extraction))

# Timer for sending the payload
start_payload_send=$(date +%s)
# Send the payload and save the response
send_payload "${video_id}_payload.json"
end_payload_send=$(date +%s)
payload_send_time=$((end_payload_send - start_payload_send))

# Validate the JSON output
validate_json_output "${video_id}_payload_output.json"

# Update the Appwrite record with the new data
update_appwrite_record "${video_id}_payload_output.json"

# Cleanup temporary files if the flag is set
cleanup_temp_files

end_time=$(date +%s)
total_time=$((end_time - start_time))

echo "Subtitle extraction and translation took: $subtitle_extraction_time seconds"
echo "Sending payload and receiving response took: $payload_send_time seconds"
echo "Total script execution time: $total_time seconds"
