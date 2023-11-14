import flask
import psycopg2
import json
from flask import Flask, render_template, request, get_template_attribute,session,url_for,redirect
from DBTalker import getAllPlayersData,getPlayerDataById,getAllCountriesFromDB,getAllClubsFromDB,updatePlayer,createPlayerDB,deletePlayerDB
import json
import requests


DB_HOST="127.0.0.1"
DB_NAME="Super League"
DB_USER="postgres"
DB_PASS="1503"

app = Flask(__name__)
global conn

@app.route('/')
def index():
    return render_template("login.html", message="Hello Flask!");

@app.before_first_request
def initializeDBConnection():
    global conn
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASS, host=DB_HOST)
    print("Connection Initialized!!")



@app.route('/getAllPlayers', methods=['GET'])
def getAllTopics():
    app.logger.info('Inside the Broker to getAllTopics event.')
    # message = request.get_json(force=True)
    # app.logger.info(message)
    list_of_players=getAllPlayersData(conn)
    response=flask.jsonify(players=list_of_players)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/getAllCountries', methods=['GET'])
def getAllCountries():
    app.logger.info('Inside the Broker to getAllTopics event.')
    # message = request.get_json(force=True)
    # app.logger.info(message)
    list_of_players=getAllCountriesFromDB(conn)
    response=flask.jsonify(countries=list_of_players)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/getAllClubs', methods=['GET'])
def getAllClubs():
    app.logger.info('Inside the Broker to getAllTopics event.')
    # message = request.get_json(force=True)
    # app.logger.info(message)
    list_of_players=getAllClubsFromDB(conn)
    response=flask.jsonify(clubs=list_of_players)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/getPlayerById', methods=['GET'])
def getPlayerDetailsByID():
    app.logger.info('Inside the Broker to getAllTopics event.')
    message = request.args
    #print(message['playerId'])
    app.logger.info(message)
    list_of_players=getPlayerDataById(conn,message['playerId'])
    response=flask.jsonify(player=list_of_players)
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

@app.route('/updatePlayerDetails',methods = ['POST', 'GET'])
def result():
    #print(request)
    message = request.args

    #print(message)
    data=message['data']
    updatePlayer(conn,json.loads(data),message['clubId'],message['countryId'])
    response = flask.jsonify({"Result":"Success"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


@app.route('/createPlayer',methods = ['POST', 'GET'])
def createPlayer():
    #print(request)
    message = request.args

    #print(message)
    data=message['data']
    createPlayerDB(conn,json.loads(data),message['clubId'],message['countryId'])
    response = flask.jsonify({"Result":"Success"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response



@app.route('/deletePlayer',methods = ['POST', 'GET'])
def deletePlayer():
    #print(request)
    message = request.args
    print(message)
    deletePlayerDB(conn,message['playerId'])
    response = flask.jsonify({"Result":"Success"})
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response

if __name__ == '__main__':
    app.run(debug=True, host='127.1.1.8',port='8000')

