var socket = io();
$('#buyp1').click(function () {
    var value = document.getElementById('pprice').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    if (newPriceInt) {
        socket.emit('purchase product1', newPriceInt);
    }
    return false;
})


socket.on('purchase product1', function (price) {
    //replace text
    console.log(price);
    var value = document.getElementById('pprice');
    var replacePara = document.createElement("label");
    replacePara.innerHTML = price;
    document.body.replaceChild(replacePara, value);


});



