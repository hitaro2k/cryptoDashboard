import mysql.connector

def create_connection():
    return mysql.connector.connect(host="127.0.0.1", user="root", passwd="Vlad!22!22!UA", database="users-data")

def setConnection(iduser, crypto, count):
    try:
        db = create_connection()
        cursor = db.cursor()

        query = "INSERT INTO users-data (id-user, crypto, count) VALUES (%s,%s, %s)"
        cursor.execute(query, (iduser, crypto, count))

    except Exception as e:
        db.rollback()

    finally:
        cursor.close()
        db.close()