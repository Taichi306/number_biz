from flask import Flask, render_template, request, redirect, session, url_for
from datetime import timedelta
from flask_socketio import SocketIO, join_room, leave_room, emit
import mysql.connector

app = Flask(__name__)

# セッション設定
app.secret_key = 'secret!'
app.config['SECRET_KEY'] = 'secret!'
app.config['SESSION_TYPE'] = 'secret!'

# SocketIO設定
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route('/', methods=['GET', 'POST'])
def main():
    if request.method == 'POST':
        room = request.form['room']
        session['room'] = room
        # # ----------------------------------------------------------------------
        # session.permanent = True
        # session.modified = True
        # app.permanent_session_lifetime = timedelta(minutes=5)
        # # ----------------------------------------------------------------------
        return render_template('socket.html', session=session)
    else:
        return render_template('main.html')


@app.route('/socket', methods=['GET', 'POST'])
def test():
    if (session['room'] is not None):
        return render_template('socket.html', session=session)
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
    emit('message', {'msg': message['msg']}, room=room)


@app.route("/game")
def game():
    return render_template('source.html')


if __name__ == '__main__':
    socketio.run(app, debug=True)