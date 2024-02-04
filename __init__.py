import sqlite3

from flask import Flask, render_template, request, redirect, session, jsonify, url_for
from models import create_connection
from crypto_api import get_crypto_info
from assets import get_assets_crypto_info
import secrets
secrets.token_hex(16)

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)


@app.route('/')
def index():
    users_crypto = "BTC"
    crypto_symbols = [users_crypto]
    crypto_info_list = get_crypto_info(crypto_symbols)

    crypto_assets_symbols = \
        ['USDT', 'BTC', 'ETH' , 'BNB', 'EOS',
        'XRP' , 'APT' , 'SOL' , 'ADA' ,
        'LTC' , 'DOT' , 'BCH' , 'DOGE' , 'AVAX' ,
        'LINK' , 'MATIC' , 'TON' , 'ICP', 'DAI', 'SHIB',
        'UNI' , 'ETC' , 'ATOM' , 'LEO' , 'INJ' , 'XLM',
        'OKB', 'NEAR' , 'XMR' , 'TIA' , 'IMX', 'LDO' , 'FIL',
        'HBAR' , 'ARB' , 'STX' , 'CRO' ,'MNT' , 'MKR' , 'SEI',
        'SUI' , 'RUNE' , 'GRT' , 'TUSDT', 'AAVE' , 'ALGO', 'ORDI',
        'FLOW' , 'MINA' , 'HNT', 'SAND' , 'AXS', 'SNX' , 'CHZ',
        'FTT' , 'MANA', 'BTT' , 'BLUR' , 'NEO', 'IOTA', 'KLAY',
        'GALA' , 'CAKE'
        ]
    crypto_assets_info_list = get_assets_crypto_info(crypto_assets_symbols)

    if crypto_info_list is not None:
        return render_template('index.html', crypto_info_list=crypto_info_list,
                               crypto_assets_info_list=crypto_assets_info_list,
                               idusers=session.get('idusers'),
                               name=session.get('name'))
    else:
        return render_template('index.html')

@app.route('/card')
def card():
    return render_template("card.html")

@app.route("/register-handler", methods=["POST"])
def register_handler():
    mail = request.form['email-reg']
    password = request.form['password-reg']
    repeat_password = request.form['rep_pass-reg']
    username = request.form['name-reg']

    if password == repeat_password and request.method == "POST":
        try:
            db = create_connection()
            cursor = db.cursor()

            query_check_email = "SELECT * FROM userss WHERE email = %s"
            cursor.execute(query_check_email, (mail,))
            existing_user = cursor.fetchone()

            if existing_user:
                return "Такая почта уже зарегистрирована"

            query_insert_user = "INSERT INTO userss (email, password, name) VALUES (%s, %s, %s)"
            cursor.execute(query_insert_user, (mail, password, username))
            db.commit()

            new_user_id = cursor.lastrowid

            session['idusers'] = new_user_id
            session['name'] = username

            query_insert_user_data = "INSERT INTO users_data (iduserAcc , crypto, count , balance) VALUES (%s , %s , %s, %s)"
            cursor.execute(query_insert_user_data, (new_user_id, "",0 , 0 ))

            db.commit()

            return redirect("/")
        except Exception as e:
            db.rollback()
            return f"Error: {str(e)}"
        finally:
            cursor.close()
            db.close()

    return "Пароли не совпадают"

@app.route('/login-handler', methods=['POST'])
def login_handler():
    email = request.form.get('email')
    password = request.form.get('password')

    try:
        db = create_connection()
        cursor = db.cursor()

        query_check_user = "SELECT idusers, name FROM userss WHERE email = %s AND password = %s"
        cursor.execute(query_check_user, (email, password))
        user = cursor.fetchone()

        if user:
            session['idusers'] = user[0]
            session['name'] = user[1]
            return redirect(url_for('index'))

        return render_template('login.html', error="Invalid email or password")

    except Exception as e:
        print(e)
        return render_template('login.html', error="An error occurred during login")

    finally:
        cursor.close()
        db.close()


@app.route("/transaction-handler", methods=['POST'])
def transaction_handler():
    try:
        data = request.get_json()

        db = create_connection()
        cursor = db.cursor()


        for transaction in data.get("data", []):
            if isinstance(transaction, list) and len(transaction) == 3:
                receipt, amount, crypto = transaction

                query_insert_user_data = "INSERT INTO transaction (receipt, amount, crypto) VALUES (%s, %s, %s)"

                print("Executing query:", query_insert_user_data, "with values:", receipt, amount, crypto)

                cursor.execute(query_insert_user_data, (receipt, amount, crypto))
            else:
                print("Invalid transaction format:", transaction)

        db.commit()
    except Exception as e:
        print("Error processing data:", e)
        db.rollback()
        return jsonify({'success': False, 'error': str(e)}), 500
    finally:
        db.close()

    return jsonify({'success': True}), 200

@app.route('/login')
def login():
    return render_template("login.html")

@app.route("/register")
def register():
    return render_template("register.html")


@app.route('/dashboard')
def dashboard():
    if 'idusers' in session and 'name' in session:
        return render_template('index.html', idusers=session['idusers'], name=session['name'])
    else:
        return redirect(url_for('login'))


if __name__ == "__main__":
    app.run(debug=True)
