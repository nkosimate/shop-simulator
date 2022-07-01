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
    const element = document.createElement("label");
    const textnode = document.createTextNode(toString(price));
    element.appendChild(textnode);

    const oldlabel = toString(document.getElementById('pprice').textContent);
    document.body.replaceChild(element,oldlabel);


});



