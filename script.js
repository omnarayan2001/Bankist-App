'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2024-10-23T14:11:59.604Z',
    '2024-10-27T17:01:17.194Z',
    '2024-10-28T23:36:17.929Z',
    '2024-10-31T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2024-10-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

// function that formats dates according to transaction dates in movementsDates array
const formatMovementDate = function (date, locale) {
  // function to calculate days past from current date
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / 1000 / 60 / 60 / 24);

  // variable holding the datys passed
  const daysPassed = calcDaysPassed(new Date(), date);
  // console.log(daysPassed);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  //   const day = date.getDate(); // .padStart(2,0) in order to add 0 at start if less than 10
  //   const month = date.getMonth() + 1;
  //   const year = date.getFullYear();

  //   return `${day < 10 ? '0' + day : day}/${
  //     month < 10 ? '0' + month : month
  //   }/${year}`;
  // };

  return new Intl.DateTimeFormat(locale).format(date);
};

const formatCur = function (value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
};

const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date, acc.locale);

    const formattedMov = formatCur(mov, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>

          <div class="movements__date">${displayDate}</div>
          
          <div class="movements__value">${formattedMov}</div>
        </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  const formattedMov = formatCur(
    account.balance,
    account.locale,
    account.currency
  );

  account.balance = formattedMov;
  labelBalance.textContent = `${account.balance}`;
};

const calDisplaySummary = function (account) {
  const income = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);

  const formattedInc = formatCur(income, account.locale, account.currency);
  labelSumIn.textContent = `${formattedInc}`;

  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);

  const formattedOut = formatCur(
    Math.abs(out),
    account.locale,
    account.currency
  );

  labelSumOut.textContent = `${formattedOut}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => account.interestRate * deposit)
    .filter(val => val >= 1)
    .reduce((acc, cur) => acc + cur, 0);

  const formattedInt = formatCur(interest, account.locale, account.currency);

  labelSumInterest.textContent = `${formattedInt}`;
};

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(intials => intials[0])
      .join('');
  });
};

const updateUI = function (currentAccount) {
  // Display movements
  displayMovements(currentAccount);
  // Display balance
  calcDisplayBalance(currentAccount);
  // Display summary
  calDisplaySummary(currentAccount);
};
createUserNames(accounts);

const startLogOutTimer = function () {
  let time = 300;
  const tick = function () {
    const min = Math.trunc(time / 60);
    const sec = time % 60;

    // in each call , print the reaming time to UI
    labelTimer.textContent = `${min < 10 ? '0' + min : min}:${
      sec < 10 ? '0' + sec : sec
    }`;

    // When 0 seconds, stops the timer and log out user

    if (time === 0) {
      clearInterval(timer);
      containerApp.classList.remove('show');
      labelWelcome.textContent = `Log in to get started`;
    }

    // decrease 1s
    time = time - 1;
  };
  // set time to 5 mins

  // call the timer every second
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
// Event handlers

let currentAccount;
let timer;
// FAKE ALWAYS LOGGED IN

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 1;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.trimEnd().trimStart()
  );

  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();
    inputLoginUsername.blur();
    // Display UI and welcome message

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;

    // create current date and time
    // const now = new Date();
    // const date = now.getDate();
    // const month = now.getMonth() + 1;
    // const year = now.getFullYear();
    // const hour = now.getHours();
    // const minutes = now.getMinutes();
    // labelDate.textContent = `${date < 10 ? '0' + date : date}/${
    //   month < 10 ? '0' + month : month
    // }/${year}, ${hour < 10 ? '0' + hour : hour}:${
    //   minutes < 10 ? '0' + minutes : minutes
    // }`;

    // Experimenting with API
    const now = new Date();

    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      // weekday: 'long',
      hour: 'numeric',
      minute: 'numeric',
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      currentAccount.locale,
      options
    ).format(now);

    timer = startLogOutTimer();
    updateUI(currentAccount);

    containerApp.classList.add('show'); // or containerApp.style.opacity = 1;
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => inputTransferTo.value === acc.username
  );
  console.log(receiverAcc);

  if (
    receiverAcc &&
    amount > 0 &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Update UI
    updateUI(currentAccount);

    clearInterval(timer);
    // inputTransferTo.value = '';
    // inputTransferAmount.value = '';
    // inputTransferTo.blur();
    // inputTransferAmount.blur();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    // Add the amount to the movement
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // Add Loan Date
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update UI
      updateUI(currentAccount);
    }, 3500);
  } else {
    alert('Please enter a valid amount !');
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => currentAccount.username === acc.username
    );
    console.log(index);

    // Delete Account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.classList.remove('show'); //
    labelWelcome.textContent = 'Login to get started';
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log(23 === 23.0);

// base 10 -> 0 to 9
// binary base 2 -> 0 to 1

console.log(0.1 + 0.2);
console.log(0.1 + 0.2 === 0.3);

console.log('23'); // string
console.log(Number('23')); // string converted to number
console.log(+'23'); // string converted to number with type coercion

// parsing
console.log(Number.parseInt('30', 10));
console.log(Number.parseFloat('edp23', 10));

console.log(Number.parseInt('2.5rem', 10));
console.log(Number.parseFloat('2.5rem', 10));

// check if value is NaN
console.log(Number.isNaN(20));
console.log(Number.isNaN('20'));
console.log(Number.isNaN(+'20X'));
console.log(Number.isNaN(20 / 0));

// checking if value is number (better than .isNaN)
console.log('------');
console.log(Number.isFinite(20));
console.log(Number.isFinite('20'));
console.log(Number.isFinite(+'20X'));
console.log(Number.isFinite(20 / 0));

console.log('--------');

console.log(Number.isInteger(23));
console.log(Number.isInteger(23.0));
console.log(Number.isInteger(23 / 2));

console.log(Math.sqrt(25));
console.log(25 ** (1 / 2));
console.log(8 ** (1 / 3));

console.log(Math.max(5, 18, 23, 43, 22));
console.log(Math.max(5, 18, 23, '43', 22)); // does type coercion
console.log(Math.max(5, 18, 23, '43px', 22)); // not parsing

console.log(Math.min(5, 18, 23, 43, 22));

console.log(Math.PI);
console.log(Math.PI * Number.parseFloat('5px') ** 2);

console.log(Math.trunc(Math.random() * 6) + 1);

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min) + min) + 1;
console.log(randomInt(10, 20));

// rounding integers (they do type corecion)
console.log(Math.trunc(23.3));
console.log(Math.round(23.6));

console.log(Math.ceil(23.3));
console.log(Math.round(23.6));

console.log(Math.floor(23.3));
console.log(Math.floor(23.6));

// floor vs trunc
console.log(Math.trunc(-23.6));
console.log(Math.floor(-23.6));
// floor is slightly better as it works for both negative and positive integers

// rounding decimals
console.log((27.7).toFixed(0)); // return type is string
console.log(+(27.73243435).toFixed(3)); // converted to string using type coercion

// remainder operator
console.log(5 % 2);
console.log(6 % 2);

const isEven = n => (n % 2 === 0 ? 'Even Number' : 'Odd Number');
console.log(isEven(4));
console.log(isEven(3));

labelBalance.addEventListener('click', function () {
  Array.from(document.querySelectorAll('.movements__row'), (row, i) => {
    if (i % 2 === 0) {
      row.style.backgroundColor = 'orangered';
      console.log(row.textContent);
    }

    if (i % 2 !== 0) {
      row.style.backgroundColor = 'rgba(133, 122, 200, 0.8)';
    }
  });
});

// Numeric separators
const diameter = 287_460_000000;
console.log(diameter);

const price = 345_99;
console.log(price);

const transferFee = 15_00;
const transferFee2 = 1_500;
console.log(transferFee, transferFee2);

const PI = 3.1415;

console.log(Number('23000'));
console.log(Number.parseInt(`23_000`));

console.log(Number('23_000')); // // this will return NaN
// so never use numeric separators in strings like above as they might introduce bugs

// BigInt

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);

console.log(9007199254740991334332n);
console.log(BigInt(928278372322));

console.log(10000n + 1000000000n);

console.log(23243544545453343n * 10000000n);

const huge = 54334323454343n;
const num = 2;
// console.log(huge * num); // Cannot mix BigInt and other types, use explicit conversions
// console.log(Math.sqrt(16n)); Math operations also does not work with bigint

console.log(huge * BigInt(num));

// exceptions
console.log(20n > 15); // true
console.log(20n === 20); // false , because '===' operator does not do type coercion , 20n is bigint and 20 is regular number
console.log(typeof 20n);
console.log(20n == 20); // true , because '==' operator does type coercion
console.log(20n == '20'); // true , type coercion will convert string to number

console.log(huge + ' is REALLY BIG');

// Division
console.log(11n / 3n); // returns the closest integer of type bigint
console.log(11 / 3);

// create a date
/*
const now = new Date();
console.log(now);

console.log(new Date('Tue Oct 29 2024'));

console.log(new Date('December 25, 2024'));

console.log(new Date('2019-11-18T21:31:17.178Z'));

console.log(new Date(2037, 9, 18, 15, 23, 5));
console.log(new Date(2037, 9, 33, 15, 23, 5)); // js autocorrects the date

console.log(new Date(0));
console.log(new Date(3 * 24 * 60 * 60 * 1000));
*/

// working with dates

// const future = new Date(2037, 9, 18, 15, 23);
// console.log(future);
// console.log(future.getFullYear());
// console.log(future.getMonth());
// console.log(future.getDate());
// console.log(future.getDay());
// console.log(future.getHours());
// console.log(future.getMinutes());
// console.log(future.getSeconds());

// console.log(future.toISOString());

// console.log(future.getTime());
// console.log(new Date(2139472380000));

// console.log(Date.now());

// future.setFullYear(2040);
// console.log(future);

// const tempdate = new Date(
//   `Tue Oct 29 2024 20:22:44 GMT+0530 (India Standard Time`
// );
// console.log(tempdate.toLocaleString('en-US', { timeZone: 'PST' }));

const future = new Date(2037, 9, 18, 15, 23);
console.log(future);
console.log(Number(future));

const calcDaysPassed = (date1, date2) =>
  Math.abs(date2 - date1) / 1000 / 60 / 60 / 24;

console.log(calcDaysPassed(new Date(2037, 3, 24), new Date(2037, 3, 14)));

// IMPORTANT EXPLATION

// Define the first user-defined method
function method1() {
  return {
    method2: function () {
      return 'Hello from method2!';
    },
  };
}

// Use console.log to call method1 and then method2
console.log(method1().method2());
// Output: Hello from method2!

/* In this example, method1 returns an object, and method2 is a method on that object. 
When you call method1().method2(), it first executes method1 to get the object, 
then calls method2 on that returned object.
This technique allows you to chain methods together as long as each method returns an 
appropriate object or value that supports the subsequent method call. */

const number = 3884764.23;

const options = {
  style: 'currency',
  unit: 'celsius',
  currency: 'EUR',
  // useGrouping: false,
};
console.log('US: ', new Intl.NumberFormat('en-US', options).format(number));

console.log(
  'Germany: ',
  new Intl.NumberFormat('de-DE', options).format(number)
);

console.log('India: ', new Intl.NumberFormat('en-IN', options).format(number));

// setTimeout
const ingredients = ['olives', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) => {
    console.log(`You pizza with ${ing1} and ${ing2} has arrived 🍕`);
  },
  3000,
  ...ingredients
);
console.log('waiting...');

if (ingredients.includes('spinach')) {
  clearTimeout(pizzaTimer);
}

// setInterval
// let secs = 3;
// const countDown = setInterval(() => {
//   if (secs <= 0) {
//     clearInterval(countDown);
//   }
//   console.log(secs);
//   secs = secs - 1;
// }, 1000);
