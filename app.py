import os
import csv
import json
import openai
from openai import OpenAI
from flask import Flask, request, jsonify, render_template
from dotenv import load_dotenv

# Initialize the OpenAI client
load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

app = Flask(__name__)
CSV_FILE = 'office_hours.csv'

# Ensure CSV file exists with header
if not os.path.exists(CSV_FILE):
    with open(CSV_FILE, mode='w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['First Name', 'Last Name', 'Department', 'MonTime', 'MonLocation','TueTime', 'TueLocation',
         'WedTime', 'WedLocation', 'ThuTime', 'ThuLocation', 'FriTime', 'FriLocation','SatTime', 'SatLocation','SunTime', 'SunLocation'])

@app.route('/')
def chatbot_ui():
    return render_template('chatbot.html')

@app.route('/submit_office_hours', methods=['POST'])
def submit_office_hours():
    data = request.json
    row = [data['first_name'], data['last_name'], data['department'], data['montime'], data['monlocation'],data['tuetime'], data['tuelocation'],
           data['wedtime'], data['wedlocation'],data['thutime'], data['thulocation'],data['fritime'], data['frilocation'], 
           data['sattime'], data['satlocation'], data['suntime'], data['sunlocation']]
    with open(CSV_FILE, mode='a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(row)
    return jsonify({'message': 'Office hours submitted successfully!'})

@app.route('/search_office_hours', methods=['POST'])
def search_office_hours():
    data = request.json
    last_name = data['last_name'].strip().lower()
    results = []
    with open(CSV_FILE, mode='r') as f:
        #reader = csv.reader(f)
        reader = csv.DictReader(f)
        for row in reader:
            if row['Last Name'].strip().lower().startswith(last_name):
                results.append(row)
    return jsonify({'results': results})

@app.route('/delete_office_hours', methods=['POST'])
def delete_office_hours():
    data = request.json
    last_name = data['last_name'].strip().lower()
    results = []
    rows = []
    deleted = False
    with open(CSV_FILE, mode='r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row['Last Name'].strip().lower().startswith(last_name):
                deleted = True
                results.append(row)
                continue  # Skip this row (delete)
            rows.append([row['First Name'], row['Last Name'], row['Department'], row['MonTime'], row['MonLocation'],row['TueTime'], row['TueLocation'],
           row['WedTime'], row['WedLocation'],row['ThuTime'], row['ThuLocation'],row['FriTime'], row['FriLocation'], 
           row['SatTime'], row['SatLocation'], row['SunTime'], row['SunLocation']])
    if deleted:
        with open(CSV_FILE, mode='w', newline='') as file:
            writer = csv.writer(file)
            writer.writerow(row) # write the header (all column names) at the beginning
            writer.writerows(rows)
    return jsonify({'results': results})

client = OpenAI()


if __name__ == '__main__':
    app.run(debug=True)
