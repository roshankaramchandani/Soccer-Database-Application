import numpy as np
import pandas as pd
import math
import datetime
import random

df=pd.read_csv("./data/data.csv")

#note : skipped players with no club

# for index, row in df.iterrows():
#     print(row['Name'], row['Age'])

#https://soccersapi.com/dashboard/api-key

stringFields=['name','Nationality','Club','Position','Flag','Club Logo','Loaned From']
goalKeepingFields={'Diving':'GKDiving','Handling':'GKHandling','Goal_kick':'GKKicking','Positioning':'GKPositioning','Reflexes':'GKReflexes'}
defensiveFields={'Defensive_awareness':'Vision','Standing_tackle':'StandingTackle','Sliding_tackle':'SlidingTackle','Strength':'Strength','Speed':'SprintSpeed','Aggression':'Aggression','Interception':'Interceptions'}
offensiveFields={'Crossing':'Crossing','Finishing':'Finishing','Heading_accuracy':'HeadingAccuracy','Volleys':'Volleys','Dribbling':'Dribbling','Short_pass':'ShortPassing','Long_pass':'LongPassing','Free_kick':'FKAccuracy','Penalties':'Penalties','Long_shots':'LongShots','Jump':'Jumping'}

def handleNull(fieldName):
    if fieldName in stringFields:
        return "null"
    else:
        return "null"


def formatname(Name):
    return Name.replace("'","''")

def formatString(fieldName,val):
    if fieldName in stringFields:
        val=formatname(val)
        return f"'{val}'"
    return val


def formatWages(wage):
    if wage == "null":
        return wage

    w=wage.replace("K","")
    w=w.replace("€","")
    return int(w)*1000

def formatRelease(wage):
    if wage == "null":
        return wage
    wage = wage.replace("€", "")
    if 'M' in wage:
        w = wage.replace("M", "")
        return str(float(w) *  1000000)
    elif 'K' in wage:
        w = wage.replace("K", "")
        return str(float(w) * 1000)
    else:
        return str(float(wage))


def formatWeight(weight):
    if weight == "null":
        return weight
    return weight.replace("lbs","")

def convertHeight(h):
    if h == "null" :
        return h
    x=h.split("'")
    return int(x[0])*30.48 + int(x[1])*2.54

def handleDate(date):
    if len(date)<6:
        val= str(date)+"-01-01"
    else:
        val=datetime.datetime.strptime(date, '%d-%b-%y').strftime('%Y-%m-%d')

    return f"'{val}'"


def populateStatsTables(statfields,id,fk,filePointer,row,tableName):
    columns = "ID, Player_ID"
    fields = f"{id},{fk}"
    for k, v in statfields.items():
        if not pd.isna(row[v]):
            columns = columns + "," + k
            fields = fields + "," + str(row[v])

    my_string = f"INSERT INTO {tableName} ({columns}) Values({fields});"
    filePointer.write(my_string)
    filePointer.write("\n")



id=1
clubId=1
playerId=1
grId=1
defId=1
offId=1
contractId=1
clubCountryId=1
# format-> key : country name , value : [id,countryname,flag]
CountryMap=dict()
ClubMap=dict()
PlayerMap=dict()
ClubMap['No Club']=[999,'No Club','']

f= open('./GeneratedScripts/INSERT_COUNTRY.sql', 'w')
c= open('./GeneratedScripts/INSERT_CLUB.sql', 'w',encoding="utf-8")
p= open('./GeneratedScripts/INSERT_PLAYER.sql', 'w',encoding="utf-8")
gk= open('./GeneratedScripts/INSERT_Goalkeeping_rating.sql', 'w',encoding="utf-8")
defskills= open('./GeneratedScripts/INSERT_Defensive_skills_rating.sql', 'w',encoding="utf-8")
offfskills= open('./GeneratedScripts/INSERT_Offensive_skills_rating.sql', 'w',encoding="utf-8")
contracts = open('./GeneratedScripts/INSERT_Contracts.sql', 'w',encoding="utf-8")
cc=open('./GeneratedScripts/INSERT_Club_Country.sql', 'w',encoding="utf-8")
for index, row in df.iterrows():
    if row['Nationality'] not in CountryMap:
        CountryMap[row['Nationality']] = [id,row['Nationality'],row['Flag']]
        my_string = f"INSERT INTO Country Values({id},'{row['Nationality']}','{row['Flag']}');"
        f.write(my_string)
        f.write("\n")
        id=id+1

    if not pd.isna(row['Club']) and row['Club'] not in ClubMap:
        clubName=row['Club'].replace("'","''")
        ClubMap[row['Club']] = [clubId, clubName, row['Club Logo'],]
        my_string = f"INSERT INTO Club Values({clubId},'{clubName}','{row['Club Logo']}');"
        c.write(my_string)
        c.write("\n")
        clubId = clubId + 1

    if not pd.isna(row['Name']):
        playerVals=dict()
        requiredPlayerFields=['Name','Nationality']
        otherFields=['Photo','Wage','Age','Jersey Number','Position','Height','Weight','International Reputation']
        playerSkip=False
        for field in requiredPlayerFields:
            if(pd.isna(row[field])):
                playerSkip=True
            playerVals[field]=row[field]

        if not playerSkip:
            for field in otherFields:
                if pd.isna(row[field]):
                    playerVals[field] = handleNull(field)
                else:
                    playerVals[field] = row[field]

            PlayerMap[row['Name']]=[playerId]
            if row['Club'] not in ClubMap:
                clubName1 =999
            else:
                clubName1=ClubMap[row['Club']][0]
            try :
                my_string=f"INSERT INTO Players Values({playerId},{CountryMap[row['Nationality']][0]}, {clubName1}, '{formatname(row['Name'])}', {formatWages(playerVals['Wage'])}, {playerVals['Age']}, '{playerVals['Photo']}', {playerVals['International Reputation']}, {playerVals['Jersey Number']}, '{playerVals['Position']}', {convertHeight(playerVals['Height'])},{formatWeight(row['Weight'])});"
            except Exception as e:
                print(e)
                print(row['Name'])
            p.write(my_string)
            p.write("\n")
            playerId=playerId+1

            ### begin Contracts Section
            contractFields={'Value':'Value','Loaned_from':'Loaned From','Joined_date':'Joined','End_Date':'Contract Valid Until','Release_clause':'Release Clause'}
            dateFields=['Joined_date','End_Date']

            columns="ID, Player_ID,Club_ID"
            fieldsList=f"{contractId},{playerId-1},{clubName1}"
            for k,v in contractFields.items():
                columns = columns + "," + k
                if pd.isna(row[v]):
                    fieldsList = fieldsList + "," + handleNull(v)
                else:
                    if k in dateFields:
                        print(k)
                        fieldsList = fieldsList + "," + handleDate(row[v])
                    elif v == 'Release Clause':
                        fieldsList = fieldsList + "," + formatRelease(row[v])
                    elif v == 'Value' :
                        fieldsList = fieldsList + "," + formatRelease(row[v])
                    else:
                        fieldsList = fieldsList + "," + formatString(v,row[v])
            print(fieldsList)
            my_string = f"INSERT INTO Contracts ({columns}) Values({fieldsList});"
            contracts.write(my_string)
            contracts.write("\n")
            contractId = contractId + 1


            ### end Contracts Section


            ### begin GoalKeeping Section
            populateStatsTables(goalKeepingFields,grId,playerId-1,gk,row,'Goalkeeping_rating')
            grId = grId + 1
            ### end GoalKeeping Section



            ### begin Defensive_skills_rating Section
            populateStatsTables(defensiveFields, defId, playerId - 1, defskills, row, 'Defensive_skills_rating')
            defId = defId + 1
            ### end Defensive_skills_rating Section

            ### begin Offensive_skills_rating Section
            populateStatsTables(offensiveFields, offId, playerId - 1, offfskills, row, 'Offensive_skills_rating')
            offId = offId + 1
            ### end Offensive_skills_rating Section


        else:
            print("Skipped : " + row['Name'])



for i in range(1,max(clubId,id)):
    countrsadsa=random.randint(1, id-1)
    club=random.randint(1, clubId-1)
    my_string = f"INSERT INTO Club_Country Values({clubCountryId},{countrsadsa},{club});"
    cc.write(my_string)
    cc.write("\n")
    clubCountryId = clubCountryId + 1


my_string = "INSERT INTO Club Values(999,'No Club','',);"
c.write(my_string)


f.close()
c.close()
p.close()
gk.close()
defskills.close()
offfskills.close()
cc.close()

