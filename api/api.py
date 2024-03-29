from flask import Flask, jsonify, request
from flask_cors import CORS
import loginDB as db
import json
import verifyUser as checkLogin

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the UserDB instance
user_db = db.UserDB()

@app.route('/')
def index(): 
    return 'index page'

@app.route('/send-data', methods=['GET', 'POST'])
def send_data(): 
    if request.method == 'GET': 

        # Fetch data from the User table
        data = user_db.fetch_data("SELECT * FROM login")
        return jsonify(data)
    elif request.method == 'POST': 
        # etract the email and password in order to validate 
        data = request.data

        parse_data = json.loads(data)
        
        email = parse_data['email']
        password = parse_data['password'] 

        is_valid = checkLogin.check_existing(email, password)

        return jsonify({'success': is_valid})


@app.route('/register-data', methods=['GET', 'POST'])
def register_data():
    if request.method == 'POST': 

        # extract the data from the request 
        data = request.data 
        parse_data = json.loads(data)
        email = parse_data['email']
        password = parse_data['password']

        # check if the email is already registered in the DB 
        exists = checkLogin.check_existing_register(email, password)

        if(exists): 
            print("This email exists?")
            return jsonify({'exists': exists})
        
        user_db.execute_query("""
        INSERT INTO login_info.login (email, password)
        VALUES (%s, %s)       
        """, (email, password))

        return jsonify({'exists': False})


if __name__ == '__main__':
    app.run(debug=True)
