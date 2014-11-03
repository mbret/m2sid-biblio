
var loans = {};
var createLoanForm = '#createLoan';

/**====================================
 *      Init & others
 ======================================*/
(function ($) {

    $.ajax({
        type: "get",
        url: routes.loans.apiUri,
        data: null
    })
        .done(function( response ) {
            console.log(response);
            loans = response.loans;
            var html = '';
            for(var i = 0; i < loans.length; i++){
                html +=
                    '<tr><td>' + loans[i].ID + '</td>' +
                    '<td>' + moment(loans[i].createdAt).format('YYYY-MM-DD h:mm:ss a') + '</td>' +
                    '<tr><td>' + loans[i].customer.name + '</td>' +
                    '<td><span class="btn-icon glyphicon glyphicon-trash btn-remove-loan" data-id="' + loans[i].ID +'"></span>' +
                    '<span class="btn-icon glyphicon glyphicon-edit btn-edit-loan" data-id="' + loans[i].ID +'" data-toggle="modal" data-target="#editLoanModal"></span></td></tr>';
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
    $(createLoanForm).on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "post",
            url: routes.loans.apiUri,
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
    $(createLoanForm + ' select[name="customer"]').on('change', function( event ){
        var el = this;
        var selectWorkReference = createLoanForm + ' select[name="reference"]';
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
            $(selectWorkReference).empty();
            $.each(response.works, function() {
                $(selectWorkReference).append($("<option />").val(this.ID).text(this.workType + ': ' + this.title));
            });
            if( response.works.length == 0 || $(selectWorkReference).val() == '-1' ){
                $(selectWorkReference).append($("<option />").val('-1').text('No works available'));
            }
        })
        .fail(function( error ) {
            console.log(error);
            if(error.status == 400){
                alert(messages.badRequest);
            }
            else{
                alert(messages.serverError);
            }
        });
    });

}(jQuery));