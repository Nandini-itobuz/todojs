import list from "./list.json" assert { type: "json" };

const clearbtn = document.getElementById("clear-btn");
const taskAddbtn = document.getElementById("add-btn");
const addtaskBox = document.getElementById("add-task");
const containerTodo = document.getElementById("container-main");
const completebtn = document.getElementById("completed-btn");
const addbtn = document.getElementById("all-btn");
const activebtn = document.getElementById("active-btn");

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
  taskBox.style.cssText = `width:80%;
                                background-color: #282828;
                                margin: 10px auto;
                                display:flex;
                                justify-content:space-between;
                                font-family:'Bradley Hand';
                                font-size:1.2rem;
                                padding:2% 5%;
                                overflow-x:hidden`;
  taskBox.setAttribute("id", time);

  let delTask = document.createElement("img");
  delTask.setAttribute("src", "images/trash-solid.svg");

  delTask.style.cssText = `
                          width:3%;
                          margin-right:5%
                          `;
  delTask.setAttribute("data-del-card-id", time);
  delTask.setAttribute("class", "cursour");

  let checkTask = document.createElement("input");
  checkTask.setAttribute("type", "checkbox");

  checkTask.style.cssText = `
                          width:3%;
                          }`;

  checkTask.setAttribute("data-check-card-id", time);
  checkTask.setAttribute("class", "cursour");

  let taskText = document.createElement("div");
  taskText.setAttribute("data-text-card-id", time);
  taskText.style.cssText = `
                            overflow-x:scroll;
                            white-space:nowrap;
                            `;
  taskText.style.width = "50%";

  let check = checkvalue();
  let taskCheck = addtaskBox.value;
  taskCheck = taskCheck.trim();

  if (taskCheck === "") {
    addtaskBox.value = "";
    return;
  } else if (check == 1 && listItems.length !== 0) {
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
  taskBox.style.cssText = `width:80%;
                                background-color: #282828;
                                margin: 10px auto;
                                display:flex;
                                justify-content:space-between;
                                font-family:'Bradley Hand';
                                font-size:1.2rem;
                                padding:2% 5%;
                                overflow-x:hidden`;
  taskBox.setAttribute("id", ele["id"]);

  let delTask = document.createElement("img");
  delTask.setAttribute("src", "images/trash-solid.svg");

  delTask.style.cssText = `
                          width:3%;
                          margin-right:5%
                          `;
  delTask.setAttribute("data-del-card-id", ele["id"]);
  delTask.setAttribute("class", "cursour");

  let checkTask = document.createElement("input");
  checkTask.setAttribute("type", "checkbox");
  if (ele.done) {
    checkTask.setAttribute("checked", "true");
  }
  checkTask.style.cssText = `
                          width:3%;
                          }`;
  checkTask.setAttribute("data-check-card-id", ele["id"]);
  checkTask.setAttribute("class", "cursour");

  let taskText = document.createElement("div");
  taskText.setAttribute("data-text-card-id", ele["id"]);
  taskText.textContent = ele["task"];
  taskText.style.cssText = `
                            overflow-x:scroll;
                            white-space:nowrap;
                            `;
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

containerTodo.style.cssText = `width:90%;
                                padding:3%;
                                height:auto;
                                background-color:#000000;
                                margin:auto;
                                color:white`;

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

activebtn.addEventListener("click", () => {
  containerTodo.innerHTML = "";
  listItems.forEach((element) => {
    if (element["done"] === false) {
      loadElements(element);
    }
  });
});

addbtn.addEventListener("click", () => {
  containerTodo.innerHTML = "";
  listItems.forEach((element) => {
    loadElements(element);
  });
});

completebtn.addEventListener("click", () => {
  containerTodo.innerHTML = "";
  listItems.forEach((element) => {
    if (element["done"] === true) {
      loadElements(element);
    }
  });
});

clearbtn.addEventListener("click", (event) => {
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
