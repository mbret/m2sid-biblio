
var works = {};
var editWorkForm = '#editWork';
var editWorkModal = '#editWorkModal';
var createResaForm = '#createReservation';

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
        objects = response.reservations;
        var html = '';
        for(var i = 0; i < objects.length; i++){
            html +=
                '<tr><td>' + objects[i].ID + '</td>' +
                '<td>' + objects[i].work.title + '</td>' +
                '<td>' + ((objects[i].workType == 'book')? '<span class="glyphicon glyphicon-book" title="book"></span>' : '<span class="glyphicon glyphicon-list-alt" title="magazine"></span>') + '</td>' +
                '<td>' + moment(objects[i].bookedAt).format('YYYY-MM-DD h:mm:ss a') + '</td>' +
                '<td>' + objects[i].user.login + '</td>' +
                '<td>' + objects[i].customer.name + '</td>' +
                '<td><span class="btn-icon glyphicon glyphicon-trash btn-remove-work" data-id="' + objects[i].ID +'"></span>' +
                '<span class="btn-icon glyphicon glyphicon-edit btn-edit-work" data-id="' + objects[i].ID +'" data-toggle="modal" data-target="#editWorkModal"></span></td></tr>';
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


    function displayCorrectExtraForm( type ){
        $(editWorkForm + ' .extra-form:visible').addClass('hide').find('input').prop('disabled', true);
        $(editWorkForm + ' .extra-form-' + type).removeClass('hide').find('input').prop('disabled', false);
    }

    /**
     * Edit a customer
     *
     */
    $(editWorkForm).on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");

        // Remove data before sending if user didn't changed them
        var dataToSend = $(this).serializeObject();
        if( dataToSend.title == $(this).find('input[name="title"]').data('oldValue')) delete dataToSend.title;
        if( dataToSend.publishedDate == $(this).find('input[name="publishedDate"]').data('oldValue')) delete dataToSend.publishedDate;
        if( dataToSend.volume == $(this).find('input[name="volume"]').data('oldValue')) delete dataToSend.volume;
        if( dataToSend.number == $(this).find('input[name="number"]').data('oldValue')) delete dataToSend.number;

        button.button('loading');
        $.ajax({
            type: "put",
            url: "/api/literaryworks",
            data: dataToSend
        })
        .done(function( response ) {
            $.ajax({
                type: "POST",
                url: routes.flash.apiUri,
                data: { type: "success", message: "Work updated" }
            })
            .always(function() {
                    redirect( 'literaryworks' );
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
     * Display extra form whether is book or magazine chosen
     * - use value of radio to display correct extra fields
     */
    $(editWorkForm + ' input[name="type"]').on('click', function( event ){
       displayCorrectExtraForm( $(this).val() );
    });


    /**
     * On edit modal showing
     * - populate form with current values
     * - add old value data to know if object has been changed for further jobs
     */
    $(editWorkModal).on('show.bs.modal', function ( event ) {
        var id = $(event.relatedTarget).data('id');
        var work = getObjectByID( id, works );
        $(this).find('input[name="id"]').val( work.ID ); // hidden input
        $(this).find('input[name="title"]').val( work.title ).data( 'oldValue', work.title );
        console.log(work.publishedDate);
        $(this).find('input[name="publishedDate"]').val( moment(work.publishedDate).format('YYYY-MM-DD') ).data( 'oldValue', moment(work.publishedDate).format('YYYY-MM-DD') );
        $(this).find('input[name="volume"]').val( work.volume ).data( 'oldValue', work.volume );
        $(this).find('input[name="number"]').val( work.number ).data( 'oldValue', work.number );
        // active correct radio
        if(work.workType == 'book') $(this).find('input:radio[name="type"]').filter('[value=book]').prop('checked', true);
        else $(this).find('input:radio[name="type"]').filter('[value=magazine]').prop('checked', true);
        displayCorrectExtraForm( work.workType );
    });

}(jQuery));

/**====================================
 *       Remove
 ======================================*/
(function ($) {


    /**
     * Remove customer
     * - delegate event
     */
    $(document).on('click', '.btn-remove-work', function( event ){
        if(confirm(messages.confirm)) {
            $.ajax({
                type: "delete",
                url: "/api/literaryworks/" + $(this).data("id"),
                data: null
            })
                .done(function (response) {
                    console.log(response);
                    $.ajax({
                        type: "post",
                        url: routes.flash.apiUri,
                        data: { type: "success", message: "Work deleted" }
                    })
                        .always(function () {
                            redirect('literaryworks');
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

