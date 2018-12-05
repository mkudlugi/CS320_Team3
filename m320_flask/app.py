# mongo.py
'''
Import statements for all libraries, all requirements should be in the requirements.txt.
'''
from flask import Flask, render_template
from flask import jsonify
from flask import request
from pymongo import *
from flask_pymongo import PyMongo
import json
from bson import json_util, ObjectId
from flask_cors import CORS, cross_origin
import re
import datetime
import functools
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Resource, Api, abort

# Following lines define the Flask APP and remote connection to mongoDB
application = Flask(__name__, template_folder = 'templates')
api = Api(application)
client = MongoClient('localhost', 27017)
db = client.handler
collection = db['handler_json'] #This is the collection name
auth = db['auth']# This is the user auth collection

#The two lines below define the CORS headers. Make sure to include the line @cross_origin for new routes
#otherwise you will have CORS issues on all new browsers! THIS IS VERY IMPORTANT!
CORS(application)
application.config['CORS_HEADERS'] = 'Content-Type'

#Default route for a html document, specified by index.html
@application.route('/dashboard')
@cross_origin()
def dashboard():
  return render_template('index.html')

#Default route which just prints a string if everything goes well.
@application.route('/', methods=['GET'])
@cross_origin()
def find():
  return jsonify("Server up!")

#Displays a random document, usually the first one.
#Example http://IPADDRESS/oneRand
@application.route('/oneRand', methods=['GET'])
@cross_origin()
def find_one_random():
  #cursor is the mongodb query
  cursor = collection.find_one({})  
  #page_sanitized makes the return value a valid json. INCLUDE THIS LINE BEFORE YOU RETURN A JSON FILE!
  page_sanitized = json.loads(json_util.dumps(cursor))
  return jsonify(page_sanitized)

#This returns all the documents if no parameters are entered
#Otherwise if nPerPage and pageNumber are included it returns paged documents.
#Example: http://IPADDRESS/all?nPerPage=20&pageNumber=0
#This returns page 0 and each page contains 20 results 
#This function has a hard limit of 50 documents to conserve bandwidth and decrease abuse
@application.route('/all', methods=['GET'])
@cross_origin()
def find_all():
  nPerPage = request.args.get('nPerPage')
  pageNumber = request.args.get('pageNumber')
  if(pageNumber == None): pageNumber = 0
  if(nPerPage != None):
    if int(nPerPage) < 1 : return "nPerPage must be greater than 0!", 400
    output = []
    #This is the query
    for s in collection.find({}).skip(int(pageNumber)*int(nPerPage)).limit(int(nPerPage)):
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
    return jsonify(output)
  #If one of the paramenters are missing the route returns 50 documents
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

#This route allows you to regex search for tenants.
#The search is for all tenants within any document!
#Default is regex search unless mode = 'strict'
#Example for regex search http://IPADDRESS/tenants?tenants='h' 
#The above returns all results with tenants contaning 'h'
#Example for strict search http://IPADDRESS/tenants?tenants='hpe'
#The above ONLY returns results with the tenants "hpe"
@application.route('/tenants', methods=['GET'])
@cross_origin()
def tenants():
  query_params = request.args.get('tenants')
  mode = request.args.get('mode')
  if(mode == None): mode = "strict"
  if(mode != "strict"):
    cursor = collection.find({'authorized.tenants':{'$elemMatch':{'$regex': query_params}}})
    if cursor.count() > 0:
      output = []
      for s in cursor:
        page_sanitized = json.loads(json_util.dumps(s))
        output.append(page_sanitized)
    else:
      return "Error! No tenant was found!", 404
    return jsonify(output)
  else:
    cursor = collection.find({'authorized.tenants':{'$elemMatch':{'$eq': query_params}}})
    if cursor.count() > 0:
      output = []
      for s in cursor:
        page_sanitized = json.loads(json_util.dumps(s))
        output.append(page_sanitized)
    else:
      return "Error! No tenant was found!", 404
    return jsonify(output)

#This is similar to the tenants route
#Example http://IPADDRESS/serial?num=100
#The above returns all documents with serialNumberInserv starting with 100
#Note: This is not like the regex search in tenants, so douments CONTANING 100 will not be included!!!
@application.route('/serial')
@cross_origin()
def serial_search():
  query_params = request.args.get('num')
  if(query_params == None): return "Please enter a valid num!", 400
  cursor = collection.find({'$where': "/^"+query_params+".*/.test(this.serialNumberInserv)"})
  if cursor.count() > 0:
    output = []
    for s in cursor:
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
  else:
    return "Error! No collections were found containing the input serialNumberInserv!", 400
  return jsonify(output)
  return render_template('index.html')

#This route returns documents ordered by date 
#The results are paged just like the /all route
#Example for ascending date: http://IPADDRESS/date?nPerPage=20&pageNumber=0&sort=1
#This returns 20 results from page 0 sorted in ascending order
@application.route('/date')
@cross_origin()
def order_by_date():
  nPerPage = request.args.get('nPerPage')
  pageNumber = request.args.get('pageNumber')
  sortVal = request.args.get('sort')
  if(sortVal == None): return "Sort cannot be None or Invalid, Enter 1 or -1", 400
  if(pageNumber == None): pageNumber = 0
  if(nPerPage != None):
    if int(nPerPage) < 1 : return "nPerPage must be greater than 0!", 400
    output = []
    for s in collection.find({}).sort([('date', int(sortVal))]).skip(int(pageNumber)*int(nPerPage)).limit(int(nPerPage)):
      page_sanitized = json.loads(json_util.dumps(s))
      output.append(page_sanitized)
    return jsonify(output)
  else:
    return "Invalid request, you probably forgot a parameter!", 400

#This is a strict text search of all keys that contain strings within the database
#Example http://IPADDRESS/search?nPerPage=20&pageNumber=0&search=mad
#The above returns all collections with a key containing a string with the word "mad"
#Note: This search is not case sensitive.
#Note 2: However, this is a strict search. Thus the above example will only return
#collections with keys containg the string "mad". It will not return a keys constaining "mad1" or "Madeline"
#It will return collections with keys contaning "Mad Dog" or "Dog Mad"
@application.route('/search')
@cross_origin()
def search():
  query_params = request.args.get('search')
  nPerPage = request.args.get('nPerPage')
  pageNumber = request.args.get('pageNumber')
  if(query_params == None ): return "Invalid search or search field is blank!", 400
  if(nPerPage == None): nPerPage = 50
  if(pageNumber == None): pageNumber = 0 
  output = []
  for s in collection.find({"$text":{"$search": query_params}}).skip(int(pageNumber)*int(nPerPage)).limit(int(nPerPage)):
    page_sanitized = json.loads(json_util.dumps(s))
    output.append(page_sanitized)
  if(len(output) == 0): return "No results found!", 400
  return jsonify(output)
#Login system 
def login_required(method):
    @functools.wraps(method)
    def wrapper(self):
        header = request.headers.get('Authorization')
        _, token = header.split()
        try:
            decoded = jwt.decode(token, app.config['KEY'], algorithms='HS256')
        except jwt.DecodeError:
            abort(400, message='Token is not valid.')
        except jwt.ExpiredSignatureError:
            abort(400, message='Token is expired.')
        email = decoded['email']
        if auth.find({'email': email}).count() == 0:
            abort(400, message='User is not found.')
        user = auth.find_one({'email': email})
        return method(self, user)
    return wrapper

class Register(Resource):
    def post(self):
        email = request.json['email']
        password = request.json['password']
        if not re.match(r'^[A-Za-z0-9\.\+_-]+@[A-Za-z0-9\._-]+\.[a-zA-Z]*$', email):
            abort(400, message='email is not valid.')
        if auth.find({'email': email}).count() != 0:
            if auth.find_one({'email': email})['active'] == True:
                abort(400, message='email is alread used.')
        else:
            auth.insert_one({'email': email, 'password': generate_password_hash(password), 'active': False})
        exp = datetime.datetime.utcnow() + datetime.timedelta(days=app.config['ACTIVATION_EXPIRE_DAYS'])
        encoded = jwt.encode({'email': email, 'exp': exp},
                             app.config['KEY'], algorithm='HS256') 
        return {'email': email}

class Activate(Resource):
    def put(self):
        activation_code = request.json['activation_code']
        try:
            decoded = jwt.decode(activation_code, app.config['KEY'], algorithms='HS256')
        except jwt.DecodeError:
            abort(400, message='Activation code is not valid.')
        except jwt.ExpiredSignatureError:
            abort(400, message='Activation code is expired.')
        email = decoded['email']
        auth.update({'email': email}, {'$set': {'active': True}})
        return {'email': email}

class Login(Resource):
    def get(self):
        email = request.json['email']
        password = request.json['password']
        if auth.find({'email': email}).count() == 0:
            abort(400, message='User is not found.')
        user = auth.find_one({'email': email})
        if not check_password_hash(user['password'], password):
            abort(400, message='Password is incorrect.')
        exp = datetime.datetime.utcnow() + datetime.timedelta(hours=app.config['TOKEN_EXPIRE_HOURS'])
        encoded = jwt.encode({'email': email, 'exp': exp},
                             app.config['KEY'], algorithm='HS256')
        return {'email': email, 'token': encoded.decode('utf-8')}

api.add_resource(Register, '/register')
api.add_resource(Activate, '/activate')
api.add_resource(Login, '/login')

#Disable debug for production release!!!!!!!!
#application.debug = False, otherwise users have access to source code!
if __name__ == '__main__':
    application.debug = True
    application.run()
