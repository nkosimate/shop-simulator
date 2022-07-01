var socket =io();
$('#myform1').submit(function(){
    var oldPriceString = $('pprice').text();
    alert("the price is " + oldPriceString + " of data type " + typeof(oldPriceString));

})