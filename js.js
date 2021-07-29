//const {Console} = require("console");
// let direccion = "http://127.0.0.1:5000"
// let direccion = "http://192.168.1.101:5000"
let direccion = "http://192.168.1.199"


function addMessages(msg_id, v) {
    function getHumantime() {
        const dateObject = new Date(dateTime)

        const ht = {
            h: dateObject.getHours(),
            m: dateObject.getMinutes(),
            s: dateObject.getSeconds()
        }

        for (key in ht) {
            ht[key] = (ht[key] < 10 ? '0' : '') + ht[key]
        }

        return `${ht.h}:${ht.m}:${ht.s}`
    }

    function userSide() {

        let msgToAppend = newMsg
        let usuarioActual = document.getElementById("fname").value

        if (user.toUpperCase() == usuarioActual.toUpperCase()) {
            msgToAppend = ownMsg
        }

        $(".speech-wrapper").append(msgToAppend)
    }

    const txt = this["txt"]
    const user = this["user"]
    const dateTime = this["datetime"]
    const id_msg = this["id_msg"]
    const humanTime = getHumantime()

    const newMsg = `
        <div class="bubble" id="${id_msg}">
            <div class="txt">
                <p class="name">${user}</p>
                <p class="message">${txt}</p>
                <span class="timestamp">${humanTime}</span>
            </div>
        <div class="bubble-arrow"></div>`

    const ownMsg = `
        <div class="bubble alt" id="${id_msg}">
            <div class="txt">
                <p class="name alt">${user}</p>
                <p class="message">${txt}</p>
                <span class="timestamp">${humanTime}</span>
        </div>
        <div class="bubble-arrow alt"></div>`

    userSide()
}


function recibirMensajes() {

    function onNewmessages(data) {

        function scrollToBottom() {
            var objDiv = document.getElementById("speech-wrapper");
            objDiv.scrollTop = objDiv.scrollHeight;
        }

        let speechWrapper = document.getElementById("speech-wrapper");
        let toTheBottom = false
        if (Math.round(speechWrapper.scrollHeight - speechWrapper.scrollTop) == Math.round(speechWrapper.clientHeight)) {
            toTheBottom = true
        }

        $.each(data, function(index) {
            $.each(this, addMessages);
        });

        if (toTheBottom) {
            scrollToBottom()
        }
    }


    var bubble = document.getElementsByClassName("bubble")
    let msg_id = (bubble.length > 0) ? bubble[bubble.length - 1].getAttribute("id") : 0

    $.ajax({
        url: direccion + "/recibir",
        type: "POST",
        contentType: "application/json charset=utf-8",
        dataType: 'json',
        data: JSON.stringify({id_msg: msg_id}),
        crossDomain: true,
        cache: false,
        success: function(data) {
            onNewmessages(data)
        },
        error: function(req, textStatus, errorThrown) {
            mensaje.value = ""
            console.error(textStatus)
            console.log(errorThrown)
        },
    });

}

window.onload = function() {

    setInterval(() => {
        recibirMensajes()
    }, 2000);

    var formulario = document.getElementById('botonSend');
    var campoTexto = document.getElementById('ftext');
    campoTexto.addEventListener('keydown', function(event) {
        switch (event.key) {
            case "Enter":
                enviar();
                break;
            default:
                break;
        }
    });

    formulario.addEventListener('click', function() {
        enviar();
    });

    function enviar() {
        var usuario = document.getElementById("fname")
        var mensaje = document.getElementById("ftext")

        datosJson = {
            user: usuario.value,
            txt: mensaje.value
        }

        $.ajax({
            url: direccion + "/enviar",
            type: "POST",
            contentType: "application/json charset=utf-8",
            data: JSON.stringify(datosJson),
            crossDomain: true,
            cache: false,
            success: function(data, textStatus, req) {
                // pass
            },
            error: function(req, textStatus, errorThrown) {
                mensaje.value = ""
                console.error(textStatus)
                console.log(errorThrown)
            },
            complete: function(req, textStatus) {
                mensaje.value = ""
            }
        })
    }
}