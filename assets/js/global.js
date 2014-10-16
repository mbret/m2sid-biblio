var messages = {
    serverError: "Something went wrong, please try later!",
    badCredential: "Wrong credential!"
}

function redirect( path ){
    window.location.href = "http://localhost:1337/" . path;
}



$(function() {

    /**
     * Handle flash message for each request
     */
    for (var key in flashMessages) {
        var obj = flashMessages[key];
        if(obj.message){
            new PNotify({
                title: obj.title,
                text: obj.message,
                type: key
            });
        }
    }


    /**
     * Sign In form
     */
    $("#signin").on('submit', function( event ){
        event.preventDefault();
        var button = $("#signin button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $('#signin').serialize()
        })
        .done(function( response ) {
            console.log(response);
            redirect('index');
        })
        .fail(function( error ) {
            console.log(error);
            if(error.status == 404){
                alert(messages.badCredential);
            }
            else{
                alert(messages.serverError);
            }
        })
        .always(function() {
            button.button('reset');
        });
    });
});

