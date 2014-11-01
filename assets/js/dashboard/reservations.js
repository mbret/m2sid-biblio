
var reservations = {};
var editResaForm = '#editResa';
var editResaModal = '#editResaModal';
var createResaForm = '#createReservation';
var deleteElement = '.btn-remove-reservation';

/**====================================
 *      Init & others
 ======================================*/
(function ($) {

    /*
     * Load and display customer table
     */
    $.ajax({
        type: "get",
        url: routes.reservations.apiUri,
        data: null
    })
    .done(function( response ) {
        console.log(response);
            reservations = response.reservations;
        var html = '';
        for(var i = 0; i < reservations.length; i++){
            html +=
                '<tr><td>' + reservations[i].ID + '</td>' +
                '<td>' + reservations[i].work.title + '</td>' +
                '<td>' + ((reservations[i].work.workType == 'book')? '<span class="glyphicon glyphicon-book" title="book"></span>' : '<span class="glyphicon glyphicon-list-alt" title="magazine"></span>') + '</td>' +
                '<td>' + moment(reservations[i].bookedAt).format('YYYY-MM-DD h:mm:ss a') + '</td>' +
                '<td>' + reservations[i].user.login + '</td>' +
                '<td>' + reservations[i].customer.name + '</td>' +
                '<td><span class="btn-icon glyphicon glyphicon-trash btn-remove-reservation" data-id="' + reservations[i].ID +'"></span>' +
                '<span class="btn-icon glyphicon glyphicon-edit btn-edit-reservation" data-id="' + reservations[i].ID +'" data-toggle="modal" data-target="#editResaModal"></span></td></tr>';
        }
        $('#worksTable tbody').first().after(html);
    })
    .fail(function( error ){
        console.log(error);
        alert(messages.serverError);
    })
    .always(function() {});

}(jQuery));

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


}(jQuery));

/**====================================
 *       Edition
 ======================================*/
(function ($) {


    /**
     * Edit a reservation
     *
     */
    $(editResaForm).on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");

        // Remove data before sending if user didn't changed them
        var dataToSend = $(this).serializeObject();
        if( dataToSend.reference == $(this).find('select[name="reference"]').data('oldValue')) delete dataToSend.reference;
        if( dataToSend.customer == $(this).find('select[name="customer"]').data('oldValue')) delete dataToSend.customer;

        button.button('loading');
        $.ajax({
            type: "put",
            url: routes.reservations.apiUri + '/' + dataToSend.id,
            data: dataToSend
        })
        .done(function( response ) {
            $.ajax({
                type: "POST",
                url: routes.flash.apiUri,
                data: { type: "success", message: messages.reservationUpdated }
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
     * On edit modal showing
     * - populate form with current values
     * - add old value data to know if object has been changed for further jobs
     */
    $(editResaModal).on('show.bs.modal', function ( event ) {
        var id = $(event.relatedTarget).data('id');
        var reservation = getObjectByID( id, reservations );
        console.log(reservation);
        $(this).find('input[name="id"]').val( reservation.ID ); // hidden input
        $(this).find('select[name="customer"]').val( reservation.customer.ID ).data( 'oldValue', reservation.customer.ID );
        $(this).find('select[name="reference"]').val( reservation.work.ID ).data( 'oldValue', reservation.work.ID );
    });

}(jQuery));

/**====================================
 *       Remove
 ======================================*/
(function ($) {


    /**
     * Remove reservation
     * - delegate event
     */
    $(document).on('click', deleteElement, function( event ){
        if(confirm(messages.confirm)) {
            $.ajax({
                type: "delete",
                url: routes.reservations.apiUri + "/" + $(this).data("id"),
                data: null
            })
            .done(function (response) {
                console.log(response);
                $.ajax({
                    type: "post",
                    url: routes.flash.apiUri,
                    data: { type: "success", message: messages.reservationDeleted }
                })
                .always(function () {
                    redirect( routes.reservations.url );
                });
            })
            .fail(function (error) {
                console.log(error);
                alert(messages.serverError);
            })
            .always(function () {

            });
        }
    });


}(jQuery));

