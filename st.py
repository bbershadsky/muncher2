import scrapetube
import sys

path = '_list.txt'
sys.stdout = open(path, 'w')

videos = scrapetube.get_channel("UCTPSb6BE8Qxltodm96M5lew")

for video in videos:
    print("https://www.youtube.com/watch?v="+str(video['videoId']))
    print(video['videoId'])
