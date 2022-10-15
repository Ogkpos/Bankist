"use strict";
// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    //'2020-05-27T17:01:17.194Z',
    "2022-10-10T17:01:17.194Z",
    //'2020-07-11T23:36:17.929Z',
    "2022-10-12T23:36:17.929Z",
    //'2020-07-12T10:51:36.790Z',
    "2022-10-14T10:51:36.790Z",
  ],
  currency: "USD",
  locale: "en-US", // de-DE
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "EUR",
  locale: "pt-PT",
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    "2021-02-09T13:16:18.490Z",
    "2021-03-12T13:16:32.787Z",
    "2021-07-10T12:16:48.523Z",
    "2021-02-01T13:17:03.658Z",
    "2020-05-20T12:19:44.638Z",
    "2020-06-11T12:20:06.605Z",
    "2022-08-04T12:20:20.877Z",
    "2020-10-28T12:20:46.384Z",
  ],
  currency: "CAD",
  locale: "en-CA",
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    "2021-05-17T12:22:59.442Z",
    "2020-03-17T12:23:16.299Z",
    "2020-06-28T12:23:34.993Z",
    "2020-09-13T12:23:54.089Z",
    "2020-11-30T13:24:10.887Z",
  ],
  currency: "EUR",
  locale: "es",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

//Format number to display correct currency
const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
};

//Format dates
const formatMovementsDate = function (locale, date) {
  const CalcDaysPassed = (date1, date2) =>
    Math.round(Math.abs((date2 - date1) / (24 * 60 * 60 * 1000)));
  const daysPassed = CalcDaysPassed(new Date(), new Date(date));
  

  if (daysPassed === 0) return `Today`;
  if (daysPassed === 1) return `Yesterday`;
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale).format(date);
};
formatMovementsDate(navigator.language, new Date());
//Render Movements
const RenderMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const formattedMov = formatCur(mov, acc.locale, acc.currency);
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementsDate(acc.locale, date);
    
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__date">${displayDate}</div>
      <div class="movements__value">${formattedMov}</div>
    </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};


//Creating Username
const createUsername = function (acc) {
  //Adding username to object
  acc.forEach((user) => {
    user.username = user.owner
      .toLowerCase()
      .split(" ")
      .map((user) => user[0])
      .join("");
  });
};
createUsername(accounts);


//Updating UI
const updateUI = function (acc) {
  //Render movements
  RenderMovements(acc);
  //Render total Movements
  renderBalance(acc);
  //Render Summary
  renderSummary(acc);
};

//Adding movements together(Balance)
const renderBalance = function (acc) {
  //Adding balance to object
  acc.balance = acc.movements.reduce((acc, cur) => acc + cur, 0);
  const formattedMov = formatCur(acc.balance, acc.locale, acc.currency);
  labelBalance.textContent = `${formattedMov}`;
};
renderBalance(account1);

//Render Summary to UI
const renderSummary = function (acc) {
  const income = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  const formattedMov = formatCur(income, acc.locale, acc.currency);
  labelSumIn.textContent = `${formattedMov}`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${formatCur(
    Math.abs(out),
    acc.locale,
    acc.currency
  )}`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((mov) => (mov * acc.interestRate) / 100)
    .filter((mov, i, arr) => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${formatCur(
    interest,
    acc.locale,
    acc.currency
  )}`;
};


//Computing Logout Timer
const startlogoutTimer = function () {
  //set time to 5 minutes
  let time = 25;
  const tick = () => {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    if (time === 0){  
      clearInterval(timer)
     // containerApp.style.opacity=0
      labelWelcome.textContent=`Login to get Started`
    }
    //Decrease time by 1 sec
    --time;
    labelTimer.textContent = `${min}:${sec}`;
  };
  //
  tick()
  const timer=setInterval(tick, 1000);
  return timer
};


//Handling Events
let currentAccount,timer;
btnLogin.addEventListener("click", (e) => {
  //prevent form from submitting
  e.preventDefault();
  //setting username
  currentAccount = accounts.find(
    (mov) => mov.username === inputLoginUsername.value
  );
  //setting password
  if (currentAccount?.pin === +inputLoginPin.value) {
    //Display UI and welcome messge
    labelWelcome.textContent = `Welcome, ${currentAccount.owner
      .split(" ")
      .at(0)}`;
    containerApp.style.opacity = 100;

    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = "";
    //Remove focus
    inputLoginPin.blur();

    //Display UI
    updateUI(currentAccount);
    //Create current date and time
    const date = new Date();

    const finalDate = new Intl.DateTimeFormat(currentAccount.locale, {
      day: "numeric",
      minute: "numeric",
      hour: "numeric",
      weekday: "long",
      month: "short",
    }).format(date);
    labelDate.textContent = finalDate;
  }
  //Compute Timer
  if(timer) clearInterval(timer)
  timer=startlogoutTimer()
});

btnTransfer.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );
  
  //Check to make sure User cannot negative amount, a receiver acc exist, cannot send more than he has and currentAccount !==receiverAcc
  if (
    amount > 0 &&
    receiverAcc &&
    amount <= currentAccount.balance &&
    receiverAcc.username !== currentAccount.username
  ) {
    //Add negative movements to currentAccount
    currentAccount.movements.push(-amount);
    //Add positive movements to receiver account
    receiverAcc.movements.push(amount);
    //Add movementDates to currentAccount
    currentAccount.movementsDates.push(new Date().toISOString());
    ////Add movementDates to receiverAccount
    receiverAcc.movementsDates.push(new Date().toISOString());
    //Update UI
    updateUI(currentAccount);
    //Clear input field
    inputTransferTo.value = inputTransferAmount.value = "";
    //compute Timer:Always start timer whenever we perform a task
    if(timer)clearInterval(timer)
    timer=startlogoutTimer()
  }
});

btnClose.addEventListener("click", (e) => {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === +inputClosePin.value
  ) {
    //Calculate Index
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );
    //delete account from accounts array
    accounts.splice(index, 1);
    //Clear input fields
    inputCloseUsername.value = inputClosePin.value = "";
    //Hide UI
    containerApp.style.opacity = 0;
  }
});

btnLoan.addEventListener("click", (e) => {
  e.preventDefault();
  const amount = +inputLoanAmount.value;

  //Check for deposit >10% of amount
  if (
    amount > 0 &&
    currentAccount.movements.some((mov, i) => mov >= amount * 0.1)
  ) {
    //Loan gets approved after 2.5secs
    setTimeout(() => {
      //Add movements to currentAccount
      currentAccount.movements.push(amount);
      //Add movementsDates to currentAccount
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
      //clear input field
      inputLoanAmount.value = "";
      //remove focus
      inputLoanAmount.blur();
      //Compute Timer:Always start timer whenever we perform a task
      if(timer)clearInterval(timer)
      timer=startlogoutTimer()
    }, 2500);
  }
});
labelBalance.addEventListener('click',()=>{
  clearInterval(timer)
  timer=startlogoutTimer()
})
let sorted = false;
btnSort.addEventListener("click", () => {
  RenderMovements(currentAccount.movements, !sorted);
  //Switch between sorts
  sorted = !sorted;
});
