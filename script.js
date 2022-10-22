console.log("Hello!");

let operationsArray = [];
const OPERATIONS = ["+", "-", "/", "*"];
let multOrDivResult = 0;

function resetSelectedClass() {
  const currentBtnOperatorSelected =
    document.getElementsByClassName("selected");
  if (currentBtnOperatorSelected.length > 0) {
    currentBtnOperatorSelected[0].classList.remove("selected");
  }
}

function resetCalculator() {
  const input = document.getElementById("resultBar");
  operationsArray = [];
  input.value = "";
  input.dataset.raw = "";
  resetSelectedClass();
}

function showResult(event) {
  const input = document.getElementById("resultBar");
  if (operationsArray.length === 0) {
    if (!input.value) {
      input.value = "0";
    } else {
      // if there is input but the length is 0 it means we are operating a mult or a div, so we show the stored results
      input.value = input.dataset.raw;
    }
    return;
  } else if (operationsArray.length > 3) {
    operatorClicked(event); //operator clicked will delete the last operator so we can have only 3 items in the array
    input.value = operate(
      operationsArray.at(-2),
      operationsArray.at(-3),
      operationsArray.at(-1)
    );
  } else if (operationsArray.length < 3) {
    operationsArray.push(input.dataset.raw);
    input.value = operate(
      operationsArray.at(-2),
      operationsArray.at(-3),
      operationsArray.at(-1)
    );
  }
}

function operate(operator, firstOperator, secondOperator) {
  switch (operator) {
    case "+":
      return +firstOperator + +secondOperator;
    case "-":
      return +firstOperator - +secondOperator;
    case "*":
      return +firstOperator * +secondOperator;
    case "/":
      if (isFinite(firstOperator / secondOperator)) {
        return (firstOperator / secondOperator).toFixed(5);
      }
      alert("SyntaxError");
      resetCalculator();
  }
}

function updateResultBar(key) {
  const input = document.getElementById("resultBar");
  if (OPERATIONS.includes(key)) {
    if (!input.dataset.raw) {
      operationsArray.pop();
      operationsArray.push(key);
      // if there's no input it means we're just changing one operator from another
      if (["*", "/"].includes(operationsArray.at(-1))) {
        input.value = operationsArray.at(-2);
      } else {
        input.value = operate(
          operationsArray.at(-3),
          operationsArray.at(-2),
          operationsArray.at(-4)
        );
        if (input.value == "undefined") {
          input.value = operationsArray.at(-2);
        }
      }
    } else {
      operationsArray.push(input.dataset.raw);
      operationsArray.push(key);
      if (["+", "-"].includes(key) && operationsArray.length > 3) {
        input.value = operate(
          operationsArray[1],
          operationsArray[0],
          operationsArray[2]
        );
      } else {
        input.value = input.dataset.raw;
      }
      input.dataset.raw = "";
    }
  } else {
    input.dataset.raw += key;
    input.value = input.dataset.raw;
    //if there's 4 items in the array and we type a digit, we operate the first 3 positions, push the result, and keep only the result and the operator
    if (
      operationsArray.length > 3 &&
      ["+", "-"].includes(operationsArray.at(-1)) // we only do it if the next operation is sum of sub
    ) {
      operationsArray.push(
        operate(operationsArray[1], operationsArray[0], operationsArray[2])
      ); // if we're doing a sum it means it's the only 3 items left in the array, so we can index them with 0,1,2
      operationsArray = operationsArray.slice(3);
      operationsArray.reverse();
    } else if (
      ["*", "/"].includes(operationsArray.at(-1)) &&
      operationsArray.length > 3
    ) {
      operationsArray.push(input.dataset.raw); // operates the immediate mult of divide operation
      tempResult = operationsArray.slice(-3); //only operate on the last 3 items of the array because is where the operations is, keep the rest as is
      operationsArray = operationsArray.slice(0, -3);
      input.dataset.raw = operate(
        tempResult.at(-2),
        tempResult.at(-3),
        tempResult.at(-1)
      );
    }
  }
  console.log(operationsArray);
}

function numberClicked(event) {
  resetSelectedClass();
  btnNumberElement = event.target;
  updateResultBar(btnNumberElement.value);
}

function operatorClicked(event) {
  resetSelectedClass();
  const btnOperatorElement = event.target;
  if (
    btnOperatorElement.value === "=" &&
    OPERATIONS.includes(operationsArray.at(-1))
  ) {
    operationsArray.pop();
  } else {
    btnOperatorElement.classList.add("selected");
    updateResultBar(btnOperatorElement.value);
  }
}

const numbers = document.getElementsByClassName("number");
const operators = document.getElementsByClassName("operator");

const btnReset = document.getElementById("reset");
btnReset.addEventListener("click", resetCalculator);

const btnEqual = document.getElementById("equal-btn");
btnEqual.addEventListener("click", showResult);

for (let i = 0; i < numbers.length; i++) {
  numbers[i].addEventListener("click", numberClicked);
}
for (let i = 0; i < operators.length; i++) {
  operators[i].addEventListener("click", operatorClicked);
}
