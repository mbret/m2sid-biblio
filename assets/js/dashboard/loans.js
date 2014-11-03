
var loans = {};
var createLoanForm = '#createLoan';
var deleteElement = '.btn-remove-loan';
var editLoanForm = '#editLoan';
var editLoanModal = '#editLoanModal';

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
                '<td>' + loans[i].customer.name + '</td>' +
                '<td>' + loans[i].work.workType + ': ' + loans[i].work.title + '</td>' +
                '<td>' + loans[i].copy.isbn + '</td>' +
                '<td><span class="btn-icon glyphicon glyphicon-remove-circle btn-remove-loan" data-id="' + loans[i].ID +'" title="End a loan"></span>' +
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
                data: { type: "success", message: messages.loanCreated }
            })
            .always(function() {
                    redirect( routes.loans.url );
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
            url: routes.literaryWorks.apiUri,
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


/**====================================
 *       Edition
 ======================================*/
(function ($) {


    /**
     * Edit a loan
     *
     */
    $(editLoanForm).on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");

        // Remove data before sending if user didn't changed them
        var dataToSend = $(this).serializeObject();

        button.button('loading');
        $.ajax({
            type: "put",
            url: routes.loans.apiUri + '/' + dataToSend.id,
            data: dataToSend
        })
        .done(function( response ) {
            $.ajax({
                type: "post",
                url: routes.flash.apiUri,
                data: { type: "success", message: messages.loanUpdated }
            })
            .always(function() {
                redirect( routes.loans.url );
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
    $(editLoanModal).on('show.bs.modal', function ( event ) {
        var id = $(event.relatedTarget).data('id');
        var loan = getObjectByID( id, loans );
        $(this).find('input[name="id"]').val( loan.ID ); // hidden input
    });

}(jQuery));

/**====================================
 *       Remove
 ======================================*/
(function ($) {

    /**
     * Remove loan
     */
    $(document).on('click', deleteElement, function( event ){
        if(confirm(messages.confirm)) {
            $.ajax({
                type: "delete",
                url: routes.loans.apiUri + "/" + $(this).data("id"),
                data: null
            })
            .done(function (response) {
                console.log(response);
                $.ajax({
                    type: "post",
                    url: routes.flash.apiUri,
                    data: { type: "success", message: messages.loanDeleted }
                })
                .always(function () {
                    redirect( routes.loans.url );
                });
            })
            .fail(function (error) {
                console.log(error);
                alert(messages.serverError);
            });
        }
    });

}(jQuery));