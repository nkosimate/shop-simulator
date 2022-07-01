var socket =io();
$('#myform1').submit(function(){
    var oldPriceString = $('pprice');
    var intPrice = parseInt(oldPriceString);
    if (intPrice){
        console.log("the price is " + intPrice + " of data type " + typeof(intPrice));
    }

})