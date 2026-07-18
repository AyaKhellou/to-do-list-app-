"use strict";
// setting variables:
const taskInput = document.querySelector(".addTask input");
const addTask = document.querySelector(".addTask button");
const tasks = document.querySelector(".tasks");
const filters = document.querySelectorAll(".filter");
const quoteCont = document.querySelector(".quote p");
// EVENT LISTENERS
addTask?.addEventListener("click", (e) => addingATask(e));
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addingATask(e);
    }
});
// FUNCTIONS
// ADDING A TASK FUNCTION
function addingATask(e) {
    e.preventDefault();
    if (taskInput) {
        if (taskInput.value.trim() !== "") {
            const taskVal = taskInput.value.trim();
            const tasksArr = getStoredTasks();
            tasksArr.push({ text: taskVal, status: "pending" });
            saveTasks(tasksArr);
            creatingtasks({ text: taskVal, status: "pending" });
            taskInput.value = "";
            taskInput.focus();
        }
        else {
            Swal.fire({
                icon: 'warning',
                text: 'You have to type something first!',
                confirmButtonColor: '#7C5CFF',
            });
        }
    }
}
// CREATING TASKS FUNCTION
function creatingtasks({ text, status }) {
    const task = document.createElement("div");
    task.className = `task ${status}`;
    task.innerHTML = `
        <span class="check-icon"></span>
        <span class="task-name">${text}</span>
        <i class="fa-regular fa-trash-can delete"></i>
    `;
    tasks?.appendChild(task);
    const deleteIcon = task.querySelector("i.delete");
    deleteIcon?.addEventListener("click", e => {
        e.stopPropagation();
        task.remove();
        removeTaskFromLocalStorage(text);
    });
    // MARK TASK AS DONE
    task.addEventListener("click", () => toggleTask(task, text));
}
// TOGGLE TASK STATUS FUNCTION
function toggleTask(task, text) {
    const storedTasks = getStoredTasks();
    storedTasks.forEach(t => {
        if (t.text === text) {
            t.status = t.status === "pending" ? "done" : "pending";
            task.classList.toggle("done");
            task.classList.toggle("pending");
        }
    });
    saveTasks(storedTasks);
}
// FILTERS FUNCTION:
function setupFilters() {
    filters?.forEach(filter => {
        filter.addEventListener("click", function () {
            filters.forEach(f => f.classList.remove("clicked"));
            filter.classList.add("clicked");
            const allTasks = document.querySelectorAll(".tasks .task");
            allTasks.forEach(task => {
                if (filter.classList.contains("all")) {
                    task.classList.remove("hidden");
                }
                else if (filter.classList.contains("done")) {
                    task.classList.contains("done") ? task.classList.remove("hidden") : task.classList.add("hidden");
                }
                else if (filter.classList.contains("pending")) {
                    task.classList.contains("pending") ? task.classList.remove("hidden") : task.classList.add("hidden");
                }
            });
        });
    });
}
// REMOVE THE TASK FROM LOCAL STORAGE FUNCTION
function removeTaskFromLocalStorage(taskText) {
    const storedTasks = getStoredTasks();
    const updatedTasks = storedTasks.filter(t => t.text !== taskText);
    saveTasks(updatedTasks);
}
//STORED TASKS FUNCTION:
function getStoredTasks() {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
}
//save tasks in local storage function
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
//QUOTE GENERATOR FUNCTION:
function quotesGen() {
    fetch("quotes.json")
        .then(result => result.json())
        .then((myData) => {
        const randomNum = Math.floor(Math.random() * myData.length);
        const quote = myData[randomNum].text;
        if (quoteCont)
            quoteCont.textContent = quote;
    });
}
window.addEventListener("load", () => {
    getStoredTasks().forEach(task => creatingtasks({ text: task.text, status: task.status }));
    setupFilters();
    quotesGen();
});
//# sourceMappingURL=main.js.map