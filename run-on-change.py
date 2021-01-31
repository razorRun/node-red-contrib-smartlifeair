# detect file changes from inside vigrant-
import os.path
import time
import subprocess
import glob


def get_last_modefied_time(folderPath):
    files = glob.glob(folderPath)
    date_list = []
    # print(files)
    for file in files:
        date_list.append(os.path.getmtime(file))
    # print(date_list)
    return max(date_list)

path = "/home/pi/node-red-contrib-smartlifeair/*"
lmt = ""
cmd1 = "npm install /home/pi/node-red-contrib-smartlifeair/"
cmd2 = "sudo systemctl restart nodered.service"
cmd1 = "npm uninstall /home/pi/node-red-contrib-smartlifeair/"

while True:
    nmt = get_last_modefied_time(path)
    if nmt != lmt:
        print("Change Detected")
        subprocess.Popen(cmd3.split(), cwd='/root/.node-red')
        subprocess.Popen(cmd1.split(), cwd='/root/.node-red')
        subprocess.Popen(cmd2.split())
        lmt = nmt
    time.sleep(2)
