
var loans = {};
var createResaForm = '#createLoan';


/**====================================
 *       Resa creation
 ======================================*/
(function ($) {

    /**
     *
     */
    $(createResaForm).on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "post",
            url: routes.reservations.apiUri,
            data: $(this).serialize()
        })
        .done(function( response ) {
            console.log(response);
            $.ajax({
                type: "POST",
                url: routes.flash.apiUri,
                data: { type: "success", message: messages.reservationCreated }
            })
            .always(function() {
                    redirect( routes.reservations.url );
            });
        })
        .fail(function( error ) {
            console.log(error);
            if(error.status == 400){
                alert(messages.badRequest);
            }
            else{
                alert(messages.serverError);
            }
        })
        .always(function() {
            button.button('reset');
        });
    });

    /**
     * When user select a customer, then retrieve available copy for him
     */
    $(createResaForm + ' select[name="customer"]').on('change', function( event ){
        var el = this;
        // Get all available resa
        $.ajax({
            type: "get",
            url: routes.loans.apiUri,
            data: {
                'available-for': $(el).val()
            }
        })
        .done(function( response ) {
            console.log(response);

        })
        .fail(function( error ) {
            console.log(error);
            if(error.status == 400){
                alert(messages.badRequest);
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