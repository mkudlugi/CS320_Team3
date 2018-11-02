# mongo.py

from flask import Flask, render_template
from flask import jsonify
from flask import request
from pymongo import *
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId

app = Flask(__name__, template_folder = 'templates')
client = MongoClient('localhost', 27017)
db = client.TEST_1
collection = db['320IMPORT']

@app.route('/oneRand', methods=['GET'])
def find_one_random():
  cursor = collection.find_one({})  
  page_sanitized = json.loads(json_util.dumps(cursor))
  return jsonify(page_sanitized)

@app.route('/all', methods=['GET'])
def find_all():
  cursor = collection.find({})
  output = []
  for s in cursor:
    page_sanitized = json.loads(json_util.dumps(s))
    output.append(page_sanitized)
  return jsonify(output)

if __name__ == '__main__':
    app.run()