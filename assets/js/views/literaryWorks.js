
var works = {};


$(function() {

    /*
     * Load and display customer table
     */
    console.log("Works table loading");
    $.ajax({
        type: "get",
        url: "/api/literaryworks",
        data: null
    })
    .done(function( response ) {
        console.log(response);
        works = response.works;
        var html = '';
        for(var i = 0; i < works.length; i++){
            html +=
                '<tr><td>' + works[i].ID + '</td>' +
                '<td>' + works[i].title + '</td>' +
                '<td>' + ((works[i].workType == 'book')? '<span class="glyphicon glyphicon-book" title="book"></span>' : '<span class="glyphicon glyphicon-list-alt" title="magazine"></span>') + '</td>' +
                '<td>' + works[i].publishedDate + '</td>' +
                '<td>' + ((!works[i].volume) ? '-' : works[i].volume) + '</td>' +
                '<td>' + ((!works[i].number) ? '-' : works[i].number) + '</td>' +
                '<td><span class="btn-icon glyphicon glyphicon-trash btn-remove-work" data-id="' + works[i].ID +'"></span>' +
                '<span class="btn-icon glyphicon glyphicon-edit btn-edit-work" data-id="' + works[i].ID +'" data-toggle="modal" data-target="#editWorkModal"></span></td></tr>';
        }
        $('#worksTable tbody').first().after(html);
    })
    .fail(function( error ){
        console.log(error);
        alert(messages.serverError);
    })
    .always(function() {});


    /**
     * Add work form
     */
    $("#addWork").on('submit', function( event ){
        event.preventDefault();
        var button = $(this).find("button[type='submit']");
        button.button('loading');
        $.ajax({
            type: "post",
            url: "/api/literaryworks",
            data: $(this).serialize()
        })
        .done(function( response ) {
            console.log(response);
            $.ajax({
                type: "POST",
                url: "/api/flash",
                data: { type: "success", message: "Work created" }
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
     */
    $('#addWork input[name="type"]').on('click', function( event ){
        $('.extra-form:visible').addClass('hide').find('input').prop('disabled', true);
        $('.extra-form-' + $(this).val()).removeClass('hide').find('input').prop('disabled', false);
    });

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
                    url: "/api/flash",
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
        var customer = getCustomerByID( id, customers );
        console.log(customer);
        $(this).find('input[name="name"]').val( customer.name );
        $(this).find('input[name="name"]').data( 'oldValue', customer.name );
        $(this).find('input[name="id"]').val( customer.ID );
    })
});

