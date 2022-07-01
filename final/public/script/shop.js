var socket =io();
$('#buyp1').onclick(function(){
    var oldPriceString = $('pprice');
    var intPrice = parseInt(oldPriceString);
    console.log("the price is " + intPrice + " of data type " + typeof(intPrice));

})