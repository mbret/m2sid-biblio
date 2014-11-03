
var copies = {};


$(function() {

    /*
     * Load and display copies table
     */
    if ( $('#copiesTable').length ) {
        console.log("Copies table loading");
        $.ajax({
            type: "get",
            url: "/api/literarycopies",
            data: null
        })
        .done(function( response ) {
            console.log(response);
            copies = response.copies;
            var html = '';
            for(var i = 0; i < copies.length; i++){
                html +=
                    '<tr id="copies-' + copies[i].ID + ' "><td>' + copies[i].ID +
                    '</td[><td>' + copies[i].isbn + '</td>' +
                    '</td[><td>' + copies[i].reference.workType + '</td>' +
                    '</td[><td>' + copies[i].reference.title + '</td>' +
                    '</td[><td>' + copies[i].state + '</td>' +
                    '<td><span class="btn-icon glyphicon glyphicon-trash btn-remove-copy" data-id="' + copies[i].ID +'"></span>' +
                    '<span class="btn-icon glyphicon glyphicon-edit btn-edit-copy" data-id="' + copies[i].ID +'" data-toggle="modal" data-target="#editCustomerModal"></span></td></tr>';
            }
            $('#copiesTable tbody').first().after(html);
        })
        .fail(function( error ){
            console.log(error);
            alert(messages.serverError);
        })
        .always(function() {});
    }



    /**
     * Add copy form
     */
    $("#addCopy").on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "post",
            url: "/api/literarycopies",
            data: $(this).serialize()
        })
        .done(function( response ) {
            console.log(response);
            $.ajax({
                type: "POST",
                url: "/api/flash",
                data: { type: "success", message: "Copy created" }
            })
            .always(function() {
                redirect( 'literarycopies' );
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
     * Remove copy
     * - delegate event
     */
    $(document).on('click', '.btn-remove-copy', function( event ){
        if(confirm(messages.confirm)) {
            $.ajax({
                type: "delete",
                url: "/api/literarycopies/" + $(this).data("id"),
                data: null
            })
            .done(function (response) {
                console.log(response);
                $.ajax({
                    type: "post",
                    url: "/api/flash",
                    data: { type: "success", message: "Copy deleted" }
                })
                .always(function () {
                    redirect('literarycopies');
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


    /**
     * Edit a customer
     *
     */
    $("#editCustomer").on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");

        // Remove data vefore sending if user didn't changed them
        var dataToSend = $(this).serializeObject();
        if( dataToSend.name == $(this).find('input[name="name"]').data('oldValue')) delete dataToSend.name;

        button.button('loading');
        $.ajax({
            type: "put",
            url: "/api/customers",
            data: dataToSend
        })
        .done(function( response ) {
            $.ajax({
                type: "POST",
                url: "/api/flash",
                data: { type: "success", message: "Customer updated" }
            })
            .always(function() {
                redirect( 'customers' );
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
     * - populate form
     */
    $('#editCustomerModal').on('show.bs.modal', function ( event ) {
        var id = $(event.relatedTarget).data('id');
        var customer = getObjectByID( id, customers );
        console.log(customer);
        $(this).find('input[name="name"]').val( customer.name );
        $(this).find('input[name="name"]').data( 'oldValue', customer.name );
        $(this).find('input[name="id"]').val( customer.ID );
    })
});

