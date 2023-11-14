
from psycopg2 import sql

offensiveMap={'Crossing':'Crossing','Finishing':'Finishing','HeadingAccuracy':'Heading_accuracy',
              'Volleys':'Volleys','Dribbling':'Dribbling','ShortPass':'Short_pass','LongPass':'Long_pass','FreeKick':'Free_kick','Penalties':'Penalties',
              'LongShots':'Long_shots','Jump':'Jump'}

defensiveMap={'DefensiveAwareness':'Defensive_awareness','StandingTackle':'Standing_tackle','SlidingTackle':'Sliding_tackle','Strength':'Strength',
              'Speed':'Speed','Aggression':'Aggression','Interception':'Interception'}

goalKeepingMap={'Diving':'Diving','Handling':'Handling','GoalKick':'Goal_kick','Positioning':'Positioning','Reflexes':'Reflexes'}

def getAllPlayersData(conn):
    query="SELECT P.ID,P.NAME,C.NAME,CL.NAME FROM PLAYERS P,COUNTRY C,CLUB CL WHERE P.COUNTRY_ID=C.ID AND P.CLUB_ID=CL.ID;"
    cur=conn.cursor()
    cur.execute(query)
    list_of_players=[]
    for record in cur:
        list_of_players.append({'playerId':record[0],'playerName':record[1],'countryName':record[2],'clubName':record[3]})
    cur.close()
    return list_of_players

def getAllCountriesFromDB(conn):
    query="SELECT C.ID,C.NAME FROM COUNTRY C;"
    cur=conn.cursor()
    cur.execute(query)
    list_of_players=[]
    for record in cur:
        list_of_players.append({'value':record[0],'label':record[1]})
    cur.close()
    return list_of_players

def getAllClubsFromDB(conn):
    query="SELECT C.ID,C.NAME FROM CLUB C;"
    cur=conn.cursor()
    cur.execute(query)
    list_of_players=[]
    for record in cur:
        list_of_players.append({'value':record[0],'label':record[1]})
    cur.close()
    return list_of_players

def createPlayerDetails(conn,playerData,countryId,clubId,playerId):
    cur = conn.cursor()
    query ="INSERT INTO Players Values(%s,%s, %s, %s, 565000, 31, 'https://cdn.sofifa.org/players/4/19/158023.png', 5, 10.0, 'RF', 170.18,159);"
    #print(query)
    cur.execute(query, (playerId,countryId,clubId,playerData["playerName"],))
    conn.commit()
    cur.close()

def updatePlayerDetails(conn,playerData,countryId,clubId):
    cur = conn.cursor()
    query = "UPDATE Players SET Name=%s , Country_ID=%s,Club_ID=%s  WHERE id=%s ;"
    cur.execute(query, (playerData["playerName"],countryId,clubId,playerData["playerId"],))
    conn.commit()
    cur.close()

def updateOffensive(conn,playerData,tableName,map,lastKey):
    cur = conn.cursor()
    query = "UPDATE "+tableName+" SET "
    T1 = []
    for key, value in map.items():
        if key == lastKey:
            query = query + value + "=%s "
        else:
            query = query + value + "=%s,"
        T1.append(playerData[key])
    T1.append(playerData["playerId"])
    query = query + " WHERE Player_ID=%s"
    print(query)
    print(tuple(T1))

    cur.execute(query, tuple(T1))
    conn.commit()
    cur.close()

    return

def createOffensive(conn,playerData,tableName,map,lastKey,playerId):
    cur = conn.cursor()
    query = "INSERT INTO "+tableName
    columns="ID, Player_ID"
    values="%s,%s"
    T1 = [playerId,playerId]
    for key, value in map.items():
        if key == lastKey:
            values =values+ ",%s"
        else:
            values = values + ",%s"
        columns=columns+", "+value
        T1.append(playerData[key])
    query=query + " (" + columns +") Values("+ values +" );"

    print(query)


    cur.execute(query, tuple(T1))
    conn.commit()
    cur.close()

    return

def deleteOffensive(conn,playerId,tableName):
    cur = conn.cursor()
    query = "delete from "+tableName+" where id=%s;"
    cur.execute(query, (playerId,))
    conn.commit()
    cur.close()

def deletePlayerDB(conn,playerId):
   deleteOffensive(conn,playerId,"Offensive_skills_rating")
   deleteOffensive(conn, playerId, "Defensive_skills_rating")
   deleteOffensive(conn, playerId, "Goalkeeping_rating")
   deleteOffensive(conn, playerId, "Players")
   return


def createPlayerDB(conn,playerData,clubId,countryId):
    cur = conn.cursor()
    query = "select MAX(ID) from Players;"
    cur.execute(query)
    for record in cur:
        playerId = record[0]

    playerId=str(int(playerId)+1)
    createPlayerDetails(conn, playerData, countryId, clubId,playerId)
    createOffensive(conn,playerData,"Offensive_skills_rating",offensiveMap,'Jump',playerId)
    createOffensive(conn, playerData, "Defensive_skills_rating", defensiveMap, 'Interception',playerId)
    createOffensive(conn, playerData, "Goalkeeping_rating", goalKeepingMap, 'Reflexes',playerId)
    return


def updatePlayer(conn,playerData,clubId,countryId):
    updateOffensive(conn,playerData,"Offensive_skills_rating",offensiveMap,'Jump')
    updateOffensive(conn, playerData, "Defensive_skills_rating", defensiveMap, 'Interception')
    updateOffensive(conn, playerData, "Goalkeeping_rating", goalKeepingMap, 'Reflexes')
    updatePlayerDetails(conn,playerData,countryId,clubId)
    return

def getPlayerDataById(conn,playerId):
    query="SELECT P.ID,P.NAME,C.NAME,CL.NAME FROM PLAYERS P,COUNTRY C,CLUB CL WHERE P.COUNTRY_ID=C.ID AND P.CLUB_ID=CL.ID AND P.ID=%s"
    cur=conn.cursor()
    cur.execute(query,(playerId,))
    list_of_players=[]
    for record in cur:
        player={'playerId':record[0],'playerName':record[1],'countryName':record[2],'clubName':record[3]}

    query = "SELECT Crossing,Finishing,Heading_accuracy,Volleys,Dribbling,Short_pass,Long_pass,Free_kick,Penalties,Long_shots,Jump FROM Offensive_skills_rating WHERE Player_ID=%s"
    cur.execute(query, (playerId,))
    for record in cur:
        player['Crossing']=record[0]
        player['Finishing'] = record[1]
        player['HeadingAccuracy'] = record[2]
        player['Volleys'] = record[3]
        player['Dribbling'] = record[4]
        player['ShortPass'] = record[5]
        player['LongPass'] = record[6]
        player['FreeKick'] = record[7]
        player['Penalties'] = record[8]
        player['LongShots'] = record[9]
        player['Jump'] = record[10]

    query = "SELECT Defensive_awareness,Standing_tackle,Sliding_tackle,Strength,Speed,Aggression,Interception FROM Defensive_skills_rating WHERE Player_ID=%s"
    cur.execute(query, (playerId,))
    for record in cur:
        player['DefensiveAwareness'] = record[0]
        player['StandingTackle'] = record[1]
        player['SlidingTackle'] = record[2]
        player['Strength'] = record[3]
        player['Speed'] = record[4]
        player['Aggression'] = record[5]
        player['Interception'] = record[6]


    query = "SELECT Diving,Handling,Goal_kick,Positioning,Reflexes FROM Goalkeeping_rating WHERE Player_ID=%s"
    cur.execute(query, (playerId,))
    for record in cur:
        player['Diving'] = record[0]
        player['Handling'] = record[1]
        player['GoalKick'] = record[2]
        player['Positioning'] = record[3]
        player['Reflexes'] = record[4]




    cur.close()
    return player




