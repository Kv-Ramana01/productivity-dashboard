const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector("#addTaskBtn");
const taskList = document.querySelector("#taskList");

const clockTime = document.querySelector("#clockTime");
const clockDate = document.querySelector("#clockDate");
const clockPeriod = document.querySelector("#clockPeriod");

const themeToggle = document.querySelector("#themeToggle");

const noteModal = document.querySelector("#noteModal");
const openNoteModal = document.querySelector("#openNoteModal");
const closeNoteModal = document.querySelector("#closeNoteModal");
const saveNoteBtn = document.querySelector("#saveNoteBtn");

const noteTitle = document.querySelector("#noteTitle");
const noteBody = document.querySelector("#noteBody");
const notesList = document.querySelector("#notesList");

const themeBtn = document.querySelector(".theme-btn");

const sidebar = document.querySelector("#sidebar");
const menuBtn = document.querySelector("#menuBtn");


menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});

themeBtn.addEventListener("click", () => {
  themeToggle.checked = !themeToggle.checked;
  themeToggle.dispatchEvent(new Event("change"));
});

let notes = JSON.parse(localStorage.getItem("notes")) || [];

renderNotes();

openNoteModal.addEventListener("click", () => {
  noteModal.classList.add("show");
});

closeNoteModal.addEventListener("click", () => {
  noteModal.classList.remove("show");
});

saveNoteBtn.addEventListener("click", addNote);

function addNote() {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if (title === "" || body === "") return;

  notes.push({ title, body });

  saveNotes();
  renderNotes();

  noteTitle.value = "";
  noteBody.value = "";

  noteModal.classList.remove("show");
}

function renderNotes() {
  notesList.innerHTML = "";

  notes.forEach((note, index) => {
    const card = document.createElement("div");
    card.classList.add("note-card");

    card.innerHTML = `
      <h4>${note.title}</h4>
      <p>${note.body}</p>
      <button class="note-delete">Delete</button>
    `;

    card.querySelector(".note-delete").addEventListener("click", () => {
      notes.splice(index, 1);
      saveNotes();
      renderNotes();
    });

    notesList.appendChild(card);
  });
}
function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  document.body.classList.add("light-mode");
  themeToggle.checked = true;
}

themeToggle.addEventListener("change", () => {
  document.body.classList.toggle("light-mode");

  const isLight = document.body.classList.contains("light-mode");

  localStorage.setItem("theme", isLight ? "light" : "dark");
});
renderTasks();

addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    addTask();
  }
});

function addTask() {
  const text = taskInput.value.trim();

  if (text === "") return;

  tasks.push({
    text: text,
    completed: false,
  });
  saveTasks();
  renderTasks();

  taskInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.classList.add("task-check");
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    li.prepend(checkbox);

    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateTaskProgress();
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateClock() {
  const now = new Date();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  clockTime.textContent = `${String(hours).padStart(2, "0")}:${minutes}:${seconds}`;

  clockPeriod.textContent = period;
  // clockTime.textContent = now.toLocaleTimeString();
  // clockDate.textContent = now.toLocaleDateString();

  clockDate.textContent = now.toLocaleDateString("ja-JP", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function updateTaskProgress() {
  const total = tasks.length;
  const done = tasks.filter((task) => task.completed).length;

  const percent = total === 0 ? 0 : (done / total) * 100;
  const degrees = percent * 3.6;

  document.querySelector("#doneCount").textContent = done;
  document.querySelector("#doneTotal").textContent = `of ${total} done`;

  document.querySelector(".circle").style.background =
    `conic-gradient(#6366f1 ${degrees}deg, #111827 ${degrees}deg)`;

  document.querySelector("#taskMessage").textContent =
    done === total && total > 0
      ? "All tasks completed 🔥"
      : "Keep it up! You're doing great.";
}

async function getWeather() {
  const city = "Mumbai";
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apikey}&q=${city}&days=1&aqi=no&alerts=no`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data.current.humidity);
    console.log(data.forecast);
    document.getElementById("cityName").textContent = data.location.name;

    document.getElementById("temperature").textContent =
      `${Math.round(data.current.temp_c)}°C`;

    document.getElementById("weatherDesc").textContent =
      data.current.condition.text;

    document.getElementById("humidity").textContent =
      `Humidity: ${data.current.humidity}%`;

    document.getElementById("windSpeed").textContent =
      `Wind: ${data.current.wind_kph} km/h`;

    document.getElementById("weatherIcon").src =
      "https:" + data.current.condition.icon;

    document.getElementById("highTemp").textContent =
      `H: ${Math.round(data.forecast.forecastday[0].day.maxtemp_c)}°C`;

    document.getElementById("lowTemp").textContent =
      `L: ${Math.round(data.forecast.forecastday[0].day.mintemp_c)}°C`;

    document.getElementById("feelsLike").textContent =
      `${Math.round(data.current.feelslike_c)}°C`;

    document.getElementById("detailHumidity").textContent =
      `${data.current.humidity}%`;

    document.getElementById("detailWind").textContent =
      `${data.current.wind_kph} km/h`;

    document.getElementById("visibility").textContent =
      `${data.current.vis_km} km`;

    document.getElementById("pressure").textContent =
      `${data.current.pressure_mb} hPa`;

    const hourlyBox = document.getElementById("hourlyForecast");
    hourlyBox.innerHTML = "";

    const hours = data.forecast.forecastday[0].hour;

    for (let i = 11; i <= 15; i++) {
      const hour = hours[i];

      hourlyBox.innerHTML += `
    <div class="hour-item">
      <p>${i > 12 ? i - 12 : i} ${i >= 12 ? "PM" : "AM"}</p>
      <img src="https:${hour.condition.icon}">
      <p>${Math.round(hour.temp_c)}°C</p>
    </div>
  `;
    }
  } catch (error) {
    console.log("Weather error:", error);
  }
}

getWeather();

updateClock();
setInterval(updateClock, 1000);
