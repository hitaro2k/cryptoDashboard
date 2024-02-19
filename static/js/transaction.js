const openTransactionPopupBtn = document.querySelector('.title-transaction__adder ')
const popupTransaction = document.querySelector('.add_transaction')
const closeTransactionPopupBtn = document.querySelectorAll(".close-popup")
const transactionInfoBlock = document.querySelector(".select__transaction-options")
const transactionSetMoney = document.querySelector('.transaction_block')
const setMoneyBlock = document.querySelector('.transaction_block')
const selectOptions = document.querySelector('.select__transaction-options')


openTransactionPopupBtn.onclick =  ()=>{
    popupTransaction.style.display = "flex"
    setMoneyBlock.style.display = "flex"
}
closeTransactionPopupBtn.forEach(item =>{
    item.onclick = ()=>{
        selectOptions.style.display = "none"
        popupTransaction.style.display = "none"
    }
})

const setbarItem = document.querySelectorAll('.setbar-item')
const listItems = document.querySelectorAll('.setbar-list .setbar-item');

listItems.forEach(function(item) {

    item.addEventListener('mouseenter', function() {

      listItems.forEach(function(otherItem) {
        otherItem.classList.remove('active');
      });
      item.classList.add('active');
    });
});


const list = document.querySelector('.setbar-list');
list.addEventListener('mouseleave', function() {
    listItems.forEach(function(item) {
      item.classList.remove('active');
    });
});


const cryptoBar = document.querySelectorAll(".crypto-assets")
const buyBlockItemTitle = document.querySelector(".buy-block__crypto-title")
const buyBlockItemImage = document.querySelector(".buy-block__crypto-image")

cryptoBar.forEach(item =>{
    item.onmouseenter = ()=>{
        item.style.background = "#b4a9ff1c"
        item.style.borderRadius = "10" + "px"
    }
    item.onmouseleave = ()=>{
        item.style.background = "transparent"
    }
    item.onclick = ()=>{
        let imgAssetsCrypto = item.querySelector('.crypto-img')
        let titleAssetsCrypto = item.querySelector('.title')

        buyBlockItemTitle.innerHTML = titleAssetsCrypto.textContent
        buyBlockItemImage.src = imgAssetsCrypto.src
        fetchToServer([titleAssetsCrypto.textContent] , titleAssetsCrypto.textContent)

       transactionInfoBlock.style.display = "flex"
        transactionSetMoney.style.display = 'none'

    }

})

function setDataTransaction(){
     const currentDate = new Date();
     const formattedDateTime = currentDate.getDate() + '.' +
                            (currentDate.getMonth() + 1) + '.' +
                            currentDate.getFullYear() + ' ' +
                            currentDate.getHours() + ':' +
                            currentDate.getMinutes()

    const dataTransaction = document.querySelector(".data")

    dataTransaction.innerHTML =  formattedDateTime;
}

async function fetchToServer(symbol , titleAssets) {
  const apiKey = '47e4f21a0ca0f5834f9d60d1cbb648c4f46f7df0bdefa1b239daec57127f1695';
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`;
  const title = titleAssets;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();

    const priceCrypto = data.RAW[title].USD.PRICE.toFixed(2)
    const inputPrice = document.querySelectorAll(".input-price")
      const countCoinsList = document.querySelectorAll(".input-quantity")

    inputPrice.forEach(item =>{
        item.innerHTML = priceCrypto
    })
    const totalPrice = document.querySelectorAll(".total-spent")

    let numberArray = [];
    
    countCoinsList.forEach((item, index) => {
    item.addEventListener("input", (event) => {
            const inputValue = event.target.value;
            const parsedNumber = parseFloat(inputValue);

            if (!isNaN(parsedNumber)) {
                numberArray[index] = parsedNumber;
            } else if (event.inputType === "deleteContentBackward") {
                numberArray.pop();
            }

            let quantity = numberArray.reduce((acc, num) => acc + num, 0);

            totalPrice.forEach((totalPriceItem, i) => {
                let totalPriceStr = quantity * inputPrice[i].textContent + "$";
                let totalPriceInt = parseInt(totalPriceStr);

                totalPriceItem.innerHTML = totalPriceInt.toFixed(2);

            });

        });
    });

  } catch (error) {
    console.error('Fetch error:', error);
  }
}


const addTransactionBtn = document.querySelector('.btn__add-transaction')
addTransactionBtn.onclick = ()=>{
    transactionOption()
}

function transactionOption(){
    const coinName = document.querySelector('.buy-block__crypto-title').textContent;
    let totalSent = document.querySelector('.input-quantity').value;
    const idReceipter = document.querySelector('.idusers').textContent;
    const checkBtn = document.querySelector("#sell-btn")

    // Сумма аккаунта
    const totalAmountSum = document.getElementById('totalValue').textContent;
    // Cумма акаакунта в флоат
    const totalAmountInt = parseFloat(totalAmountSum)

    // Кол-во монет
    const totalSentInt = parseFloat(totalSent)

    const totalAmountEl = document.getElementById('totalValue');
    // Цена монеты
    const totalSumEl = document.querySelector(".input-price").textContent
    const totalSumElInt = parseFloat(totalSumEl)

    // Общая сумма (умножения кол-во монет на сумму за 1 монету)
    let totalSum = totalSumElInt * totalSentInt

    const totalBalance = document.querySelector("#totalValue").textContent
    let totalBalanceInt = 0;
    const sellBtn = document.querySelector("#sell-btn")

   totalSum = (sellBtn.classList.contains("active-click")) ? -totalSum : totalSum;

   totalBalanceInt = parseFloat(totalBalance) + totalSum;

   totalSent = checkBtn.classList.contains("active-click") ? -parseFloat(totalSent) : parseFloat(totalSent);
    const data = document.querySelector(".data").textContent
    console.log(data)
    // Айди Кол-во Монет Название Баланс
    const resArray = [parseFloat(idReceipter) , parseFloat(totalSent), coinName ,totalBalanceInt , data];

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/transaction-handler", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log("Data successfully sent to Python");
            updatePageData(totalSent)
             closeForm()
        } else {
            console.error("Error sending data to Python", resArray);
        }
    };

    xhr.send(JSON.stringify({data: resArray}));
}
function updatePageData(totalSent) {
    // Сумма аккаунта
    const totalAmountSum = document.getElementById('totalValue').textContent;
    // Cумма акаакунта в флоат
    const totalAmountInt = parseFloat(totalAmountSum)

    // Кол-во монет
    const totalSentInt = parseFloat(totalSent)

    const totalAmountEl = document.getElementById('totalValue');
    // Цена монеты
    const totalSumEl = document.querySelector(".input-price").textContent
    const totalSumElInt = parseFloat(totalSumEl)


    // Общая сумма (умножения кол-во на сумму за 1 монету)
    const totalSum = totalSumElInt * totalSentInt

    totalAmountEl.textContent =  totalSum + totalAmountInt;

}

function closeForm() {

    const formElement = document.querySelector('.add_transaction');
    const buyForm = document.querySelector(".buy-block")
    buyForm.reset()
    formElement.style.display = 'none';
}

document.addEventListener("DOMContentLoaded" , ()=>{
    const setbarBuyBtn = document.querySelector("#buy-btn")
    const setbarSellBtn = document.querySelector("#sell-btn")

    setbarBuyBtn.onclick = ()=>{
        if(setbarSellBtn.classList.contains("unactive-click")){
           setbarBuyBtn.classList.add("active-click")
           setbarSellBtn.classList.remove("active-click")
        }
    }
    setbarSellBtn.onclick = ()=>{
        if(setbarBuyBtn.classList.contains("unactive-click")){
            setbarSellBtn.classList.add("active-click")
            setbarBuyBtn.classList.remove("active-click")
        }
    }
})





setDataTransaction()
