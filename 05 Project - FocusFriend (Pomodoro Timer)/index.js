// GET THE TIME AND DATE TO DISPLAY
const dateDiv = document.getElementById("date");
const timeDiv = document.getElementById("time");

const newdate = new Date();
const options = {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
};

dateDiv.innerText = newdate.toLocaleDateString("en-US", options);
timeDiv.innerText = newdate.toLocaleTimeString(undefined, {
  timeStyle: "short",
});

// SELECT A CURRENT MODE
const buttons = document.querySelectorAll(".select-item");
const timerText = document.getElementById("timer-text");
const currentMode = document.getElementById("current-mode");
const progressCircle = document.getElementById("progress-circle");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const selectMode = document.getElementById("mode");
const alarm = document.getElementById("alarm");

const modeTimes = {
  focus: 50 * 60, // 50 minutes in seconds
  short: 10 * 60, // 10 minutes in seconds
  long: 60 * 60, // 15 minutes in seconds
  meditate: 10 * 60, // 5 minutes in seconds
};

let timerRunning = false;
let selectedTime = 0;
let remainingTime = 0;
let startTime = 0;
let countdownInterval;
let selectedMode = "";

const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
progressCircle.style.strokeDashoffset = circumference;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function setProgress(percent) {
  const offset = circumference - (percent / 100) * circumference;
  progressCircle.style.strokeDashoffset = offset;
}

function resetCircle() {
  progressCircle.style.strokeDashoffset = circumference;
}

function updateCountdown() {
  const now = Date.now();
  const elapsed = Math.floor((now - startTime) / 1000);
  remainingTime = selectedTime - elapsed;

  if (remainingTime <= 0) {
    timerText.textContent = "Done!";
    // Updating the Tab Title with the Timer
    document.title = `Session Finished! - FocusFriend (Pomodoro Timer)`;
    setProgress(0);
    clearInterval(countdownInterval);
    startButton.textContent = "Start";
    timerRunning = false;
    selectMode.removeAttribute("disabled");
    alarm.play();
  } else {
    timerText.textContent = formatTime(remainingTime);
    setProgress((remainingTime / selectedTime) * 100);
    // Updating the Tab Title with the Timer
    document.title = `${timerText.textContent} - FocusFriend (Pomodoro Timer)`;
  }
}

function startCountdown(time) {
  startTime = Date.now() - (selectedTime - remainingTime) * 1000;
  updateCountdown();
  countdownInterval = setInterval(updateCountdown, 1000);
}

// MODIFY THE POMODORO SETUP TIMER DEPENDS ON THE CURRENT SET SELECTED
selectMode.addEventListener("change", function () {
  selectedMode = "";
  // console.log(selectedMode);
  buttons.forEach((button) => {
    button.classList.remove("select-item-active");
    alarm.currentTime = 0;
    alarm.pause();
    timerText.textContent = "00:00";
    currentMode.innerText = selectedMode;
    resetCircle();
    // remainingTime = selectedTime;
  });
  const currentSet = selectMode.value;
  if (currentSet == "25/5") {
    modeTimes.focus = 25 * 60;
    modeTimes.short = 5 * 60;
  } else if (currentSet == "60/15") {
    modeTimes.focus = 60 * 60;
    modeTimes.short = 15 * 60;
  } else {
    modeTimes.focus = 50 * 60;
    modeTimes.short = 10 * 60;
  }
});

buttons.forEach((button) => {
  button.addEventListener("click", function () {
    if (timerRunning) {
      alert("Please stop the timer first.");
      return;
    }
    const value = button.getAttribute("data-value");
    buttons.forEach((btn) => {
      btn.classList.remove("select-item-active");
      alarm.currentTime = 0;
      alarm.pause();
    });
    button.classList.add("select-item-active");
    startButton.textContent = "Start";
    selectedTime = modeTimes[value];
    remainingTime = selectedTime;
    timerText.textContent = formatTime(selectedTime);
    resetCircle();

    selectedMode =
      value === "long"
        ? "Long Break"
        : value === "short"
        ? "Short Break"
        : value === "meditate"
        ? "Meditate"
        : "Focus";

    currentMode.innerText = selectedMode;
  });
});

// START TIMER BUTTON
startButton.addEventListener("click", () => {
  if (!timerRunning && selectedTime > 0 && selectedMode !== "") {
    startCountdown(remainingTime);
    startButton.textContent = "Pause";
    timerRunning = true;
    selectMode.setAttribute("disabled", true);
  } else if (
    timerRunning &&
    startButton.textContent === "Pause" &&
    selectedMode !== ""
  ) {
    clearInterval(countdownInterval);
    startButton.textContent = "Resume";
    timerRunning = false;
    selectMode.removeAttribute("disabled");
  } else if (startButton.textContent === "Resume" && selectedMode !== "") {
    startCountdown(remainingTime);
    startButton.textContent = "Pause";
    timerRunning = true;
    selectMode.setAttribute("disabled", true);
  } else {
    alert("Please select a timer mode first!");
    selectMode.removeAttribute("disabled");
  }
});

// STOP TIMER BUTTON
stopButton.addEventListener("click", () => {
  remainingTime = selectedTime;
  startButton.textContent = "Start";
  clearInterval(countdownInterval);
  timerRunning = false;
  timerText.textContent = formatTime(selectedTime);
  resetCircle();
  selectMode.removeAttribute("disabled");
  alarm.currentTime = 0;
  alarm.pause();
  document.title = `00:00 - FocusFriend (Pomodoro Timer)`;
});

// ****** ADD TO-DO FEATURE
const taskButton = document.getElementById("add-task-btn");
const taskContainer = document.getElementById("tasks-container");

const saveTasksToLocalStorage = () => {
  const tasks = [];
  taskContainer.querySelectorAll(".task-card").forEach((taskCard) => {
    const taskText = taskCard.querySelector(".task-text").textContent;
    const isCompleted = taskCard
      .querySelector("img")
      .src.includes("check-done.svg");
    tasks.push({ text: taskText, completed: isCompleted });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  taskContainer.innerHTML = "";
  tasks.forEach((task) => {
    taskContainer.innerHTML += `<div class="task-card">
                <button class="done">
                  <img src="./assets/${
                    task.completed ? "check-done.svg" : "Check.svg"
                  }" alt="check" />
                </button>
                <p class="task-text" style="text-decoration: ${
                  task.completed ? "line-through" : "none"
                };">${task.text}</p>
                <button class="close">
                  <img src="./assets/close.svg" alt="close" />
                </button>
              </div>`;
  });
  updateTaskCounts();
};

taskContainer.addEventListener("click", function (event) {
  if (
    event.target.classList.contains("close") ||
    event.target.parentElement.classList.contains("close")
  ) {
    const taskCard = event.target.closest(".task-card");
    if (taskCard) {
      taskCard.remove();
      updateTaskCounts();
      saveTasksToLocalStorage();
    }
  } else if (
    event.target.classList.contains("done") ||
    event.target.parentElement.classList.contains("done")
  ) {
    const doneButton = event.target.closest(".done");
    const taskCard = doneButton.closest(".task-card");
    const doneImage = doneButton.querySelector("img");
    const taskText = taskCard.querySelector(".task-text");

    if (doneImage && taskText) {
      if (doneImage.src.includes("Check.svg")) {
        doneImage.src = "./assets/check-done.svg";
        taskText.style.textDecoration = "line-through";
      } else {
        doneImage.src = "./assets/Check.svg";
        taskText.style.textDecoration = "none";
      }
      updateTaskCounts();
      saveTasksToLocalStorage();
    }
  }
});

// DISPLAY TOTAL NUMBER OF COMPLETED AND TASK
const completed = document.getElementById("completed");
const totalTask = document.getElementById("total-task");

const updateTaskCounts = () => {
  const totalTasks = taskContainer.querySelectorAll(".task-card").length;
  const completedTasks = taskContainer.querySelectorAll(
    '.task-card img[src="./assets/check-done.svg"]'
  ).length;
  completed.textContent = completedTasks;
  totalTask.textContent = totalTasks;

  // Show or hide no-task message
  const noTask = document.getElementById("no-task");
  if (totalTasks === 0) {
    if (!noTask) {
      taskContainer.innerHTML = '<p id="no-task">No tasks available</p>';
    }
  } else {
    if (noTask) {
      noTask.remove();
    }
  }
};

// Add Task Create Modal
const overlay = document.getElementById("overlay");
const modal = document.getElementById("modal-container");
const addButton = document.getElementById("add");
const cancelButton = document.getElementById("cancel");
const taskInput = document.getElementById("task-input");

const openModal = () => {
  // console.log("Modal Opened!");
  overlay.style.display = "block";
  modal.style.display = "block";
  taskInput.focus();
};

taskButton.addEventListener("click", openModal);

cancelButton.addEventListener("click", function () {
  overlay.style.display = "none";
  modal.style.display = "none";
});

addButton.addEventListener("click", function () {
  let newTask = taskInput.value;
  overlay.style.display = "none";
  modal.style.display = "none";
  taskContainer.innerHTML += `<div class="task-card">
              <button class="done">
                <img src="./assets/Check.svg" alt="check" />
              </button>
              <p class="task-text">${newTask}</p>
              <button class="close">
                <img src="./assets/close.svg" alt="close" />
              </button>
            </div>`;
  taskInput.value = "";
  updateTaskCounts();
  saveTasksToLocalStorage();
});

// Load tasks on page load
loadTasksFromLocalStorage();

// Initial update to set the correct state on load
updateTaskCounts();

// ****** PRELOADER
const fadeOut = () => {
  const loaderWrapper = document.querySelector(".wheel-and-hamster");
  const loaderOverlay = document.getElementById("overlay-loader");
  loaderOverlay.style.display = "none";
  loaderWrapper.classList.add("fade");
};

window.addEventListener("load", fadeOut);

// Next Steps:
// Save to localstorage also regarding with the timer
