var socket;
$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/socket');

    var chat = document.getElementById('chat');
    var text = document.getElementById('text');
    var form = document.getElementById('form');
    let randomNumber = ans;
    const lastResult = document.querySelector('.lastResult');
    const lowOrHi = document.querySelector('.lowOrHi');
    const guessSubmit = document.querySelector('.guessSubmit');
    const guessField = document.querySelector('.guessField');
    let guessCount = 1;
    let resetButton;

    let turn = document.querySelector('.turn');

    socket.on('connect', function(){
        socket.emit('join', {});
    });

    function leave_room() {
        socket.emit('left', {}, function() {
            socket.disconnect();
            window.location.href = "{{ url_for('/') }}";
        });
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (text.value){
            socket.emit('text', {msg: text.value});
            text.value = '';
        }
    });

    socket.on('message', function(data){
        // 交互に入力させる----------------------------------------
        let userGuess = Number(data['msg']);
        let count_num = data['count_num'];
        let user = data['user']
        turn_input(userGuess, count_num, user)

        // 入力した内容をchatに出す-----------------------------------
        let item = document.createElement('li');

        if (user === 1) {
            item.textContent = data['msg'];
            chat.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        } else {
            item.textContent = data['msg'];
            chat2.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        }
    });

    // 交互に入力させる関数-------------------------------------
    // 最初のやつがcommitが動作しないから直す必要ある
    function turn_input(userGuess, count_num, user) {
        if (first === user_s) {
            if (count_num % 2 === 1) {
                turn.textContent = 'My Turn!';
                guessField.disabled = false;
                guessSubmit.disabled = false;
                checkGuess(userGuess, count_num, user);
            } else {
                turn.textContent = "Opponent's Turn!!";
                guessField.disabled = true;
                guessSubmit.disabled = true;
                checkGuess(userGuess, count_num, user);
            }
        } else {
            if (count_num % 2 === 0) {
                turn.textContent = 'My Turn!';
                guessField.disabled = false;
                guessSubmit.disabled = false;
                checkGuess(userGuess, count_num, user);
            } else {
                turn.textContent = "Opponent's Turn!!";
                guessField.disabled = true;
                guessSubmit.disabled = true;
                checkGuess(userGuess, count_num, user);
            }
        }
    }

    function checkGuess(userGuess, count_num, user) {
        if (userGuess === ans) {
            lastResult.textContent = 'Congratulations!';
            lastResult.style.backgroundColor = 'green';
            lowOrHi.textContent = '';
            open_modal(user);
            setGameOver();
        } else if (count_num === 40) {
            // count_num===10で終了させるのは良くない(11回目移行が)　直す必要
            lastResult.textContent = '!!!GAME OVER!!!';
            lowOrHi.textContent = '';
            setGameOver();
        } else {
            lastResult.textContent = 'Wrong!';
            lastResult.style.backgroundColor = 'red';
            if (userGuess < ans) {
                lowOrHi.textContent = 'Last guess was too low!';
            } else {
                lowOrHi.textContent = 'Last guess was too high!';
            }
        }
    }

    function setGameOver() {
        guessField.disabled = true;
        guessSubmit.disabled = true;
        resetButton = document.createElement('button');
        resetButton.textContent = 'Start new game';
        document.body.appendChild(resetButton);
        resetButton.addEventListener('click', resetGame);
    }

    function resetGame() {
        guessCount = 1;
        const resetParas = document.querySelectorAll('.resultParas p');
        for(let i = 0 ; i < resetParas.length ; i++) {
          resetParas[i].textContent = '';
        }

        resetButton.parentNode.removeChild(resetButton);
        guessField.disabled = false;
        guessSubmit.disabled = false;
        guessField.value = '';
        guessField.focus();
        lastResult.style.backgroundColor = 'white';
        randomNumber = Math.floor(Math.random() * 100) + 1;
    }

    function open_modal(user){
        let modal = document.getElementById('myModal');
        let modal_win = document.querySelector('.modal_win');
        let modal_lose = document.querySelector('.modal_lose');
        if (user === user_s) {
            modal_win.textContent = 'Congratulations!';
            modal_win.style.backgroundColor = 'green';
        } else {
            modal_lose.textContent = 'You Lost!';
            modal_lose.style.backgroundColor = 'red';
        }
        modal.style.display = 'block';
    }

});