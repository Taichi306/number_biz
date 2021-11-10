from flask import Flask, render_template, request, redirect, session, url_for
from datetime import timedelta
import mysql.connector

app = Flask(__name__)

# セッション設定
app.secret_key = 'aaa'
app.config['SECRET_KEY'] = 'aaa'
app.config['SESSION_TYPE'] = 'filesystem'

@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'GET':
        return render_template('main.html')

    if request.method == 'POST' and 'room_name' in request.form:
        room = request.form['room_name']
        session.permanent = True
        session.modified = True
        app.permanent_session_lifetime = timedelta(minutes=5)
        session['room'] = room
        return render_template('source.html')


@app.route("/game")
def game():
    room = session['room']
    return render_template('source.html', room=room)