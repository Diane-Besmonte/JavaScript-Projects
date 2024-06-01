const buttons = document.querySelectorAll(".select-item");
const decrement = document.querySelector("#decrement");
const increment = document.querySelector("#increment");
const peopleCount = document.querySelector("#people-count");
const bill = document.querySelector("#total-bill");
const personBill = document.querySelector("#person-bill");
const customTip = document.querySelector("#custom-tip");
const calculateButton = document.querySelector("#calculate");
const resetButton = document.querySelector("#reset");

// Increase person count
increment.addEventListener("click", function () {
  let count = +peopleCount.value + 1;
  peopleCount.value = count;
});

// Decrease person count
decrement.addEventListener("click", function () {
  let count = +peopleCount.value - 1;
  if (peopleCount.value <= 1) {
    throw "You cannot have less than 1 person!";
    return;
  }
  peopleCount.value = count;
});

// Multiple buttons for tip amount
buttons.forEach((button) => {
  button.addEventListener("click", function () {
    const value = button.getAttribute("data-value");
    buttons.forEach((btn) => btn.classList.remove("select-item-active"));
    button.classList.add("select-item-active");
    // console.log(value);
    customTip.value = value;
  });
});

// Calculate total bill per person
calculateButton.addEventListener("click", function () {
  let tip = customTip.value === "" ? (customTip.value = 0) : customTip.value;
  let totalBill = bill.value;
  let personCount = peopleCount.value;
  let tipPercentage = tip / 100;
  let totalTip = tipPercentage * totalBill;
  let totalAmount = +totalBill + totalTip;
  let totalAmoutPerPerson = totalAmount / personCount;

  console.log(totalAmount);
  console.log(totalAmoutPerPerson);

  personBill.value = totalAmoutPerPerson.toLocaleString(undefined, {
    minimumFractionDigits: 2,
  });
});

// Reset the calculator
resetButton.addEventListener("click", function () {
  bill.value = 0;
  customTip.value = "";
  personCount = 1;
  personBill.value = 0.0;
});
