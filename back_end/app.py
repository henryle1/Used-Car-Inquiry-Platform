from flask import Flask, request, redirect, url_for
from flask_mysqldb import MySQL
from flask import jsonify
from flask_cors import CORS
import yaml

app = Flask(__name__)
CORS(app)

# Configure db
db = yaml.load(open('app.yaml'), Loader=yaml.FullLoader)
app.config['MYSQL_HOST'] = db['mysql_host']
app.config['MYSQL_USER'] = db['mysql_user']
app.config['MYSQL_PASSWORD'] = db['mysql_password']
app.config['MYSQL_DB'] = db['mysql_db']
mysql = MySQL(app)


# api routes
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({"message": "Please provide both username and password"}), 400
        
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT UserID, password FROM Users WHERE userName = %s", (username,))
        result = cursor.fetchone()
        cursor.close()
        
        print(f"Query result: {result}")
        
        if result and result[1] == password:
            return jsonify({"message": "Login successful", "user_id": result[0]}), 200
        else:
            return jsonify({"message": "Incorrect username or password"}), 401
    except Exception as e:
        print(f"Error during login: {str(e)}")
        return jsonify({"message": "An error occurred during login"}), 500

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    state_id = data.get('state_id')
    gender = data.get('gender')

    if not username or not password or not state_id or not gender:
        return jsonify({"message": "Please provide all required information: username, password, state ID, and gender"}), 400

    try:
        cursor = mysql.connection.cursor()
        cursor.execute("START TRANSACTION;")

        # 检查用户名是否已经存在
        cursor.execute("SELECT * FROM Users WHERE userName = %s", (username,))
        if cursor.fetchone():
            cursor.execute("ROLLBACK;")
            return jsonify({"message": "Username already exists"}), 409

        cursor.execute("INSERT INTO Users(userName, stateID, gender, password) VALUES(%s, %s, %s, %s)", (username, state_id, gender, password))
        cursor.execute("COMMIT;")
        return jsonify({"message": "User registered successfully. Please log in."}), 201

    except Exception as e:
        cursor.execute("ROLLBACK;")
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()

@app.route('/profile', methods=['GET'])
def get_profile():
    username = request.args.get('username')
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT Users.userName, Users.gender, Users.stateID, StateTax.State, StateTax.TaxRate FROM Users JOIN StateTax ON Users.stateID = StateTax.StateID WHERE Users.userName = %s", (username,))
    result = cursor.fetchone()
    cursor.close()
    if result:
        profile = {
            "username": result[0],
            "gender": result[1],
            "stateID": result[2],
            "state": result[3],
            "taxRate": result[4]
        }
        return jsonify(profile)
    else:
        return jsonify({"message": "User not found"}), 404


@app.route('/edit-profile', methods=['PUT'])
def edit_profile():
# Trigger
#     DELIMITER //

# CREATE TRIGGER AfterUserUpdate
# AFTER UPDATE ON Users
# FOR EACH ROW
# BEGIN
#     INSERT INTO AuditLog (userID, action, logTime, details)
#     VALUES (NEW.userID, 'Profile Updated', NOW(), CONCAT('Old username: ', OLD.userName, ', New username: ', NEW.userName));
# END;

# //
# DELIMITER ;

    data = request.get_json()
    current_username = data.get('current_username')
    new_username = data.get('username')
    gender = data.get('gender')
    state_id = data.get('stateID')
    password = data.get('password')
    
    if not current_username:
        return jsonify({"message": "Missing required field: current_username"}), 400
    
    update_fields = []
    update_values = []
    
    if new_username:
        update_fields.append("userName = %s")
        update_values.append(new_username)
    
    if gender:
        update_fields.append("gender = %s")
        update_values.append(gender)
    
    if state_id:
        update_fields.append("stateID = %s")
        update_values.append(state_id)
    
    if password:
        update_fields.append("password = %s")
        update_values.append(password)
    
    if not update_fields:
        return jsonify({"message": "No fields to update"}), 400
    
    update_query = "UPDATE Users SET " + ", ".join(update_fields) + " WHERE userName = %s"
    update_values.append(current_username)
    
    cursor = mysql.connection.cursor()
    try:
        cursor.execute(update_query, tuple(update_values))
        mysql.connection.commit()
    except Exception as e:
        return jsonify({"message": "Error updating profile", "error": str(e)}), 500
    finally:
        cursor.close()
    
    return jsonify({"message": "Profile updated successfully"})

@app.route('/states', methods=['GET'])
def get_states():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT StateID, State FROM StateTax")
    results = cursor.fetchall()
    cursor.close()
    states = [{"StateID": result[0], "State": result[1]} for result in results]
    return jsonify(states)

# @app.route('/search-cars', methods=['GET'])
# def search_cars():
#     name = request.args.get('name')
#     query = "SELECT * FROM Cars WHERE CarName = %s"
#     params = [name]
    
#     cursor = mysql.connection.cursor()
#     cursor.execute(query, tuple(params))
#     results = cursor.fetchall()
#     cursor.close()
    
#     return jsonify(results)


@app.route('/search-cars', methods=['GET'])
def search_cars():
    name = request.args.get('name')
    query = "SELECT * FROM Cars WHERE CarName LIKE %s"
    params = [f"%{name}%"]

    cursor = mysql.connection.cursor()
    cursor.execute(query, tuple(params))
    results = cursor.fetchall()
    cursor.close()

    return jsonify(results)

@app.route('/get-favorites', methods=['GET'])
def get_favorites():
    username = request.args.get('username')
    
    cursor = mysql.connection.cursor()
    query = """
    SELECT Cars.* FROM FavoriteList
    JOIN Users ON FavoriteList.UserID = Users.UserID
    JOIN Cars ON FavoriteList.CarID = Cars.CarID
    WHERE Users.userName = %s
    """
    cursor.execute(query, [username])
    results = cursor.fetchall()
    cursor.close()
    
    favorites = [
        {
            'CarID': car[0],
            'CarName': car[1],
            'Year': car[2],
            'SellingPrice': car[3],
            'Fuel': car[4],
            'Transmission': car[5]
        }
        for car in results
    ]
    
    return jsonify(favorites)

@app.route('/add-favorite', methods=['POST'])
def add_favorite():

#Stored Procedure
    # DELIMITER //

# CREATE PROCEDURE AddToFavorites(IN p_userId INT, IN p_carId INT)
# BEGIN
#   DECLARE alreadyExists INT;

#   SELECT COUNT(*)
#   INTO alreadyExists
#   FROM FavoriteList
#   WHERE userID = p_userId AND carID = p_carId;

#   IF alreadyExists = 0 THEN
#     INSERT INTO FavoriteList (userID, carID)
#     VALUES (p_userId, p_carId);
#   ELSE
#     SELECT 'Car already in favorites' AS message;
#   END IF;
# END //

# DELIMITER ;
    
    username = request.form.get('username')
    car_id = request.form.get('car_id')

    if not username or not car_id:
        return jsonify({"error": "Missing username or car_id"}), 400

    try:
        cursor = mysql.connection.cursor()

        cursor.execute("SELECT UserID FROM Users WHERE userName = %s", (username,))
        result = cursor.fetchone()

        if not result:
            return jsonify({"error": "User not found"}), 404

        user_id = result[0]

        cursor.callproc('AddToFavorites', [user_id, car_id])
        results = cursor.fetchall()
        print(f"Stored procedure results: {results}")  
        while cursor.nextset():
            results = cursor.fetchall()
            print(f"Next set results: {results}")  
        mysql.connection.commit()
        message = 'Favorite added successfully'
    except Exception as e:
        mysql.connection.rollback()
        error_message = f"An error occurred: {str(e)}"
        print(error_message)  
        return jsonify({"error": error_message}), 500
    finally:
        cursor.close()

    return jsonify({"message": message})

@app.route('/delete-favorite', methods=['DELETE'])
def delete_favorite():
    username = request.form['username']
    car_id = request.form['car_id']

    cursor = mysql.connection.cursor()
    cursor.execute("""
        DELETE FROM FavoriteList
        WHERE userID = (SELECT UserID FROM Users WHERE userName = %s)
        AND carID = %s
    """, (username, car_id))
    mysql.connection.commit()
    cursor.close()
    return jsonify({"message": "Favorite deleted"})

@app.route('/ranked_cars')
def ranked_cars():
    cursor = mysql.connection.cursor()
    cursor.execute("""
        SELECT c.CarID, c.CarName, SUM(cr.Jan + cr.Feb + cr.Mar + cr.Apr + cr.May + cr.Jun + cr.Jul + cr.Aug + cr.Sep + cr.Oct + cr.Nov + cr.Dece) as TotalSales
        FROM Cars c
        LEFT JOIN CarRank cr ON c.CarID = cr.CarID
        GROUP BY c.CarID, c.CarName
        ORDER BY TotalSales DESC
    """)
    cars = cursor.fetchall()
    return {'ranked_cars': cars}

@app.route('/calculate-tax', methods=['POST'])
def calculate_tax():
    state_id = request.form['state_id']
    price = float(request.form['price'])

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT taxRate FROM StateTax WHERE stateID = %s", (state_id,))
    result = cursor.fetchone()
    cursor.close()

    if result:
        tax_rate = result[0]
        tax = price * tax_rate
        total_price = price + tax
        return jsonify({"tax": tax, "total_price": total_price})
    else:
        return jsonify({"message": "Invalid state ID"}), 400
    
# ---------------------------------------------------------------------------
@app.route('/popular-cars-by-state', methods=['GET'])
def get_popular_cars_by_state():
    username = request.args.get('username')
    password = request.args.get('password')

    cursor = mysql.connection.cursor()
    
    cursor.execute("SELECT * FROM Users WHERE userName = %s AND password = %s", (username, password))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Invalid username or password"}), 401
    
    state_id = user[2] 

    query = """
        SELECT StateTax.State, Cars.CarName, COUNT(FavoriteList.CarID) AS PopularityScore
        FROM FavoriteList
        JOIN Users ON FavoriteList.UserID = Users.userID
        JOIN StateTax ON Users.stateID = StateTax.StateID
        JOIN Cars ON FavoriteList.CarID = Cars.CarID
        WHERE Cars.Year > 2010 AND StateTax.StateID = %s
        GROUP BY StateTax.State, Cars.CarName
        ORDER BY StateTax.State, PopularityScore DESC
        LIMIT 16;
    """

    cursor.execute(query, (state_id,))
    results = cursor.fetchall()
    cursor.close()

    popular_cars = []
    for result in results:
        popular_cars.append({
            "state": result[0],
            "carName": result[1],
            "popularityScore": result[2]
        })

    return jsonify(popular_cars)

# ---------------------------------------------------------------------------

@app.route('/')
def home():
    return "Welcome to the Home Page!"

if __name__ == '__main__':
    app.run(debug=True)