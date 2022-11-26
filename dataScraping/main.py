import requests
from bs4 import BeautifulSoup
from io import StringIO
import pandas as pd
import random
import csv

def scrapeWikiArticle(id, url):
    response = requests.get(
        url=url,
    )

    soup = BeautifulSoup(response.content, 'html.parser')

    allImgLinks = soup.find(id="bodyContent").find_all("img")
    allContentLinks = soup.find(id="bodyContent").find_all("p")

    text = allContentLinks[1].get_text().replace('\n','')
    img_link = allImgLinks[0]['src']

    return id, text, img_link

def scrapeDriverData(id, url):
    response = requests.get(
        url=url,
    )

    soup = BeautifulSoup(response.content, 'html.parser')

    allImgLinks = soup.find(id="bodyContent").find_all("img")
    allContentLinks = soup.find(id="bodyContent").find_all("p")

    text = allContentLinks[1].get_text().replace('\n','')

    img_link = ""
    for curr_img in allImgLinks:
        curr_img_string = curr_img['src']
        print(curr_img_string)
        if ".svg.png" in curr_img_string:
            print(curr_img_string)
            continue
        else:
            img_link = curr_img_string
            break

    return id, text, img_link

# add scraped driver data to csv
with open('input_csvs/drivers.csv', 'r', encoding="utf8") as csvfileinput:
    csvreader = csv.reader(csvfileinput)
    firstRow = True
    with open('output/driver_descr_img.csv', 'w', encoding="utf8", newline='') as csvfileoutput:
        csvwriter = csv.writer(csvfileoutput)
        csvwriter.writerow(['driverId', 'description', 'img_url'])
        for row in csvreader:
            try:
                driverId, text, img_link = scrapeDriverData(row[0], row[8])
                print("Driver ", driverId, " succesfully scraped")
                csvwriter.writerow([driverId, text, img_link])
            except:
                print("couldn't parse", row)

# add scraped circuit data to csv
with open('input_csvs/circuits.csv', 'r', encoding="utf8") as csvfileinput:
    csvreader = csv.reader(csvfileinput)
    firstRow = True
    with open('output/track_descr_img.csv', 'w', encoding="utf8", newline='') as csvfileoutput:
        csvwriter = csv.writer(csvfileoutput)
        csvwriter.writerow(['trackId', 'description', 'img_url'])
        for row in csvreader:
            try:
                circuitId, text, img_link = scrapeWikiArticle(row[0], row[8])
                print("Track ", circuitId, " succesfully scraped")
                csvwriter.writerow([circuitId, text, img_link])
            except:
                print("couldn't parse", row)