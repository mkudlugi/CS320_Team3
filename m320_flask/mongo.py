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

@app.route('/all', methods=['GET'])
def find_all():
  cursor = collection.find_one({})  
  page_sanitized = json.loads(json_util.dumps(cursor))
  return jsonify(page_sanitized)


#app.config['MONGO_DBNAME'] = 'TEST_1'
#app.config['MONGO_URI'] = 'mongodb://localhost:27017/TEST_1'

#mongo = PyMongo(app)

#@app.route('/star', methods=['GET'])
#def get_all_users():
 # star = mongo.db.users.find({})
  #output = []
  #for s in star.find({}):
   # output.append(s)
  #return jsonify({'result' : output})

if __name__ == '__main__':
    app.run()