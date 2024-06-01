let displayDay = document.querySelector("#day");
let displayDate = document.querySelector("#date");
let taskInput = document.querySelector("#taskInputBar");
let taskCategory = document.querySelector("#taskType");
let todos = document.querySelector(".todo");
let cardsSection = document.querySelector("#cards");
let closeBtn = document.querySelectorAll(".closeBtn");

// Display Day and Date
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const date = new Date();
displayDay.innerText = days[date.getDay()];
displayDate.innerText = date.toLocaleDateString("en-GB");

// Creates TODO Element
function createTodoElement(content) {
  let label = document.createElement("label");
  label.className = "todo";

  let checkbox = document.createElement("input");
  checkbox.type = "checkbox";

  let span = document.createElement("span");
  span.className = "checkmark";
  span.textContent = content;

  let btn = document.createElement("button");
  btn.className = "closeBtn";
  btn.textContent = "Remove";
  btn.onclick = removeTodo;

  label.appendChild(checkbox);
  label.appendChild(span);
  label.appendChild(btn);

  return label;
}

// Create TODO Task
function createTodo() {
  let content = taskInput.value;
  let category = taskCategory.value.toLowerCase().replace(" ", "-");
  let taskCard = document.getElementById(category);
  if (!taskCard) {
    console.error("Task card for category not found:", category);
    return;
  }

  if (content == "") {
    taskInput.style.borderColor = "#F12B00";
    taskInput.style.borderWidth = "2px";
    taskInput.style.borderStyle = "solid";
  } else {
    let todoElement = createTodoElement(content);
    taskCard.appendChild(todoElement);
    taskInput.style.border = "none";
  }
}

// Removes TODO task
function removeTodo() {
  let todoElement = this.closest(".todo");
  if (todoElement) {
    todoElement.parentNode.removeChild(todoElement);
  }
}
