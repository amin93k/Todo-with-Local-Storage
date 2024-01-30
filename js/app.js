
const $ = document;
const inputTodo = $.querySelector(".form-control"); // ورودی متن تسک
const addBtn = $.getElementById("addButton"); // دکمه افزودن تسک
const clearTodoListBtn = $.getElementById("clearButton"); // دکمه حذف همه تسک‌ها
const todoUl = $.getElementById("todoList"); // لیست تسک‌ها
const todoList = $.querySelectorAll(".well"); // تمام عناصر "well" در لیست تسک‌ها


// افزودن تسک جدید به لیست و ذخیره در localStorage
function addTodo() {
    if (inputTodo.value) { // اگر ورودی خالی نباشد
        let liElem = createTodo(); // یک li ایجاد میشود
        todoUl.append(liElem);
        inputTodo.value = "";
        let liText = liElem.innerText.split(" ");
        let jsonTextSet = JSON.stringify([{ todo: liText[0], status: "UnComplete" }]);
        let jsonTextGet = JSON.parse(localStorage.getItem("todoList"));

        // اضافه کردن تسک جدید به Localstorage
        if (jsonTextGet) { // در صورت بودن اطلاعات در Localstorage
            jsonTextGet.push(JSON.parse(jsonTextSet)[0]);
            localStorage.setItem("todoList", JSON.stringify(jsonTextGet));
        } else {
            localStorage.setItem("todoList", jsonTextSet);
        }
    }
    inputTodo.focus() // بعد از اینکه تسک جدید ایجاد شد نشانه گر موس به داخل Input برمیگردد
}

// ایجاد المان تسک جدید
function createTodo(text = inputTodo.value, status = "UnComplete") {
    const newTodo = $.createElement("li");
    let success;
    // بررسی پارامترها
    if (status === "UnComplete") { // در صورت تکمیل نبودن تسک
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

// حذف تمام تسک‌ها از لیست و localStorage
function clearAllTodo() {
    todoUl.innerHTML = ""
    localStorage.removeItem("todoList");
}

// تغییر وضعیت تسک از تکمیل به ناتکمیل و بالعکس
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

// حذف یک تسک از لیست و localStorage
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

// بازیابی اطلاعات از localStorage و افزودن تسک‌ها به لیست
function getData() {
    let data = JSON.parse(localStorage.getItem("todoList"));
    if (data) {
        data.forEach(function (item) {
            todoUl.append(createTodo(item.todo, item.status));
        });
    }
}

// اضافه کردن listener به المنتها و فراخوانی توابع
addBtn.addEventListener("click", addTodo);
inputTodo.addEventListener("keydown", function (event){
    if(event.key === "Enter"){
        addTodo()
    }
})

todoList.forEach(function (item) {
    item.children[1].addEventListener("click", completeTodo); // افزودن event به دکمه تکمیل
    item.children[2].addEventListener("click", deleteTodo); // افزودن event به دکمه حذف
});

clearTodoListBtn.addEventListener("click", clearAllTodo);
window.addEventListener("load", getData);
