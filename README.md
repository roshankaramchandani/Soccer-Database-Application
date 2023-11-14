# Soccer-Database-Application
A web application that shows data on soccer players, a few details, and some graphical analysis of their skills. Based on the data of (FIFA 2021).


Data source: https://www.kaggle.com/datasets/karangadiya/fifa19

Files included:
1. data.csv: csv file of the data source mentioned above.
2. create.sql: will create the relations.
3. load.sql: will dump all the data (load.sql can be created by using the Python script present in the folder "GenerateScript").
4. Folder "UI Source Code": Contains the source code of the website.
5. Folder "GenerateScript" (Do not delete any file or sub folder inside the 'GenerateScript' folder): Contains the script and necessary directory structure to create .sql files.

Steps used to create load.sql:
1. run the main.py file (requires installed python).
2. Individual .sql files for each table will be created in the folder "GeneratedScripts".
3. All the individual generated .sql files were manually copied into a single empty load.sql file.
4. load.sql file is ready and can be used to dump the data.

Steps to test:
1. Create a database.
2. Copy and paste all lines of the included file 'create.sql' into the query tool and run. The relations will be created.
3. Copy and paste all lines of the created file 'load.sql' into the query tool and run. All the data will be dumped.
4. Your database and the data are ready to be tested.

Pre-requisites to run the website:
1. Installed Python, and libraries: Flask, psycopg2.
2. Installed node JS.
3. Replace the Database name, Database user, and Database password in the files "UI Source Code/BackEnd/app.py" and "UI Source Code/BackEnd/main.py" to the fields that are used on the machine on which the website is being tested.

Steps to run the website:
1. Go to the directory "UI Source Code/BackEnd" and run the file "app.py" in the command prompt.
2. Update the mentioned endpoint in "UI Source Code/FrontEnd/my-app/src/constants.js" if different, and minimize this command prompt.
3. Go to the directory "UI Source Code/FrontEnd/my-app" and open a new command prompt.
4. Run the command "npm start".
5. The website will open automatically and ready to use.


Thank You!
