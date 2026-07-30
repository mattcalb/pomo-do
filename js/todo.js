import { clearError, showError } from "./errors.js";
import { checkIcon, targetIcon, trashIcon } from "./icons.js";
import { clearCurrentFocusTask, loadTasks, saveTasks, saveCurrentFocusTask, loadCurrentFocusTask } from "./storage.js";

const sidebar = document.getElementById("sidebar");
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listWrapper = document.getElementById("todo-list-wrapper");
const taskList = document.getElementById("todo-list");
const completedTaskList = document.getElementById("completed-todo-list");
const taskError = document.getElementById("task-error");
const activeTask = document.getElementById("active-task-title");
const clearActiveTasksButton = document.getElementById("clear-active-tasks-button");
const clearCompletedTasksButton = document.getElementById("clear-completed-tasks-button");
const activeTasksCounter = document.getElementById("active-task-counter");
const completedTasksCounter = document.getElementById("completed-task-counter");

let tasks = [];
let currentFocusTask = null;

export function initTodo() {
    form.addEventListener("submit", handleSubmit);
    listWrapper.addEventListener("click", handleTaskListClick);

    clearActiveTasksButton.addEventListener("click", clearActiveTasks);
    clearCompletedTasksButton.addEventListener("click", clearCompletedTasks);

    tasks = loadTasks();
    currentFocusTask = loadCurrentFocusTask();
    currentFocusTask ? setActiveTaskTitle(currentFocusTask.title) : '';
    setTaskCounter();
    renderInitialTasks();
}

function renderInitialTasks() {
    const fragment = document.createDocumentFragment();
    const completedFragment = document.createDocumentFragment();

    for (const task of tasks) {
        const taskEl = createTaskElement(task);
        (task.completed ? completedFragment : fragment).appendChild(taskEl);
    }

    taskList.appendChild(fragment);
    completedTaskList.appendChild(completedFragment);
}

function handleSubmit(event) {
    event.preventDefault();

    const title = input.value.trim();

    if(!isValidTask(title)) {
        showError(taskError, "Task title must be between 1 and 100 characters long.");
        return;
    }

    addTask(title);

    resetTodoForm();
}

function handleTaskListClick(event) {
    const taskEl = event.target.closest(".todo-item");

    if(!taskEl) return;

    const taskId = taskEl.dataset.id;

    if (event.target.closest(".toggle-todo-button")) {
        toggleTaskCompletion(taskId);
    } else if (event.target.closest(".focus-todo-button")) {
        setTaskAsFocus(taskId);
    } else if (event.target.closest(".delete-todo-button")) {
        deleteTask(taskId);
    }
}

function toggleTaskCompletion(taskId) {
    const task = findTaskById(taskId);

    if(!task) return;

    task.completed = !task.completed;

    const taskEl = findTaskElementById(taskId);

    if(isCurrentFocusTask(taskId)) {
        unsetFocusTask();
    }

    syncTaskElement(taskEl, task);

    const destinationList = task.completed ? completedTaskList : taskList;
    destinationList.appendChild(taskEl);

    insertTaskInOrder(taskEl, task, destinationList);

    onTaskChange();
}

function setTaskAsFocus(taskId) {
    const task = findTaskById(taskId);

    if(!task || task.completed) return;

    if (isCurrentFocusTask(taskId)) {
        unsetFocusTask();
        syncTaskById(taskId);
        return;
    }

    const previousFocusTaskId = currentFocusTask?.id;

    currentFocusTask = task;
    saveCurrentFocusTask(task);
    setActiveTaskTitle(task.title);

    syncTaskById(taskId);
    if (previousFocusTaskId) syncTaskById(previousFocusTaskId);
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    const taskEl = findTaskElementById(taskId);

    if(isCurrentFocusTask(taskId)) {
        unsetFocusTask();
    }

    taskEl?.remove();

    onTaskChange();
}

function findTaskById(taskId) {
    return tasks.find(t => t.id === taskId);
}

function findTaskElementById(taskId) {
    return document.querySelector(`.todo-item[data-id="${taskId}"]`);
}

function createTask(title) {
    return {
        id: crypto.randomUUID(),
        title: title,
        completed: false,
        createdAt: Date.now(),
    }
}

function addTask(title) {
    const task = createTask(title);
    tasks.push(task);

    taskList.appendChild(createTaskElement(task));

    onTaskChange();
}

function syncTaskById(taskId) {
    const taskEl = findTaskElementById(taskId);
    const task = findTaskById(taskId);
    if (taskEl && task) syncTaskElement(taskEl, task);
}

function syncTaskElement(taskEl, task) {
    const toggleButtonEl = taskEl.querySelector(".toggle-todo-button");

    syncToggleButton(toggleButtonEl, task.completed);
    taskEl.classList.toggle("todo-item--completed", task.completed);
    taskEl.classList.toggle("todo-item--focus", isCurrentFocusTask(task.id) && !task.completed);
}

function syncToggleButton(toggleButtonEl, completed) {
    toggleButtonEl.innerHTML = completed ? checkIcon : '';
    toggleButtonEl.ariaLabel = completed ? "Mark as pending" : "Mark as completed";
}

function createCheckBox() {
    const toggleButtonEl = document.createElement("button");
    toggleButtonEl.type = "button";
    toggleButtonEl.className = "toggle-todo-button";

    return toggleButtonEl;
}

function createTaskText(task) {
    const taskTextEl = document.createElement("span");
    taskTextEl.className = "todo-item-title";
    taskTextEl.textContent = task.title;

    return taskTextEl;
}

function createIconButton(classList, svgMarkup, label) {
    const buttonEl = document.createElement("button")
    buttonEl.classList.add(...classList);
    buttonEl.ariaLabel = label;
    buttonEl.innerHTML = svgMarkup;

    return buttonEl;
}

function createTaskActions() {
    const actionsEl = document.createElement("div");
    actionsEl.className = "todo-item-actions";

    const focusButton = createIconButton(["focus-todo-button", "primary-hover"], targetIcon, "Set as current focus");
    const deleteButton = createIconButton(["delete-todo-button", "primary-hover"], trashIcon, "Delete task");

    actionsEl.append(focusButton, deleteButton);
    return actionsEl;
}

function createTaskElement(task) {
    const taskEl = document.createElement("li");
    taskEl.className = "todo-item";
    taskEl.dataset.id = task.id;

    taskEl.append(
        createCheckBox(task),
        createTaskText(task),
        createTaskActions(),
    );

    syncTaskElement(taskEl, task);
    return taskEl;
}

function onTaskChange() {
    setTaskCounter();
    saveTasks(tasks);
}

function insertTaskInOrder(taskEl, task, list) {
    const insertionPoint = [...list.children].find(child => {
        const childTask = findTaskById(child.dataset.id);
        return childTask.createdAt > task.createdAt;
    });

    list.insertBefore(taskEl, insertionPoint ?? null);
}

function isValidTask(title) {
    return title.length > 0 && title.length <= 100;
}

function isCurrentFocusTask(taskId) {
    return currentFocusTask?.id === taskId;
}

function setActiveTaskTitle(taskTitle) {
    activeTask.innerText = taskTitle;
    activeTask.title = taskTitle;
}

function unsetFocusTask() {
    currentFocusTask = null;
    activeTask.innerText = "Select a task to focus...";
    activeTask.title = "Select a task to focus...";
    clearCurrentFocusTask();
}

function clearActiveTasks() {
    tasks = tasks.filter(t => t.completed !== false);

    if (currentFocusTask) unsetFocusTask();

    taskList.replaceChildren();

    onTaskChange();
}

function clearCompletedTasks() {
    tasks = tasks.filter(t => t.completed !== true);
    completedTaskList.replaceChildren();

    onTaskChange();
}

function setTaskCounter() {
    const activeCounter = tasks.filter(t => t.completed === false).length;
    const completedCounter = tasks.length - activeCounter;

    activeTasksCounter.innerText = activeCounter;
    completedTasksCounter.innerText = completedCounter;
}

export function resetTodoForm() {
    input.value = "";
    clearError(taskError);
}
