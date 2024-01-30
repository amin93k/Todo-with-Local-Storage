
const $ = document;
const inputTodo = $.querySelector(".form-control");
const addBtn = $.getElementById("addButton"); 
const clearTodoListBtn = $.getElementById("clearButton"); 
const todoUl = $.getElementById("todoList"); 
const todoList = $.querySelectorAll(".well"); 



function addTodo() {
    if (inputTodo.value) { 
        let liElem = createTodo();
        todoUl.append(liElem);
        inputTodo.value = "";
        let liText = liElem.innerText.split(" ");
        let jsonTextSet = JSON.stringify([{ todo: liText[0], status: "UnComplete" }]);
        let jsonTextGet = JSON.parse(localStorage.getItem("todoList"));

        
        if (jsonTextGet) { 
            jsonTextGet.push(JSON.parse(jsonTextSet)[0]);
            localStorage.setItem("todoList", JSON.stringify(jsonTextGet));
        } else {
            localStorage.setItem("todoList", jsonTextSet);
        }
    }
    inputTodo.focus()
}


function createTodo(text = inputTodo.value, status = "UnComplete") {
    const newTodo = $.createElement("li");
    let success;
    
    if (status === "UnComplete") { 
        newTodo.className = "well";
        success = "Complete";
    } else {
        newTodo.className = "well completed";
        success = "UnComplete";
    }
    newTodo.innerHTML = "<label>" + text + "</label>\n" +
        "<button class=\"btn btn-success\">" + success + "</button>\n" +
        "<button class=\"btn btn-danger\">Delete</button>";
    newTodo.children[1].addEventListener("click", completeTodo);
    newTodo.children[2].addEventListener("click", deleteTodo);
    return newTodo;
}


function clearAllTodo() {
    todoUl.innerHTML = ""
    localStorage.removeItem("todoList");
}


function completeTodo(event) {
    let liText = event.target.parentElement.innerText.split(" ");
    let todoData = JSON.parse(localStorage.getItem("todoList"));
    let isComplete = event.target.parentElement.classList[1];
    event.target.parentElement.classList.toggle("completed");
    if (isComplete) {
        event.target.innerText = "Complete";
        todoData.some(function (item) {
            if (item.todo === liText[0]) {
                item.status = "UnComplete";
            }
        });
    } else {
        event.target.innerText = "Uncompleted";
        todoData.some(function (item) {
            if (item.todo === liText[0]) {
                item.status = "Complete";
            }
        });
    }

    localStorage.setItem("todoList", JSON.stringify(todoData));
}


function deleteTodo(event) {
    let todoData = JSON.parse(localStorage.getItem("todoList"));
    let liText = event.target.parentElement.innerText;
    todoData.some(function (item, index) {
        if (item.todo === liText[0]) {
            todoData.splice(index, 1);
        }
    });
    event.target.parentElement.remove();
    localStorage.setItem("todoList", JSON.stringify(todoData));
}


function getData() {
    let data = JSON.parse(localStorage.getItem("todoList"));
    if (data) {
        data.forEach(function (item) {
            todoUl.append(createTodo(item.todo, item.status));
        });
    }
}


addBtn.addEventListener("click", addTodo);
inputTodo.addEventListener("keydown", function (event){
    if(event.key === "Enter"){
        addTodo()
    }
})

todoList.forEach(function (item) {
    item.children[1].addEventListener("click", completeTodo); 
    item.children[2].addEventListener("click", deleteTodo);
});

clearTodoListBtn.addEventListener("click", clearAllTodo);
window.addEventListener("load", getData);
