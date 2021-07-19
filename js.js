window.onload = function() {


    $.getJSON("mensajes.json", function(json) {
        console.log("hey")
        console.log(json); // this will show the info it in firebug console
        let i = 0
        $.each(json, function(index) {
            /// do stuff
            $.each(this, function(k, v) {
                tempHtml = $("#textTemplate").html()
                $("#textTemplate").html(tempHtml + "<p id=" + k + ">" + this["user"] + ": " + this["txt"] + "</p>")
            });
        });
    });


    $.ajax({
        url: "/ajax",
        type: "post",
        data: null,
        dataType: 'json',
        success: function(data) {
            console.log(data);
            console.log(data.id);
        }
    });


}