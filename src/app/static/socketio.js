var socket;
$(document).ready(function(){
    socket = io.connect('http://' + document.domain + ':' + location.port + '/socket');

    var chat = document.getElementById('chat');
    var text = document.getElementById('text');
    var form = document.getElementById('form');

    socket.on('connect', function(){
        socket.emit('join', {});
    });

    // socket.on('status', function(data){
    //     var item = document.createElement('li');
    //
    //     for (let i = 0; i < data['msg'].length; i++){
    //         item = document.createElement('li');
    //         item.textContent = data['msg'];
    //         chat.appendChild(item);
    //     }
    //     window.scrollTo(0, document.body.scrollHeight);
    // });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (text.value){
            socket.emit('text', {msg: text.value});
            text.value = '';
        }
    });

    socket.on('message', function(data){
        var item = document.createElement('li');
        item.textContent = data['msg'];
        chat.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
    });
});