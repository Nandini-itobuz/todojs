import list from "./list.json" assert { type: "json" };

const clearBtn = document.getElementById("clear-btn");
const taskAddbtn = document.getElementById("add-btn");
const addtaskBox = document.getElementById("add-task");
const containerTodo = document.getElementById("container-main");
const completeBtn = document.getElementById("completed-btn");
const addBtn = document.getElementById("all-btn");
const activeBtn = document.getElementById("active-btn");

function setList(key, data) {
  if (typeof localStorage !== "undefined") {
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } else {
    console.error("localStorage is not available in this environment.");
  }
}

function updateListItems(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function checkvalue() {
  for (let i = 0; i < listItems.length; i++) {
    if (addtaskBox.value === listItems[i]["task"]) {
      return 1;
    }
  }
  return 0;
}

function createTaskBox(time) {
  let taskBox = document.createElement("div");
  taskBox.classList.add('createBox')
  taskBox.setAttribute("id", time);

  let delTask = document.createElement("img");
  delTask.setAttribute("src", "images/trash-solid.svg");
  delTask.setAttribute("data-del-card-id", time);
  delTask.setAttribute("class", "cursour");
  delTask.classList.add('delTaskImg')

  let checkTask = document.createElement("input");
  checkTask.setAttribute("type", "checkbox");
  checkTask.style.width = "3%";

  checkTask.setAttribute("data-check-card-id", time);
  checkTask.setAttribute("class", "cursour");

  let taskText = document.createElement("div");
  taskText.setAttribute("data-text-card-id", time);
  taskText.classList.add('taskTextBox')

  let check = checkvalue();
  let taskCheck = addtaskBox.value;
  taskCheck = taskCheck.trim();

  if (taskCheck === "") {
    addtaskBox.value = "";
    return;
  } else if (check === 1 && listItems.length !== 0) {
    addtaskBox.value = "";
    alert("Duplicate Found");
    return;
  } else {
    containerTodo.appendChild(taskBox);
    let taskObj = { id: time, task: addtaskBox.value, done: false };
    listItems.push(taskObj);
    updateListItems("toDoItems", listItems);
    taskText.textContent = taskObj["task"];
    taskBox.append(checkTask, taskText, delTask);
    addtaskBox.value = "";
  }
}

function loadElements(ele) {
  let taskBox = document.createElement("div");
  taskBox.classList.add('createBox')
  taskBox.setAttribute("id", ele["id"]);

    let delTask = document.createElement("img");
  delTask.setAttribute("src", "images/trash-solid.svg");
  delTask.setAttribute("data-del-card-id", ele["id"]);
  delTask.setAttribute("class", "cursour");
  delTask.classList.add('delTaskImg')

  let checkTask = document.createElement("input");
  checkTask.setAttribute("type", "checkbox");
  if (ele.done) {
    checkTask.setAttribute("checked", "true");
  }
  checkTask.style.width = "3%";
  checkTask.setAttribute("data-check-card-id", ele["id"]);
  checkTask.setAttribute("class", "cursour");

  let taskText = document.createElement("div");
  taskText.setAttribute("data-text-card-id", ele["id"]);
  taskText.textContent = ele["task"];
  taskText.classList.add("taskTextBox")
  taskText.style.width = "50%";
  taskBox.style.overflow = "none";
  if (ele.done) {
    taskText.style.textDecoration = "line-through";
  }

  containerTodo.appendChild(taskBox);
  taskBox.append(checkTask, taskText, delTask);
}

function delItems(event) {
  let delCard = event.target.dataset.delCardId;
  listItems = listItems.filter((ele) => ele["id"] !== Number(delCard));
  updateListItems("toDoItems", listItems);
  let del = document.getElementById(delCard);
  containerTodo.removeChild(del);
}

function checkItems(event) {
  let checkCard = event.target.dataset.checkCardId;
  const checkChild = document.getElementById(checkCard);

  const checkIndex = listItems.find((ele) => ele["id"] === Number(checkCard));
  if (checkIndex["done"] === true) {
    checkChild.querySelector("div").style.textDecoration = "none";
    checkIndex["done"] = false;
    updateListItems("toDoItems", listItems);
  } else {
    checkChild.querySelector("div").style.textDecoration = "line-through";
    checkIndex["done"] = true;
    updateListItems("toDoItems", listItems);
  }
}

containerTodo.classList.add('todoContainer')

setList("toDoItems", list);
let listItems = JSON.parse(localStorage.getItem("toDoItems"));

taskAddbtn.addEventListener("click", () => {
  const dt = new Date();
  let time = dt.getTime();
  createTaskBox(time);
});

addtaskBox.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    const dt = new Date();
    let time = dt.getTime();
    createTaskBox(time);
  }
});

containerTodo.addEventListener("click", function (event) {
  const currentTag = event.target.tagName;
  if (currentTag === "IMG") {
    delItems(event);
  } else {
    checkItems(event);
  }
});

window.addEventListener("load", (event) => {
  let listItems = JSON.parse(localStorage.getItem("toDoItems"));
  listItems.forEach((element) => {
    loadElements(element);
  });
});

activeBtn.addEventListener("click", () => {
  containerTodo.innerHTML = "";
  listItems.forEach((element) => {
    if (element["done"] === false) {
      loadElements(element);
    }
  });
});

addBtn.addEventListener("click", () => {
  containerTodo.innerHTML = "";
  listItems.forEach((element) => {
    loadElements(element);
  });
});

completeBtn.addEventListener("click", () => {
  containerTodo.innerHTML = "";
  listItems.forEach((element) => {
    if (element["done"] === true) {
      loadElements(element);
    }
  });
});

clearBtn.addEventListener("click", (event) => {
  containerTodo.innerHTML = "";

  listItems.forEach((element) => {
    if (element["done"] === true) {
      listItems = listItems.filter(
        (ele) => ele["id"] !== Number(element["id"])
      );
      updateListItems("toDoItems", listItems);
    }
  });
  listItems.forEach((element) => {
    loadElements(element);
  });
});
