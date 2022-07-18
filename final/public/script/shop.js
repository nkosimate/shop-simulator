var socket = io();
$('#buyp1').click(function () {
    var value = document.getElementById('pprice').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product1', newPriceInt);
})

$('#buyp2').click(function () {
    var value = document.getElementById('pprice2').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product2', newPriceInt);
})

$('#buyp3').click(function () {
    var value = document.getElementById('pprice3').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product3', newPriceInt);
})

$('#buyp4').click(function () {
    var value = document.getElementById('pprice4').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product4', newPriceInt);
})

$('#buyp5').click(function () {
    var value = document.getElementById('pprice5').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product5', newPriceInt);
})

$('#buyp6').click(function () {
    var value = document.getElementById('pprice6').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product6', newPriceInt);
})

$('#buyp7').click(function () {
    var value = document.getElementById('pprice7').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product7', newPriceInt);
})

$('#buyp8').click(function () {
    var value = document.getElementById('pprice8').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product9', newPriceInt);
})

$('#buyp9').click(function () {
    var value = document.getElementById('pprice9').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product9', newPriceInt);
})

$('#buyp10').click(function () {
    var value = document.getElementById('pprice10').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product10', newPriceInt);
})

socket.on('purchase product1', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product2', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice2');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product3', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice3');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product4', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice4');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product5', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice5');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product6', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice6');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product7', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice7');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product8', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice8');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product9', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice9');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('purchase product10', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice10');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

//-----------------------------when the sell button is pressed-------------------------------

$('#sellp1').click(function () {
    var value = document.getElementById('pprice').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product1', newPriceInt);
})

$('#sellp2').click(function () {
    var value = document.getElementById('pprice2').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product2', newPriceInt);
})

$('#sellp3').click(function () {
    var value = document.getElementById('pprice3').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product3', newPriceInt);
})

$('#sellp4').click(function () {
    var value = document.getElementById('pprice4').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product4', newPriceInt);
})

$('#sellp5').click(function () {
    var value = document.getElementById('pprice5').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product5', newPriceInt);
})

$('#sellp6').click(function () {
    var value = document.getElementById('pprice6').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product6', newPriceInt);
})

$('#sellp7').click(function () {
    var value = document.getElementById('pprice7').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product7', newPriceInt);
})

$('#buyp8').click(function () {
    var value = document.getElementById('pprice8').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt + 5;
    socket.emit('purchase product9', newPriceInt);
})

$('#sellp9').click(function () {
    var value = document.getElementById('pprice9').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product9', newPriceInt);
})

$('#sellp10').click(function () {
    var value = document.getElementById('pprice10').textContent;
    var oldPriceInt = parseInt(value);
    var newPriceInt = oldPriceInt - 5;
    socket.emit('sell product10', newPriceInt);
})

socket.on('sell product1', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product2', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice2');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product3', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice3');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product4', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice4');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product5', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice5');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product6', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice6');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product7', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice7');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product8', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice8');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product9', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice9');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});

socket.on('sell product10', function (price) {
    //replace text 
    //console.log(price);
    const oldlabel = document.getElementById('pprice10');
    const element = document.createElement("label");
    element.innerHTML = price;

    oldlabel.parentNode.replaceChild(element, oldlabel);

});





