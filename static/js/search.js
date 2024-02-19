let userInputArr = [];
const userInput = document.querySelector("#user-input");
const searchList = document.querySelector(".search-stroke__list");

userInput.addEventListener('input', async (event) => {
  const searchString = event.target.value.trim();
  if (searchString.length > 0) {
    const response = await fetch(`/search-transaction?searchString=${searchString}`);
    const data = await response.json();

    renderList(data)
  }
});

// userInput.onkeydown = (event) => {
//   if (event.key === "Backspace") {
//     userInputArr[0] = userInputArr[0].slice(0, -1);
//
//     if(userInput.value == "" || userInput.length == 0){
//         console.log('ebr')
//     }
//   }
// };
// if(userInput.value == ""){
//     console.log('ebr')
// }

function fetchData(coin) {
  fetch('/search-transaction', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ coin: coin })
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);

  })
  .catch(error => {
    console.error('Ошибка при выполнении запроса:', error);
  });
}

function renderList(data) {
    const ul = document.createElement('ul');

    data.forEach(transaction => {
        const li = document.createElement('li');
        li.textContent = `Amount: ${transaction.amount}`;
        ul.appendChild(li);
    });

    searchList.innerHTML = '';
    searchList.appendChild(ul);
}
