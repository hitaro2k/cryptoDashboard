from flask import Flask, render_template, request, redirect, session, jsonify, url_for
from sqlalchemy import text

from crypto_api import get_crypto_info
from assets import get_assets_crypto_info
import secrets
from flask_sqlalchemy import SQLAlchemy

secrets.token_hex(16)

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dashboard.db'
db = SQLAlchemy(app)

class Users_data(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(300), nullable=False)
    mail = db.Column(db.String(300), nullable=False)
    password = db.Column(db.Text, nullable=False)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    receipt = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    crypto = db.Column(db.String(50), nullable=False)
    balance = db.Column(db.Integer, nullable=False)
    data = db.Column(db.String(255), nullable=False)

    def __repr__(self):
        return '<Transaction %r>' % self.id


def get_total_transactions(receipt):

    transactions = Transaction.query.filter_by(receipt=receipt).all()
    total_amount = 0

    for transaction in transactions:
        balance = transaction.balance
        if balance is not None:
            balance_rounded = round(balance, 2)

            total_amount = balance_rounded

    return total_amount

def get_wallet_crypto():
    return



def get_crypto(receipt):
    crypto_assets = Transaction.query.filter_by(receipt=receipt).with_entities(Transaction.crypto).distinct().all()
    crypto_assets_list = [crypto[0] for crypto in crypto_assets]
    return crypto_assets_list


def get_transactions_by_user(user_id):
    transactions = Transaction.query.filter_by(receipt=user_id).all()
    negative_sum = sum(transaction.amount for transaction in transactions if transaction.amount < 0)
    positive_sum = sum(transaction.amount for transaction in transactions if transaction.amount > 0)
    return negative_sum, positive_sum


def get_recent_transactions(user_id, limit=5):
    transactions = Transaction.query.filter_by(receipt=user_id).order_by(Transaction.id.desc()).limit(limit).all()
    return transactions


def get_recent_transactions_data(user_id):
    data = Transaction.query.filter_by(receipt=user_id)
    return data.all()


@app.route('/search-transaction', methods=["GET"])
def search_transaction():
    search_string = request.args.get('searchString').upper()
    user_id = session.get('user_id')

    transactions = Transaction.query.filter_by(crypto=search_string).filter_by(receipt=user_id).all()

    filtered_transactions = [
        {'id': t.id, 'receipt': t.receipt, 'amount': t.amount, 'crypto': t.crypto, 'balance': t.balance, 'data': t.data}
        for t in transactions]

    return jsonify(filtered_transactions)


@app.route('/')
def index():
    return render_template("index.html")


@app.before_request
def check_db_connection():
    if request.endpoint in ['login', 'static']:
        return
    try:
        db.session.execute(text('SELECT 1'))
    except Exception as e:
        print(e)
        return redirect(url_for('login'))


@app.route('/update')
def update():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    return render_template('index.html')


@app.route('/logout')
def logout():
    session.clear()
    db.session.close()
    return redirect(url_for('login'))


@app.route('/card')
def card():
    return render_template("card.html")


@app.route("/register-handler", methods=["POST"])
def register_handler():
    mail = request.form['email-reg']
    password = request.form['password-reg']
    repeat_password = request.form['rep_pass-reg']
    username = request.form['name-reg']

    if request.method == "POST" and password == repeat_password:
        existing_user = Users_data.query.filter_by(mail=mail).first()

        if existing_user:
            return render_template('error.html', message="Email уже занят")
        else:
            try:
                users_data = Users_data(name=username, mail=mail, password=password)
                db.session.add(users_data)
                db.session.commit()
                session['user_id'] = users_data.id
                session['user_name'] = users_data.name

                return redirect(url_for('index'))
            except Exception as e:
                return "Something went wrong"

    return redirect("/")


@app.route('/login-handler', methods=['POST'])
def login_handler():
    email = request.form.get('email')
    password = request.form.get('password')

    try:
        user = Users_data.query.filter_by(mail=email).first()

        if user and user.password == password:
            session['user_id'] = user.id
            session['user_name'] = user.name
            return redirect("/auth1/offline")
        else:
            return "Wrong email or password"
    except Exception as e:
        print("An error occurred:", e)
        return redirect(url_for("/login"))


@app.route("/transaction-handler", methods=['POST'])
def transaction_handler():
    try:
        data = request.json.get('data')
        receipt, amount, crypto, balance, dataTransaction = data
        transaction = Transaction(receipt=receipt, amount=amount, crypto=crypto, balance = balance, data = dataTransaction)
        db.session.add(transaction)
        db.session.commit()

        return jsonify({'success': True}), 200
    except Exception as e:
        print("Error processing data:", e)
        return jsonify({'success': False, 'error': str(e)}), 500


@app.route('/auth1')
def auth1():
    return render_template('index.html')


@app.route('/auth1/offline')
def auth1_offline():
    user_id = session.get('user_id')
    user_name = session.get('user_name')

    total_amount = get_total_transactions(user_id)
    crypto_arr = get_crypto(user_id)
    crypto_symbols = crypto_arr
    crypto_info_list = get_crypto_info(crypto_symbols)

    negative_sum, positive_sum = get_transactions_by_user(user_id)

    recent_transactions = get_recent_transactions(user_id)
    data = get_recent_transactions_data(user_id)
    crypto_assets_symbols = \
        ['USDT', 'BTC', 'ETH', 'BNB', 'EOS',
         'XRP', 'APT', 'SOL', 'ADA',
         'LTC', 'DOT', 'BCH', 'DOGE', 'AVAX',
         'LINK', 'MATIC', 'TON', 'ICP', 'DAI', 'SHIB',
         'UNI', 'ETC', 'ATOM', 'LEO', 'INJ', 'XLM',
         'OKB', 'NEAR', 'XMR', 'TIA', 'IMX', 'LDO', 'FIL',
         'HBAR', 'ARB', 'STX', 'CRO', 'MNT', 'MKR', 'SEI',
         'SUI', 'RUNE', 'GRT', 'TUSDT', 'AAVE', 'ALGO', 'ORDI',
         'FLOW', 'MINA', 'HNT', 'SAND', 'AXS', 'SNX', 'CHZ',
         'FTT', 'MANA', 'BTT', 'BLUR', 'NEO', 'IOTA', 'KLAY',
         'GALA', 'CAKE'
         ]
    crypto_assets_info_list = get_assets_crypto_info(crypto_assets_symbols)

    if crypto_info_list is not None:
        if user_id and user_name:
            return render_template('index.html', crypto_info_list=crypto_info_list,
                                   crypto_assets_info_list=crypto_assets_info_list,
                                   name=user_name,
                                   user_id=user_id,
                                   total_amount=total_amount,
                                   negative_sum=negative_sum,
                                   positive_sum=positive_sum,
                                   recent_transactions=recent_transactions,
                                   data=data
                                   )
        else:
            return render_template('index.html', crypto_info_list=crypto_info_list,
                                   crypto_assets_info_list=crypto_assets_info_list)
    else:
        return render_template('index.html')


@app.route('/auth1/wallet')
def authWallet():
    return render_template('index.html')




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
    with app.app_context():
        db.create_all()
    app.run(debug=True)
