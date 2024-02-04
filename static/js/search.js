let userInputArr = [];
const userInput = document.querySelector("#user-input");
const searchList = document.querySelector(".search-stroke__list");

userInput.oninput = (event) => {
  const item = event.data;
  if (item) {
    userInputArr.length === 0 ? userInputArr.push(item) : userInputArr[0] += item;

    console.log(userInputArr);

    if (userInputArr[0].length >= 3) {
      fetchData(userInputArr[0]);
    }
  }
};

userInput.onkeydown = (event) => {
  if (event.key === "Backspace") {
    userInputArr[0] = userInputArr[0].slice(0, -1);
    console.log(userInputArr);
  }
};

async function fetchData(symbol) {
  const apiKey = '47e4f21a0ca0f5834f9d60d1cbb648c4f46f7df0bdefa1b239daec57127f1695';
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=${apiKey}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    renderList(data)
    console.log(data);


  } catch (error) {
    console.error('Fetch error:', error);
  }
}

function renderList(data) {
    searchList.innerHTML = '';
    const ul = document.createElement('ul');
    const liName = document.createElement("li")
    const liLink = document.createElement("a")
    const objCryptoName = userInputArr[0]
    const objCryptoPrice = Object.values(data.RAW)[0].USD.PRICE.toFixed(2);

    liName.innerHTML = objCryptoName.toUpperCase() + " " +  objCryptoPrice


    searchList.appendChild(ul);
    ul.appendChild(liLink)
    ul.appendChild(liName)
}
