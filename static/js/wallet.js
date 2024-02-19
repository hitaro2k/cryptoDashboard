
const connectWalletButton = document.getElementById('connectWallet');
const disconnectWalletButton = document.getElementById('disconnectWallet');
const idAccountEl = document.querySelector("#idAccount")
let connectedWalletAddress = null;
const searchStrokeTop = document.querySelector("#search-stroke__top")
function getAccount(){
  connectWalletButton.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        connectedWalletAddress = accounts[0];
        localStorage.setItem("key" , accounts)
        console.log(accounts)
        connectWalletButton.style.display = "none"
        disconnectWalletButton.classList.add('active-btn')
        idAccountEl.textContent = localStorage.getItem("key")
        window.location.href = "/auth1/wallet"
      } catch (error) {
        console.error('Ошибка при подключении к кошельку:', error);
      }
    } else {
      console.log('Пожалуйста, установите MetaMask!');
    }
  });

  disconnectWalletButton.addEventListener('click', () => {
    connectedWalletAddress = null;
    disconnectWalletButton.classList.remove('active-btn')
    connectWalletButton.style.display = "block"
    localStorage.removeItem("key")
    idAccountEl.textContent = "Your wallet account"
    window.location.href = "/auth1/offline"
  });

  idAccountEl.textContent = localStorage.getItem("key")

}

function checkState(){
  const currentPath = window.location.pathname;
  localStorage.setItem("state" , "offline")
  const link = document.createElement('a');
  link.href = '/login';
  link.textContent = 'Login';
  link.classList.add('redirect-link');

  if(!currentPath.includes("/auth1/offline")){
     searchStrokeTop.appendChild(link)
     localStorage.setItem("state" , "wallet")
     connectWalletButton.style.display = "none"
     disconnectWalletButton.classList.add('active-btn')
  }else{
      localStorage.setItem("state" , "offline")
      connectWalletButton.style.display = "block"
      disconnectWalletButton.classList.remove('active-btn')
  }
}

async function getEthBalance() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const account = accounts[0];
            const web3 = new Web3(window.ethereum);
            const balanceWei = await web3.eth.getBalance(account);
            const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
            console.log('Баланс ETH на вашем кошельке MetaMask:', balanceEth);
        } catch (error) {
            console.error('Произошла ошибка:', error);
        }
    } else {

        console.error('Пожалуйста, установите и подключите MetaMask!');
    }
}


getEthBalance()
checkState()
getAccount()
