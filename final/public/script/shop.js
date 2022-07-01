var socket =io();
$('#myform1').submit(function(){
    var oldPriceString = $('pprice').text();
    var intPrice = parseInt(oldPriceString);
    alert("the price is " + intPrice + " of data type " + typeof(intPrice));
    if (intPrice){
    }

})