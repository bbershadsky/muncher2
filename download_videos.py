import os
from yt_dlp import YoutubeDL

def download_videos(file_path, output_folder):
    # Ensure output folder exists
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Read video URLs from the file
    with open(file_path, 'r') as file:
        lines = file.readlines()

    video_urls = [line.strip() for line in lines if line.startswith("https://www.youtube.com/watch?v=")]

    # yt-dlp options for downloading video with audio
    ydl_opts = {
        'outtmpl': os.path.join(output_folder, '%(title)s.%(ext)s'),  # Save videos with title as filename
        'format': 'bestvideo+bestaudio/best',  # Best video and audio format
        'merge_output_format': 'mp4',  # Merge video and audio as mp4
    }

    # Download each video
    with YoutubeDL(ydl_opts) as ydl:
        for url in video_urls:
            print(f"Downloading {url}...")
            try:
                ydl.download([url])
            except Exception as e:
                print(f"Error downloading {url}: {e}")

if __name__ == "__main__":
    input_file = '_list.txt'  # Path to the file containing video URLs
    output_dir = './output'   # Directory to save downloaded videos
    download_videos(input_file, output_dir)
