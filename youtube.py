import requests
import os
from dotenv import load_dotenv

# Load API key from .env
load_dotenv()
YOUTUBE_API_KEY = os.getenv("GOOGLE_CLOUD_API_KEY")

def search_youtube(query, max_results=3):
    """
    Search YouTube for videos related to the query.
    
    Args:
        query (str): The search query (e.g., "how to make lavender tea").
        max_results (int): Maximum number of videos to return (default: 3).
        
    Returns:
        list: A list of dictionaries containing video details (title, URL, thumbnail).
              Returns mock data if the API key is missing or an error occurs.
    """
    if not YOUTUBE_API_KEY:
        print("Warning: YouTube API key not found. Using mock data.")
        # Return mock data if API key is missing
        return [
            {
                "title": f"How to Make {query.title()}",
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "thumbnail": "https://via.placeholder.com/480x360"
            },
            {
                "title": f"Benefits of {query.title()}",
                "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "thumbnail": "https://via.placeholder.com/480x360"
            }
        ]
    
    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": max_results,
            "key": YOUTUBE_API_KEY
        }
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            videos = []
            for item in data.get("items", []):
                video = {
                    "title": item["snippet"]["title"],
                    "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}",
                    "thumbnail": item["snippet"]["thumbnails"]["high"]["url"]
                }
                videos.append(video)
            return videos
        else:
            print(f"YouTube API error: {response.status_code} - {response.text}")
            return []
    except Exception as e:
        print(f"YouTube API error: {e}")
        return []

# Test the function
if __name__ == "__main__":
    # Example search query
    query = "how to make lavender tea"
    videos = search_youtube(query)
    
    if videos:
        print("YouTube Recommendations:")
        for video in videos:
            print(f"Title: {video['title']}")
            print(f"URL: {video['url']}")
            print(f"Thumbnail: {video['thumbnail']}")
            print("---")
    else:
        print("No videos found.")
