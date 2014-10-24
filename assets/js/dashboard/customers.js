
var customers = {};


$(function() {

    /*
     * Load and display customer table
     */
    if ( $('#customersTable').length ) {
        console.log("Customer table loading");
        $.ajax({
            type: "get",
            url: "/api/customers",
            data: null
        })
        .done(function( response ) {
            console.log(response);
            customers = response.customers;
            var html = '';
            for(var i = 0; i < customers.length; i++){
                html +=
                    '<tr id="customer-' + customers[i].ID + ' "><td>' + customers[i].ID +
                    '</td><td>' + customers[i].name + '</td>' +
                    '<td><span class="btn-icon glyphicon glyphicon-trash btn-remove-customer" data-id="' + customers[i].ID +'"></span>' +
                    '<span class="btn-icon glyphicon glyphicon-edit btn-edit-customer" data-id="' + customers[i].ID +'" data-toggle="modal" data-target="#editCustomerModal"></span></td></tr>';
            }
            $('#customersTable tbody').first().after(html);
        })
        .fail(function( error ){
            console.log(error);
            alert(messages.serverError);
        })
        .always(function() {});
    }



    /**
     * Add customer form
     */
    $("#addCustomer").on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "post",
            url: "/api/customers",
            data: $(this).serialize()
        })
        .done(function( response ) {
            console.log(response);
            $.ajax({
                type: "POST",
                url: "/api/flash",
                data: { type: "success", message: "Customer created" }
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
     * Remove customer
     * - delegate event
     */
    $(document).on('click', '.btn-remove-customer', function( event ){
        if(confirm(messages.confirm)) {
            $.ajax({
                type: "delete",
                url: "/api/customers/" + $(this).data("id"),
                data: null
            })
            .done(function (response) {
                console.log(response);
                $.ajax({
                    type: "post",
                    url: "/api/flash",
                    data: { type: "success", message: "Customer deleted" }
                })
                .always(function () {
                    redirect('customers');
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

