// setting variables:

let taskInput = document.querySelector(".addTask input");

let addTask = document.querySelector(".addTask i");

let tasks = document.querySelector(".tasks");

let filters = document.querySelectorAll(".filter");



// Adding a task when the user clicks the add icon
addTask.onclick = function addingATask(){
    if(taskInput.value !== ""){

        let taskVal = taskInput.value;
        let status = "pending";

        let tasksArr = getStoredTasks(); 

        tasksArr.push({text: taskVal , status: status});

        localStorage.setItem("tasks",JSON.stringify(tasksArr));

        creatingtasks(taskVal,status);

        taskInput.value = "";
        taskInput.focus();

    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: 'You gotta type something first!',
            confirmButtonColor: '#f87171',
        });
    }
}
// Adding a task when the user presses the Enter key

document.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        
        e.preventDefault();
        
        if(taskInput.value !== ""){

        let taskVal = taskInput.value;
        let status = "pending";

        let tasksArr = getStoredTasks(); 

        tasksArr.push({text: taskVal , status: status});

        localStorage.setItem("tasks",JSON.stringify(tasksArr));

        creatingtasks(taskVal,status);

        taskInput.value = "";
        taskInput.focus();

    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Oops!',
            text: 'You gotta type something first!',
            confirmButtonColor: '#f87171',
        });
    }
    }
});

// FUNCTIONS

// CREATING TASKS FUNCTION

function creatingtasks(tv,status) {

    let task = document.createElement("div");

    task.className = "task";

    task.classList.add(status);

    let taskNameSpan = document.createElement("span");
    taskNameSpan.className = "task-name";

    let taskName = document.createTextNode(tv);

    let icon = document.createElement("i");
    icon.className = "fa-regular fa-trash-can";

    let check = document.createElement("span");
    check.className = "check-icon";

    task.appendChild(check);

    taskNameSpan.appendChild(taskName);
    task.appendChild(taskNameSpan);
    task.appendChild(icon);
    tasks.appendChild(task);

    // remove task

    icon.onclick = function() {

        task.remove();
        removeTaskFromLocalStorage(task.textContent);
        
    }

    // MARK TASK AS DONE

    task.onclick = function () {
        
        let storedTasks = getStoredTasks();

        if (task.classList.contains("done")) {
            task.classList.remove("done");
            task.classList.add("pending");

            storedTasks.forEach(t => {
                if (t.text === task.textContent) {
                    t.status = "pending";
                }
            });
        }else{
            task.classList.add("done");
            task.classList.remove("pending");

            
            storedTasks.forEach(t => {
                if (t.text === task.textContent) {
                    t.status = "done";
                }
            });
        }
        localStorage.setItem("tasks", JSON.stringify(storedTasks));
    }

}

// FILTERS FUNCTION:


function setupFilters() {
    
    filters.forEach(filter => {

        filter.onclick = function () {

        let allTasks = document.querySelectorAll(".tasks .task");


            filters.forEach(f => f.classList.remove("clicked"));
            filter.classList.add("clicked");

            allTasks.forEach(task => {

                if (filter.classList.contains("all")) {
                    
                    task.classList.remove("hidden");

                }else if (filter.classList.contains("done")) {
                    
                    task.classList.contains("done") ? task.classList.remove("hidden") : task.classList.add("hidden");

                }else if(filter.classList.contains("pending")){

                    task.classList.contains("pending") ? task.classList.remove("hidden") : task.classList.add("hidden");
                
                }

            });

            
        }
    });

}


// REMOVE THE TASK FROM LOCAL STORAGE FUNCTION

function removeTaskFromLocalStorage(taskText) {

    let storedTasks = getStoredTasks();

    let updatedTasks = storedTasks.filter(t => t.text !== taskText);

    localStorage.setItem("tasks",JSON.stringify(updatedTasks));

}

//STORED TASKS FUNCTION:

function getStoredTasks() {
    return JSON.parse(localStorage.getItem("tasks")) || [];
}


//QUOTE GENERATOR FUNCTION:

function quotesGen() {

    let quoteCont = document.querySelector(".quote p");

    fetch("quotes.json")
    .then((result)=>{
        return result.json();
    })
    .then((myData)=>{

    
        let randomNum = Math.floor(Math.random() * myData.length);
    
        let quote = myData[randomNum].text;


        quoteCont.textContent = quote;
    
    
    })
}

window.onload = function () {
    let storedTasks = getStoredTasks();

    storedTasks.forEach(task => {
        creatingtasks(task.text ,task.status);
    });

    setupFilters();
    quotesGen();
}