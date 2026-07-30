import { clearError } from "./errors.js";
import { loadShouldOpenSidebar, setShouldOpenSidebar } from "./storage.js";
import { resetTodoForm } from "./todo.js";

const sidebar = document.getElementById("sidebar");
const openSidebarButton = document.getElementById("open-sidebar-button");
const closeSidebarButton = document.getElementById("close-sidebar-button");

let shouldOpenSidebar;

export function initSidebar() {
    shouldOpenSidebar = loadShouldOpenSidebar();
    shouldOpenSidebar ? openSidebar() : closeSidebar();
    openSidebarButton.addEventListener("click", openSidebar);
    closeSidebarButton.addEventListener("click", closeSidebar);
}

function openSidebar() {
    sidebar.classList.remove("sidebar--collapsed");
    setShouldOpenSidebar(true);
}

function closeSidebar() {
    sidebar.classList.add("sidebar--collapsed");
    resetTodoForm();
    setShouldOpenSidebar(false);
}
