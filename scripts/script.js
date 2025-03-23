
// to start the document in jQuery
$(document).ready(()=> {
    // external api link
    const apiUrl = "https://api.api-ninjas.com/v1/advice";
    // ajax request to retrieve all advice information 
    $.ajax({
        url: apiUrl,
        // HTTP METHOD
        type: 'GET',
        dataType: 'json',
        // response type returning as json
        contentType:"application/json" ,
        // my API-KEY in order to access the API server
        headers : {
            'X-API-KEY': '4u9uOQ4bPRsfLWiReHVY2A==LhjWjqQZiGtOzkd7'
        },
        // if the request was a success meaning that the request went through
        success: (response) => {
            console.log(response);
        }, 
        // otherwise we call the `error` callback and add two parameters status and error type for debugging purposes.
        error: (status, error)=> {
            console.log(`Error ${error} at Status ${status}`);
        }
    });
});
