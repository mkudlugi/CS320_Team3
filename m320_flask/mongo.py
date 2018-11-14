# mongo.py

from flask import Flask, render_template
from flask import jsonify
from flask import request
from pymongo import *
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId

application = Flask(__name__, template_folder = 'templates')
client = MongoClient('ec2-18-212-37-169.compute-1.amazonaws.com', 27017)
db = client.handler
collection = db['handler_json']

@application.route('/', methods=['GET'])
def find():
  return jsonify("Server up!")

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
  cursor = collection.find({}).limit(10)
  if cursor.count() > 0:
    output = []
    for s in cursor:
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
  else:
    return "Database is empty", 404
  return jsonify(output)

@application.route('/tenants', methods=['GET'])
def tenants():
  query_params = request.args.get('tenants')
  cursor = collection.find({'authorized.tenants':{'$elemMatch':{'$regex': query_params}}})
  if cursor.count() > 0:
    output = []
    for s in cursor:
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
  else:
    return "Error! No tenant was found!", 404
  return jsonify(output)

if __name__ == '__main__':
    application.debug = True
    application.run()
