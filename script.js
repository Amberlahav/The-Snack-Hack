const allergyApp = {};

allergyApp.key = '54fcm2tzk4fazpqjqpx6nq7d';

allergyApp.getFoodResults = function (query) {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: 'http://api.foodessentials.com/searchprods',
            params: {
                api_key: allergyApp.key,
                sid: '235c50d8-df4c-479a-b959-11d64b0d5885',
                q: query,
                n: 1,
                s: 0,
                f: 'json'
            },
            useCache: true
        }
    }).then(function (labelArray) {
        // only passing through the information that we need:
        // delaying by 1 seconds to allow for 2 requests to be sent:
        window.setTimeout(() => { allergyApp.getLabelResults(allergyApp.userSnackUpc); }, 1000);
        

        // get the upc of the userSnack object and store inside a variable:

        allergyApp.userSnackUpc = labelArray.productsArray[0].upc;
        

    });

};

allergyApp.getLabelResults = function (upc) {
    $.ajax({
        url: 'http://proxy.hackeryou.com',
        dataType: 'json',
        method: 'GET',
        data: {
            reqUrl: 'http://api.foodessentials.com/labelarray',
            params: {
                api_key: allergyApp.key,
                sid: '235c50d8-df4c-479a-b959-11d64b0d5885',
                u: upc,
                n: 50,
                s: 0,
                f: 'json'
            },
            useCache: true
        }
    }).then(function (labelArray) {
      
        
        // empty lists every time page refreshes/button is clicked:
        $('#avoidList').empty();
        $('#haveList').empty();
       // when user submits an allergy input, take their submission and filter out all the products that have their allergy in them
        labelArray.productsArray.filter(function (snack) {
    
            return snack.ingredients.toLowerCase().includes(allergyApp.userAllergy.toLowerCase());
        }).forEach(function (snack) {
            const avoidListItem = $('<li>').text(snack.product_name);
            // display the product in the form of a list item in the "avoid" list:
            $('#avoidList').append(avoidListItem, `<a>${'Show Ingredients List'}</a>`,`<p>${snack.ingredients}</p>`);

        });
        // repeat for the "have" list:
        labelArray.productsArray.filter(function (snack) {
     
            if (snack.ingredients.toLowerCase().includes(allergyApp.userAllergy.toLowerCase()) == false) {
                return snack.ingredients
            }
        }).forEach(function (snack) {
        //   when user clicks on "show list ingredients", toggle class of "display" on the p tag that has the ingredients in it:
            const haveListItem = $('<li>').text(snack.product_name);

            $('#haveList').append(haveListItem, `<a>${'Show Ingredients List'}</a>`, `<p>${snack.ingredients}</p>`);
           
            // stretch goal: append product name to a shopping list:
            // if ('input[type=checkbox]:checked') {
            //     console.log('checked!')
                
            // }

        });

    });
};

allergyApp.events = function () {
    // when user submits a product input (query), take their submission and get products from the api that have their query in them (without displaying yet).
    // store user's "snack" input into a variable:
    // when a user clicks submit, that variable gets stored
    $('form').on('click', '.submit', function (e) {
        e.preventDefault();
        const userSnack = $('#snack').val();
        allergyApp.userAllergy = $('#allergy').val();


        allergyApp.getFoodResults(userSnack);

    });

    $('ul').on('click', 'a', function (e) {
        // use the this keyword to access the element we clicked on
        // using a next method, find the adjacent p tag and toggle the class of display on that

        $(this).next('p').toggleClass('display');
        e.preventDefault();



        console.log('clicked!');
    })

    $(function () {
        // this code initializes smooth scroll:
        $('a').smoothScroll({
            speed: 1000,
        });

    });
}

allergyApp.init = function () {
    allergyApp.events();

};

$(function () {
    allergyApp.init();
});









