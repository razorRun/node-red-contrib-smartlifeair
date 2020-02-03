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


lmt = ""
cmd1 = "npm install /vagrant_data/smartlife-air-node-red/"
cmd2 = "sudo systemctl restart nodered.service"
path = "/vagrant_data/smartlife-air-node-red/*"
while True:
    nmt = get_last_modefied_time(path)
    if nmt != lmt:
        print("Change Detected")
        subprocess.Popen(cmd1.split(), cwd='/home/vagrant/.node-red')
        subprocess.Popen(cmd2.split())
        lmt = nmt
    time.sleep(2)
