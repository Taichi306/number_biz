from flask import Flask, render_template, request, redirect, session, url_for
from datetime import timedelta
from flask_socketio import SocketIO, join_room, leave_room, emit
import mysql.connector
import random

app = Flask(__name__)

# セッション設定
app.secret_key = 'secret!'
app.config['SECRET_KEY'] = 'secret!'
app.config['SESSION_TYPE'] = 'secret!'

# SocketIO設定
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


# データベースを操作する関数
def cdb():
    db = mysql.connector.connect(
        user='root',
        password='password',
        host='db',
        database='app'
    )
    return db


# join_userを取得する関数 返り値はタプル
def get_join_user(session):
    db = cdb()
    db_room = db.cursor(buffered=True)
    db_room.execute("SELECT join_user from Room where session_room = %s",(session,))
    flag_room = db_room.fetchone()
    return flag_room


# join_userに数を足す関数
def add_join_user(session, flag):
    db = cdb()
    session = int(session)
    if flag:
        cursor = db.cursor(buffered=True)
        cursor.execute("INSERT INTO Room (session_room, join_user, answer) values (%s, %s, %s)", (session, 1, 0))
        db.commit()
    else:
        i = get_join_user(session)[0]
        i += 1
        cursor = db.cursor(buffered=True)
        cursor.execute("UPDATE Room SET join_user = %s WHERE session_room = %s", (i, session))
        db.commit()

def show_ans():
    db = cdb()
    show_ans = db.cursor(buffered=True)
    show_ans.execute("SELECT answer FROM Room WHERE session_room = %s", (session['room'],))
    show_ans = show_ans.fetchone()
    return show_ans


@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        room = request.form['room']
        session['room'] = room
        session['user_name'] = 0
        flag_room = get_join_user(room)
        if flag_room == None:
            add_join_user(room, True)
        else:
            add_join_user(room, False)
        return redirect('/wait')
    else:
        return render_template('main.html')


@app.route('/wait', methods=['POST', 'GET'])
def wait():
    # join_userが2になったらsocketに移行させる
    num_join = get_join_user(int(session['room']))[0]
    if num_join == 1:
        session['user_name'] = 1
    if num_join == 2:
        if session['user_name'] == 1:
            pass
        else:
            session['user_name'] = 2
        return redirect('/socket')
    else:
        return render_template('wait.html', num_join=num_join)


@app.route('/socket', methods=['GET', 'POST'])
def test():
    db = cdb()
    if (session['room'] is not None):
        _ans = show_ans()[0]
        if _ans == 0:
            answer = random.randint(1, 101)
            ans_db = db.cursor(buffered=True)
            ans_db.execute("UPDATE Room SET answer = %s WHERE session_room = %s", (answer, session['room'],))
            db.commit()
            ans = show_ans()[0]
        else:
            ans = show_ans()[0]
        return render_template('socket.html', session=session, ans=ans)

    else:
        return redirect(url_for('/'))


@socketio.on('join', namespace='/socket')
def join(message):
    room = session['room']
    join_room(room)
    emit(room=room)


@socketio.on('text', namespace='/socket')
def chat(message):
    room = session['room']
    user = session['user_name']
    emit('message', {'msg': message['msg'], 'user': user}, room=room)


if __name__ == '__main__':
    socketio.run(app, debug=True)