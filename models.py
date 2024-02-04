import mysql.connector

def create_connection():
    return mysql.connector.connect(host="127.0.0.1", user="root", passwd="Vlad!22!22!UA", database="authsys")

