const LIST = JSON.parse(localStorage.getItem("TODOList")) || [
  { id: "", description: "", status: "unchecked" },
];
window.addEventListener("load", Onload());
// localStorage.clear()

function Onload() {
  console.log(localStorage.getItem("TODOList"));
  const form = document.getElementById("form");
  const task_container = document.getElementById("task_container");

  task_container.innerHTML = "";
  Show_task(task_container);

  // ? Add task in the List
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const input = document.getElementById("task");
    // ? If task description is empty
    if (input.value.trim() === "") return;

    // ? set value and ID
    const value = input.value;
    const ID = LIST.length + 1;

    // ? If it's the first task
    if (LIST[0].description.trim() == "") {
      LIST[0] = { id: 1, description: value, status: "unchecked" };
    } else {
      LIST.unshift({ id: ID, description: value, status: "unchecked" });
    }

    localStorage.setItem("TODOList", JSON.stringify(LIST));
    input.value = "";
    task_container.innerHTML = "";
    Show_task(task_container);
  });
}

// ? Display task
function Show_task(task_container) {
  let completed_task = 0;
  let uncompleted_task = 0;

  // ? If no task in localstorage
  if (LIST[0].description.trim() == "") {
    task_container.innerHTML = `
        <div class="task nothing">
            <h1 class="message-nothing">Nothing in the localStorage</h1>
        </div>
        `;
  } else {
    LIST.forEach((elt, index) => {
      elt.status === "checked" ? completed_task++ : uncompleted_task++;
      task_container.innerHTML += `
        <div class="task" id=${elt.id}>
              <span class=${elt.status}></span>
            <p>
              #${elt.id} ${elt.description}
            </p>
            <button type="button" value=${elt.id} class="delete_btn" >Delete</button>
          </div>
        `;
    });
  }
  delete_task();
  show_status(completed_task, uncompleted_task);
  mark_check();
}

// ? Show Status
function show_status(completed_task, uncompleted_task) {
  const task_status = document.getElementById("task_status");
  task_status.innerHTML = `
        <h1>${uncompleted_task} uncompleted</h1>
        <h1>${completed_task} completed</h1>
    `;
}

// ? Delete Task
function delete_task() {
  const delete_btns = document.querySelectorAll(".delete_btn");
  delete_btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const UPDATELIST = LIST.filter((elt) => elt.id !== parseInt(btn.value));
      // ? Update localStorage
      localStorage.setItem(
        "TODOList",
        JSON.stringify(
          UPDATELIST.length !== 0
            ? UPDATELIST
            : [{ id: "", description: "", status: "unchecked" }],
        ),
      );
      // ? Waiting time before deletion
      setTimeout(() => window.location.reload(), 300);
    });
  });
}

// ? Mark as Checked
function mark_check() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.addEventListener("click", (event) => {
      // ? If it's delete button
      if (event.target.classList.contains("delete_btn")) return;

      const span = task.children[0];
      if (span.classList.contains("unchecked")) {
        task.children[0].classList = "checked";
        change_Status(task.id, true);
      } else {
        task.children[0].classList = "unchecked";
        change_Status(task.id, false);
      }
    });
  });
}

// ? change Status
function change_Status(id, check = true) {
  LIST.forEach((elt) => {
    if (elt.id == parseInt(id)) {
      elt.status = check ? "checked" : "unchecked";
    }
  });
  // ? Update LIST in the localstorage
  localStorage.setItem("TODOList", JSON.stringify(LIST));
}
