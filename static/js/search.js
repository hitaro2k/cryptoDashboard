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

async function fetchData(symbol) {

}

function renderList(data) {
    searchList.innerHTML = '';
    const ul = document.createElement('ul');
    const liName = document.createElement("li")
    const liLink = document.createElement("a")


    searchList.appendChild(ul);
    ul.appendChild(liLink)
    ul.appendChild(liName)
}
