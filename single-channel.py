import requests
username = "marquesbrownlee"
url = "https://www.youtube.com/user/username/videos"
page = requests.get(url).content
data = str(page).split(' ')
item = 'href="/watch?'
vids = [line.replace('href="', 'youtube.com') for line in data if item in line] # list of all videos listed twice
print(vids[1]) # index the latest video
