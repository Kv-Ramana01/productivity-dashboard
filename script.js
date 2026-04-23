const taskInput = document.querySelector("#taskInput");
const addTaskBtn = document.querySelector('#addTaskBtn');
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

themeBtn.addEventListener("click", () => {
  themeToggle.checked = !themeToggle.checked;
  themeToggle.dispatchEvent(new Event("change"));
});

let notes = JSON.parse(localStorage.getItem("notes")) || [];

renderNotes();

openNoteModal.addEventListener("click" , () => {
  noteModal.classList.add("show");
});

closeNoteModal.addEventListener("click", () => {
  noteModal.classList.remove("show");
})

saveNoteBtn.addEventListener("click", addNote);

function addNote() {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();

  if(title === "" || body === "") return;

  notes.push({title,body});

  saveNotes();
  renderNotes();

  noteTitle.value = "";
  noteBody.value = "";

  noteModal.classList.remove("show");
}


function renderNotes() {
  notesList.innerHTML = "";
  
  notes.forEach((note,index) => {
    const card = document.createElement("div");
    card.classList.add("note-card");

    card.innerHTML = `
      <h4>${note.title}</h4>
      <p>${note.body}</p>
      <button class="note-delete">Delete</button>
    `;

    card.querySelector(".note-delete").addEventListener("click", ()=>{
      notes.splice(index,1);
      saveNotes();
      renderNotes();
    });
    
    notesList.appendChild(card);
  });
}
function saveNotes () {
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

    if(text === "") return;

    tasks.push(text);
    saveTasks();
    renderTasks();

    taskInput.value = "";
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach((task,index) => {
    const li = document.createElement("li");
    li.textContent = task;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", ()=>{
      tasks.splice(index,1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

  

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateClock(){
  const now = new Date();

  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2,"0");
  const seconds = String(now.getSeconds()).padStart(2,"0");

  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  if(hours === 0) hours = 12;

  clockTime.textContent = `${String(hours).padStart(2,"0")}:${minutes}:${seconds}`;

  clockPeriod.textContent = period;
  // clockTime.textContent = now.toLocaleTimeString();
  // clockDate.textContent = now.toLocaleDateString();

  clockDate.textContent = now.toLocaleDateString("ja-JP", {
    weekday: "long",
    day:"numeric",
    month:"long",
    year:"numeric"
  });
}

updateClock();
setInterval(updateClock, 1000);