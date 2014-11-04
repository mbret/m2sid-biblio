var messages = {
    serverError: "Something went wrong, please try later!",
    badCredential: "Wrong credential!",
    badRequest: "Please verify your form, some information are not valid!",
    confirm: "Are you sure?",

    reservationCreated: "Reservation created!",
    reservationDeleted: "Reservation deleted!",
    reservationUpdated: "Reservation updated!",
    loanCreated: "Loan created!",
    loanDeleted: "Loan ended!",
    loanUpdated: "Loan updated!"
}

var routes = {
    literaryWorks: {
        url: 'literaryworks',
        apiUri: '/api/literaryworks'
    },
    customers: {
        url: 'customers',
        apiUri: '/api/customers'
    },
    reservations: {
        url: 'reservations',
        apiUri: '/api/reservations'
    },
    loans: {
        url: 'loans',
        apiUri: '/api/loans'
    },
    flash: {
        apiUri: '/api/flash'
    },
    login: {
        apiUri: '/api/login'
    }
}

//var routes = {
//    customers:
//}
var pathArray = window.location.pathname.split( '/' );
var route = pathArray[1];
if(route == "") route = "index";
console.log("route = " + route);

function redirect( path ){
    window.location.href = "http://localhost:1337/" + path;
}

function getObjectByID( id, arrayOfObjects ){
    for(var i = 0; i < arrayOfObjects.length; i++){
        if(arrayOfObjects[i].ID == id) return arrayOfObjects[i];
    }
    return null;
}

(function ($) {

    /*
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

    /*
     * Set left panel active depend of the route
     */
    $( "ul.nav-sidebar li" ).each(function( index ) {
        if( $(this).data("route") == route){
            $( this ).addClass( "active" );
        }
    });


    /**
     * Sign In form
     */
    $("#signin").on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "POST",
            url: routes.login.apiUri,
            data: $(this).serialize()
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

}(jQuery));

/**
 * Add method to jquery functions
 * This method allow to retrieve data form a form but in object instead of string (serialize) or array (serializeArray)
 * @returns {{}}
 */
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};

