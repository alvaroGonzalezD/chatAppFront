//const {Console} = require("console");
// let direccion = "http://127.0.0.1:5000"
// let direccion = "http://192.168.1.101:5000"
let direccion = "http://192.168.1.199"


function addMessages(msg_id, v) {
    // tempHtml = $("#textTemplate").html()
    const txt = this["txt"]
    const user = this["user"]
    const dateTime = this["datetime"]
    const id_msg = this["id_msg"]

    // let dateTimeParts = dateTime.split(/[- :]/); // regular expression split that creates array with: year, month, day, hour, minutes, seconds values
    // dateTimeParts[1]--; // monthIndex begins with 0 for January and ends with 11 for December so we need to decrement by one

    // const dateObject = new Date(...dateTimeParts); // our Date object
    // const humanTime = dateObject.toLocaleString("es-ES")

    const dateObject = new Date(dateTime)

    // const humanTime = (dateObject.getHours() + ':' + dateObject.getMinutes() + ':' + dateObject.getSeconds())
    const humanTime =
        (
            (
                (dateObject.getHours() < 10 ? '0' : '') +
                dateObject.getHours()

            ) + ':' +
            (
                (dateObject.getMinutes() < 10 ? '0' : '') +
                dateObject.getMinutes()
            ) +
            ':' +
            (
                (dateObject.getSeconds() < 10 ? '0' : '') +
                dateObject.getSeconds()
            )
        )


    // const newMsg = `<p class= "mensajeEnChat" id="${msg_id}"><span>${user}: ${txt}</span></p>`
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

    function userSide() {

        let msgToAppend = newMsg
        //let msgToAppend = (Math.random() >= 0.5 ? newMsg : ownMsg)
        let usuarioActual = document.getElementById("fname").value
        if (user == usuarioActual) {
            msgToAppend = ownMsg
        }

        $(".speech-wrapper").append(msgToAppend)
    }
    userSide()

}

function scrollToBottom() {
    var objDiv = document.getElementById("speech-wrapper");
    objDiv.scrollTop = objDiv.scrollHeight;    
}

function recibirMensajes() {

    if (document.getElementsByClassName("bubble").length > 0){
        msg_id = document.getElementsByClassName("bubble")[document.getElementsByClassName("bubble").length-1].getAttribute("id")
    }else{
        msg_id = 0
    }

    

    datosJsonRecibir = {
        id_msg: msg_id,
    }

    $.ajax({
        url: direccion + "/recibir",
        type: "POST",
        contentType: "application/json charset=utf-8",
        dataType: 'json',
        data: JSON.stringify(datosJsonRecibir),
        crossDomain: true,
        cache: false,
        headers: {
            'Access-Control-Allow-Origin': "*" //direccion + "/recibir"
        },
        success: function(data) {
            let speechWrapper = document.getElementById("speech-wrapper");
            let toTheBottom = false
            if (Math.round(speechWrapper.scrollHeight-speechWrapper.scrollTop) == Math.round(speechWrapper.clientHeight)){
                toTheBottom = true
            }

            //$("#speech-wrapper").html("");
            $.each(data, function(index) {
                $.each(this, addMessages);
            });

            if (toTheBottom) {
                scrollToBottom()
            }
        },
        error: function() {
            console.log("error")
        }
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
            dataType: 'json',
            crossDomain: true,
            cache: false,
            headers: {
                "Access-Control-Allow-Origin": "*" //direccion + "/enviar"
            },
            success: function(data, textStatus, req) {
                console.log("todo guay")
            },
            error: function(req, textStatus, errorThrown) {
                mensaje.value = ""
                console.log(textStatus)
            },
            complete: function(req, textStatus) {
                mensaje.value = ""
            }
        })
    }
}
