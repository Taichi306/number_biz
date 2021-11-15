var socket;
$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/socket');

    var chat = document.getElementById('chat');
    var text = document.getElementById('text');
    var form = document.getElementById('form');
    let randomNumber = ans;
    const guesses = document.querySelector('.guesses');
    const lastResult = document.querySelector('.lastResult');
    const lowOrHi = document.querySelector('.lowOrHi');
    const guessSubmit = document.querySelector('.guessSubmit');
    const guessField = document.querySelector('.guessField');
    let guessCount = 1;
    let resetButton;

    socket.on('connect', function(){
        socket.emit('join', {});
    });


    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (text.value){
            socket.emit('text', {msg: text.value});
            text.value = '';
        }
    });

    socket.on('message', function(data){
        let userGuess = Number(data['msg']);
        let count_num = data['count_num'];
        let input_index = 2;

        // 交互に入力させるコード-------------------------------------
        if (first === user_s) {
            if (count_num % input_index === 1) {
                guessField.disabled = false;
                guessSubmit.disabled = false;
                checkGuess(userGuess, count_num);
            } else {
                guessField.disabled = true;
                guessSubmit.disabled = true;
            }
        } else {
            if (count_num % input_index === 0) {
                guessField.disabled = false;
                guessSubmit.disabled = false;
                checkGuess(userGuess, count_num);
            } else {
                guessField.disabled = true;
                guessSubmit.disabled = true;
            }
        }

        // 入力した内容をchatに出す-----------------------------------
        let item = document.createElement('li');
        item.textContent = data['user'] + ' : ' + data['msg'];
        chat.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });

    // -------------------------------------------------------
    function checkGuess(userGuess, count_num) {
        if (count_num === 1) {
            guesses.textContent = 'Previous guesses: ';
        }

        guesses.textContent += userGuess + ' ';

        if (userGuess === ans) {
            lastResult.textContent = 'Congratulations!';
            lastResult.style.backgroundColor = 'green';
            lowOrHi.textContent = '';
            setGameOver();
        } else if (count_num === 10) {
            // count_num===10で終了させるのは良くない(11回目移行が)　直す必要
            lastResult.textContent = '!!!GAME OVER!!!';
            lowOrHi.textContent = '';
            setGameOver();
        } else {
            lastResult.textContent = 'Wrong!';
            lastResult.style.backgroudColor = 'red';
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
    //-------------------------------------------------------
});
