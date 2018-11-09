# mongo.py

from flask import Flask, render_template
from flask import jsonify
from flask import request
from pymongo import *
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId

application = Flask(__name__, template_folder = 'templates')
client = MongoClient('localhost', 27017)
db = client.TEST_1
collection = db['320IMPORT']

@application.route('/oneRand', methods=['GET'])
def find_one_random():
  cursor = collection.find_one({})  
  page_sanitized = json.loads(json_util.dumps(cursor))
  return jsonify(page_sanitized)

@application.route('/all', methods=['GET'])
def find_all():
  '''
  Fetches all of the 5000+ JSON files from mongo 
  '''
  cursor = collection.find({})
  if cursor.count() > 0:
    output = []
    for s in cursor:
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
  else:
    return "Database is empty", 404
  return jsonify(output)

"""@application.route('/tenants/?', methods=['GET']):
def tenants():
  query_params = request.args.get('tenants')
  return jsonify([])
"""
if __name__ == '__main__':
    application.debug = True
    application.run()
