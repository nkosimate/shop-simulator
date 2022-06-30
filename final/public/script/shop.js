function onclick(){
    var oldPriceText = document.getElementById('pprice');
    var intoldprice = parseInt(oldPriceText);
   
if ($_POST['action'] == 'buy') {
    //price goes up by 
    var newprice = intoldprice + 5;
    document.getElementById('pprice').innerText.replace(oldPriceText,newprice);
} else {
    var newprice = intOldPrice -5;
    //price goes down by 5
    document.getElementById('pprice').innerText.replace(oldPriceText,newprice);
}
}