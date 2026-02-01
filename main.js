// setting variables:
let taskInput = document.querySelector(".addTask input");
let addTask = document.querySelector(".addTask i");
let tasks = document.querySelector(".tasks");
let filters = document.querySelectorAll(".filter");
let quoteCont = document.querySelector(".quote p");
let generateQuoteButton = document.querySelector(".quote button");

// EVENT LISTENERS
addTask.addEventListener("click", addingATask);
document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        addingATask(e);
    }
});

// FUNCTIONS
// ADDING A TASK FUNCTION
function addingATask(e){
    e.preventDefault();
    if(taskInput.value.trim() !== ""){
        let taskVal = taskInput.value.trim();
        let status = "pending";
        let tasksArr = getStoredTasks(); 

        tasksArr.push({text: taskVal , status: status});
        saveTasks(tasksArr);
        creatingtasks(taskVal,status);
        taskInput.value = "";
        taskInput.focus();
    }else{
        Swal.fire({
            icon: 'warning',
            text: 'You have to type something first!',
            confirmButtonColor: '#7C5CFF',
        });
    }
}

// CREATING TASKS FUNCTION

function creatingtasks(text,status) {
    let task = document.createElement("div");

    task.className = `task ${status}`;
    task.innerHTML= `
        <span class="check-icon"></span>
        <span class="task-name">${text}</span>
        <i class="fa-regular fa-trash-can delete"></i>
    `;
    tasks.appendChild(task);

    let deleteIcon = task.querySelector("i.delete");
    deleteIcon.addEventListener("click", e => {
        e.stopPropagation();
        task.remove();
        removeTaskFromLocalStorage(text);
    });
    // MARK TASK AS DONE
    task.addEventListener("click", ()=> toggleTask(task,text));
}

// TOGGLE TASK STATUS FUNCTION

function toggleTask(task,text) {
    let storedTasks = getStoredTasks();
    storedTasks.forEach(t => {
        if (t.text === text) {
            t.status = t.status === "pending" ? "done" : "pending";
            task.classList.toggle("done");
            task.classList.toggle("pending");
        }
    })
    saveTasks(storedTasks);
}
// FILTERS FUNCTION:
function setupFilters() {
    filters.forEach(filter => {
        filter.addEventListener("click",function () {
            filters.forEach(f => f.classList.remove("clicked"));
            filter.classList.add("clicked");
            
            let allTasks = document.querySelectorAll(".tasks .task");
            allTasks.forEach(task => {
                if (filter.classList.contains("all")) {
                    task.classList.remove("hidden");
                }else if (filter.classList.contains("done")) {
                    task.classList.contains("done") ? task.classList.remove("hidden") : task.classList.add("hidden");
                }else if(filter.classList.contains("pending")){
                    task.classList.contains("pending") ? task.classList.remove("hidden") : task.classList.add("hidden");
                }
            });
        })
    });
}


// REMOVE THE TASK FROM LOCAL STORAGE FUNCTION

function removeTaskFromLocalStorage(taskText) {

    let storedTasks = getStoredTasks();
    let updatedTasks = storedTasks.filter(t => t.text !== taskText);
    saveTasks(updatedTasks);
}

//STORED TASKS FUNCTION:
function getStoredTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}
//save tasks in local storage function
function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//QUOTE GENERATOR FUNCTION:

function quotesGen() {
    fetch("quotes.json")
    .then(result => result.json())
    .then((myData)=>{
        let randomNum = Math.floor(Math.random() * myData.length);
        let quote = myData[randomNum].text;
        quoteCont.textContent = `"${quote}"`;
    })
}
// generateQuoteButton.addEventListener("click",()=>quoteCont())


window.onload = function () {
    getStoredTasks().forEach(task => creatingtasks(task.text ,task.status))
    setupFilters();
    quotesGen();

}