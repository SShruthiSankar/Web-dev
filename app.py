# Store this code in 'app.py' file
 
from flask import Flask, render_template, request, redirect, url_for, session,jsonify,send_from_directory,redirect,url_for,session
from flask_cors import CORS
from flask_mysqldb import MySQL
import MySQLdb.cursors
import re
import secrets
import os
import mysql.connector

 
 
app = Flask(__name__)
CORS(app)
 
 
app.secret_key = 'your secret key'
 
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Maha2000@'
app.config['MYSQL_DB'] = 'geeklogin'
 
mysql = MySQL(app)
 
@app.route('/')
def homepage():
    return render_template('homepage.html')
 
    

@app.route('/login', methods =['GET', 'POST'])
def login():
    msg =''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form:
        username = request.form['username']
        print(username)
        password = request.form['password']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT designation FROM accounts WHERE username = % s AND password = % s', (username, password, ))
        designation = cursor.fetchone()
        cursor.execute('SELECT username FROM accounts WHERE username = % s AND password = % s', (username, password, ))
        user = cursor.fetchone()
        cursor.execute('SELECT password FROM accounts WHERE username = % s AND password = % s', (username, password, ))
        passw = cursor.fetchone()
        if user != username :
            print('111')
            msg = 'Wrong Username'
        if passw != password:
            print('222')
            msg = 'Incorrect Password'
        if designation:    
            if designation['designation'] == 'manager':
                return render_template('manager.html')                
            else:
                return render_template('intern.html')
    return render_template('login.html', msg = msg)
 

 
@app.route('/register', methods =['GET', 'POST'])
def register():
    msg = ''
    if request.method == 'POST' and 'username' in request.form and 'password' in request.form and 'email' in request.form and 'designation' in request.form:
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']
        designation = request.form['designation']
        cursor = mysql.connection.cursor(MySQLdb.cursors.DictCursor)
        cursor.execute('SELECT * FROM accounts WHERE username = % s', (username, ))
        account = cursor.fetchone()
        if account:
            msg = 'Account already exists !'
        elif not re.match(r'[^@]+@[^@]+\.[^@]+', email):
            msg = 'Invalid email address !'
        elif not re.match(r'[A-Za-z0-9]+', username):
            msg = 'Username must contain only characters and numbers !'
        elif not username or not password or not email:
            msg = 'Please fill out the form !'
        else:
            cursor.execute('INSERT INTO accounts VALUES (NULL, % s, % s, % s, % s)', (username, password, email,designation ))
            mysql.connection.commit()
            msg = 'You have successfully registered!'
    elif request.method == 'POST':
        msg = 'Please fill out the form !'
    return render_template('register.html', msg = msg)

@app.route('/forgot', methods=['GET', 'POST'])
def forgot():

    if request.method == 'POST':
        email=  request.form['email']
        return "Password reset request received. Check your email for further instructions."
    return render_template('forgot.html')

@app.route('/manager', methods=['GET', 'POST'])
def manager():
    
    return render_template('manager.html')

@app.route('/intern', methods=['GET', 'POST'])
def intern():
    return render_template('intern.html')

@app.route('/task', methods=['GET', 'POST'])

def Task():

    
    file = None
    if request.method == "POST":
     
        file = request.files.get('file')
        file_1 = request.files.get('file_1')
        
        print(file_1,"normal file")
        print(file, "im image")
        if 'file' in request.files:
            file = request.files['file']
            print('if loop 1')
            if file:
                print('yes file')
            else:
                print('no file')

    if file is not None and file.filename:  # Check if file is not None and has a filename
        upload_folder = 'uploads'
        os.makedirs(upload_folder, exist_ok=True)
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)

        session['file_info'] = {
         'filename': file.filename,
         }
        print(session,"Im session,under task")
    #     # Now, you can save the file_path to the database
        save_to_database(file_path)

    return render_template('Task.html')
def save_to_database(file_path):
    
    import mysql.connector
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Maha2000@",
        database="geeklogin"
    )

    mycursor = mydb.cursor()

    # Insert the file_path into the database
    sql = "INSERT INTO files (file_path) VALUES (%s)"
    val = (file_path,)

    mycursor.execute(sql, val)
    mydb.commit()


@app.route('/image_gallery')
def image_gallery():
    
    import mysql.connector
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Maha2000@",
        database="geeklogin"
    )

    mycursor = mydb.cursor()
   
    query = "SELECT id, file_path FROM files"
    mycursor.execute(query)
    result = mycursor.fetchall()

    image_list = [{"id": row[0], "file_path": row[1].replace("\\", "/")} for row in result]

    # Print the generated URLs for debugging
    for image in image_list:
        print(f"Image ID: {image['id']}, URL: {url_for('static', filename=image['file_path'])}")

    return render_template('image_gallery.html', images=image_list)

def get_file_info_from_database(image_id):
    import mysql.connector
    mydb = mysql.connector.connect(
        host="localhost",
        user="root",
        password="Maha2000@",
        database="geeklogin"
    )

    mycursor = mydb.cursor(dictionary=True)

    # Retrieve the file information from the database based on the image_id
    sql = "SELECT id, file_path FROM files WHERE id = %s"
    val = (image_id,)

    mycursor.execute(sql, val)
    result = mycursor.fetchone()

    return result

@app.route('/task2/<int:image_id>', methods=['GET', 'POST'])
def task2(image_id):
    # Retrieve the file information from the database
    file_info = get_file_info_from_database(image_id)
    print(file_info)

    if file_info and 'file_path' in file_info:
        file_info['file_path'] = file_info['file_path'].replace('\\', '/')

        # Render task2.html and pass the file_info variable
        return render_template('task2.html', file_info=file_info)
    else:
        # Handle the case where no file information is available
        return render_template('task2.html', file_info=None)

# if __name__ == "__main__":
#     app.run(debug=True)
    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
        return send_from_directory('uploads', filename)

@app.route('/task2_preview/<filename>')
def task2_preview(filename):
    return send_from_directory('uploads', filename)


@app.route('/form', methods=['GET', 'POST'])
def form():
    if request.method == 'POST':
        #print('hi')
        image = request.form.get('image')
        numOfSquads = request.form.get('numOfSquads')
        print(image,numOfSquads,"Im data")
    return render_template('form.html')


@app.route('/submit',methods=['GET', 'POST'])
def submit():
    return render_template('submit.html')





if __name__ == '__main__':
    app.run(debug=True, use_reloader=False)
