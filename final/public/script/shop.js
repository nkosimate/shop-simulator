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
    const newNode = document.createTextNode(price);
    const element = document.getElementById("pprice");
    element.replaceChild(newNode, element);

});  



