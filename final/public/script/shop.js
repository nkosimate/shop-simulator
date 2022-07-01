var socket =io();
$('#myform1').submit(function(){
    var oldPriceString = $('pprice');
    var intPrice = parseInt(oldPriceString);
    console.log("the price is " + intPrice + " of data type " + typeof(intPrice));
    if (intPrice){
    }

})