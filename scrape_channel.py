from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.keys import Keys
import time
import json
import os
from appwrite.client import Client
from webdriver_manager.chrome import ChromeDriverManager
from appwrite.services.databases import Databases
from appwrite.id import ID
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Appwrite client
client = Client()
databases = Databases(client)
client.set_endpoint(os.getenv("NEXT_PUBLIC_APPWRITE_ENDPOINT"))  # Your Appwrite Endpoint
client.set_project(os.getenv("NEXT_PUBLIC_APPWRITE_PROJECT_ID"))  # Your project ID
client.set_key(os.getenv("APPWRITE_API_KEY"))  # Your API key with permissions


def fetch_videos_with_selenium_debug(channel_url):
    """Fetch video URLs and titles using Selenium with extended debugging."""
    print(f"Fetching videos from channel: {channel_url}...")

    # Setup Selenium with ChromeDriverManager
    chrome_options = Options()
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--user-data-dir=/Users/bopr/Library/Application Support/Google/Chrome")  # Replace with your actual path
    # chrome_options.add_argument("--disable-gpu")
    # chrome_options.add_argument("--no-sandbox")
    # chrome_options.add_argument("--disable-dev-shm-usage")

    # Comment out the headless mode for debugging
    # chrome_options.add_argument("--headless")

    driver = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()), options=chrome_options
    )

    try:
        # Load the YouTube channel's videos page
        driver.get(channel_url)
        print("Page loaded. Waiting for content to load...")
        time.sleep(10)  # Wait for the page to fully load

        # Save the initial page source for inspection
        with open("initial_page_source.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)

        # Scroll to the bottom multiple times to load more videos
        print("Scrolling to load videos...")
        for _ in range(10):  # Increase the range for extended scrolling
            driver.find_element(By.TAG_NAME, "body").send_keys(Keys.END)
            time.sleep(3)  # Wait for additional content to load

        # Save the page source after scrolling for inspection
        with open("scrolled_page_source.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)

        print("Searching for video elements...")
        # Locate video elements
        video_elements = driver.find_elements(By.XPATH, '//a[@id="video-title"]')
        videos = []

        print(f"Found {len(video_elements)} potential video elements.")
        for element in video_elements:
            video_url = element.get_attribute("href")
            video_title = element.get_attribute("title")
            print(f"Video URL: {video_url}, Title: {video_title}")
            if video_url and "/watch" in video_url:
                videos.append({"url": video_url, "title": video_title})

        return videos

    except Exception as e:
        print(f"Error fetching videos with Selenium: {e}")
        return []

    finally:
        driver.quit()



def save_videos_to_appwrite(video_list):
    """Save the video list into the Appwrite database."""
    try:
        for video in video_list:
            data = {
                "sourceUrl": video["url"],
                "title": video["title"],
                "isSubtitlesProcessed": False,
                "isNeedsReview": False,
            }

            databases.create_document(
                database_id=os.getenv("NEXT_PUBLIC_APPWRITE_DATABASE_ID"),
                collection_id=os.getenv("NEXT_PUBLIC_APPWRITE_WATCHSAVER_COLLECTION_ID"),
                document_id=ID.unique(),
                data=data,
            )
            print(f"Saved video: {video['title']}")
    except Exception as e:
        print(f"Error saving videos to Appwrite: {e}")


def main():
    channel_url = "https://www.youtube.com/@WaqarAsim./videos"
    video_list = fetch_videos_with_selenium_debug(channel_url)

    if video_list:
        save_videos_to_appwrite(video_list)
    else:
        print("No videos fetched.")


if __name__ == "__main__":
    main()
