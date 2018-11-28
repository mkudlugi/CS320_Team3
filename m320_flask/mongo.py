# mongo.py

from flask import Flask, render_template
from flask import jsonify
from flask import request
from pymongo import *
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId
from flask_cors import CORS, cross_origin

application = Flask(__name__, template_folder = 'templates')
client = MongoClient('ec2-18-212-37-169.compute-1.amazonaws.com', username='AdminSid', password='scrumbledor', authMechanism='SCRAM-SHA-1')
db = client.handler
collection = db['handler_json']
CORS(application)
application.config['CORS_HEADERS'] = 'Content-Type'

@application.route('/', methods=['GET'])
@cross_origin()
def find():
  return jsonify("Server up!")

@application.route('/oneRand', methods=['GET'])
@cross_origin()
def find_one_random():
  cursor = collection.find_one({})  
  page_sanitized = json.loads(json_util.dumps(cursor))
  return jsonify(page_sanitized)

@application.route('/all', methods=['GET'])
@cross_origin()
def find_all():
  '''
  Fetches all of the 5000+ JSON files from mongo 
  '''
  nPerPage = request.args.get('nPerPage')
  pageNumber = request.args.get('pageNumber')
  if(pageNumber == None): pageNumber = 0
  if(nPerPage != None):
    #pageNumber = request.args.get('pageNumber')
    if int(nPerPage) < 1 : return "nPerPage must be greater than 0!", 400
    output = []
    for s in collection.find({}).skip(int(pageNumber)*int(nPerPage)).limit(int(nPerPage)):
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
    return jsonify(output)
  else:
    cursor = collection.find({}).limit(50)
    if cursor.count() > 0:
      output = []
      for s in cursor:
        page_sanitized = json.loads(json_util.dumps(s))
        output.append(page_sanitized)
    else:
      return "Database is empty", 404
    return jsonify(output)

@application.route('/tenants', methods=['GET'])
@cross_origin()
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
