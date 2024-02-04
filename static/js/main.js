
const prices = document.querySelectorAll(".change_price-title");
prices.forEach(item =>{
    if(item.textContent < 1){
        item.style.color = "red"
    }else{
        item.style.color = "#0addae"
    }
})

