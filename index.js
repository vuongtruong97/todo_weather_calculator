"use strict";
import WeatherApp from "./WeatherApp.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const LOCAL_STOTAGE_KEY = "todos";

const rootElement = document.documentElement;
const todoInput = $(".todo_input");
const addBtn = $(".addBtn");
const listTodo = $(".todo_wrap");
const jobCount = $(".job_count");
const themeBtn = $(".theme_btn");
const ListSort = $(".app_sort");
const fullScreen = $(".btn_fullScreen");

const ToDoApp = {
  sortMode: "all",
  defineProperties() {
    Object.defineProperty(this, "sortedList", {
      get() {
        switch (this.sortMode) {
          case "all":
            return this.localStoreData;
          case "active": {
            return this.localStoreData.filter(
              (todo) => todo.status !== "checked"
            );
          }
          case "complete":
            return this.localStoreData.filter(
              (todo) => todo.status === "checked"
            );
        }
      },
    });
  },
  localStoreData: JSON.parse(localStorage.getItem(LOCAL_STOTAGE_KEY)) ?? [],
  inputValue: "",
  render() {
    const jobcout = this.sortedList.length;
    if (jobcout === 1) {
      jobCount.innerHTML = `${jobcout} item`;
    } else {
      jobCount.innerHTML = `${jobcout} items`;
    }
    const html = this.sortedList
      .map(
        (todo, i) => `<li data-index=${i} data-status=${
          todo.status
        } draggable="true" class="app_todo"><div class="left_todo">
        <div class='check ${todo.status && "checked"}'>
        <i class="fa-solid fa-check"></i>
        </div>
        
        </div>
        <div class='todo_name ${todo.status && "disable"}'> 
        ${todo.name}
        </div>
      <div class=' btn deleteBtn' >
      <i class="fa-solid fa-xmark"></i>
      </div>
      </li>`
      )
      .join("");
    listTodo.innerHTML = html;
    return "render";
  },
  handleEvent() {
    //click fullScreen Btn
    fullScreen.addEventListener("click", (e) => {
      this.handleFullScreen();
    });
    //onclick list sort
    ListSort.addEventListener("click", (e) => {
      this.changeSortList(e);
    });
    //oninput
    todoInput.addEventListener("input", () => {
      this.getInputValue();
      this.displayAddBtn();
    });
    //on add btn
    addBtn.addEventListener("click", () => {
      this.addToDo();
      this.displayAddBtn();
    });
    // onclick croos btn
    listTodo.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const todoEl = e.target.closest(".app_todo");
      const checkBtn = e.target.closest(".check");
      if (e.target.closest(".deleteBtn")) {
        this.deleteTodo(e);
      }
      if (checkBtn) {
        this.localStoreData[todoEl.dataset.index].status == "checked"
          ? (this.localStoreData[todoEl.dataset.index].status = "")
          : (this.localStoreData[todoEl.dataset.index].status = "checked");
        this.render();
        this.saveToLocalStorage();
      }
    });

    // onKeydown
    // window.addEventListener("keydown", (e) => {
    //   switch (e.which) {
    //     case 13:
    //       this.addToDo();
    //       break;
    //     default:
    //       break;
    //   }
    // });
    // on change theme btn
    themeBtn.addEventListener("change", (e) => {
      rootElement.classList.toggle("light");
      rootElement.classList.toggle("dark");
    });
  },
  handleFullScreen() {
    const documentEl = document.documentElement;
    if (!document.fullscreenElement) {
      documentEl.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  },
  changeSortList(e) {
    const targetEl = e.target.closest(".btn");
    if (targetEl) {
      if (targetEl.classList.contains("btn_all")) {
        this.sortMode = "all";
      }
      if (targetEl.classList.contains("btn_active")) {
        this.sortMode = "active";
      }
      if (targetEl.classList.contains("btn_complete")) {
        this.sortMode = "complete";
      }
    }

    this.render();
  },
  saveToLocalStorage() {
    localStorage.setItem(
      LOCAL_STOTAGE_KEY,
      JSON.stringify(this.localStoreData)
    );
  },
  displayAddBtn() {
    if (this.inputValue) {
      addBtn.classList.add("show");
    } else {
      addBtn.classList.remove("show");
    }
  },
  getInputValue() {
    this.inputValue = todoInput.value;
  },
  addToDo: function () {
    if (this.inputValue) {
      const todoItem = {
        id: Date.now() * ~~(Math.random() * 100),
        status: "",
        name: this.inputValue,
      };
      this.localStoreData.push(todoItem);
    }
    this.saveToLocalStorage();
    this.render();
    todoInput.value = null;
    this.getInputValue();
    this.displayAddBtn();
    todoInput.focus();
    listTodo.lastChild.scrollIntoView();
  },
  deleteTodo(e) {
    const thisTodoIndex = e.target.closest(".app_todo").dataset.index;
    this.localStoreData.splice(thisTodoIndex, 1);
    this.saveToLocalStorage();
    this.render();
    todoInput.value = null;
    this.getInputValue();
    this.displayAddBtn();
    todoInput.focus();
  },
  play() {
    this.defineProperties();
    this.render();
    this.handleEvent();
  },
};
ToDoApp.play();
WeatherApp.play();
