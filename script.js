class ToDoList {
  constructor(LIST) {
    this.LIST = LIST;
  }
  // ? Display task
  Show_task() {
    const task_container = document.getElementById("task_container");
    let completed_task = 0;
    let uncompleted_task = 0;

    // ? If no task in localstorage
    if (this.LIST[0].description.trim() == "") {
      task_container.innerHTML = `
        <div class="task nothing">
          <h1 class="message-nothing">Nothing in the localStorage</h1>
        </div>
        `;
    } else {
      this.LIST.forEach((elt, index) => {
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
    this.delete_task();
    this.show_status(completed_task, uncompleted_task);
    this.mark_check();
  }
  // ? Show Status
  show_status(completed_task, uncompleted_task) {
    const task_status = document.getElementById("task_status");
    task_status.innerHTML = `
        <h1>${uncompleted_task} uncompleted</h1>
        <h1>${completed_task} completed</h1>
    `;
  }
  // ? Delete Task
  delete_task() {
    const delete_btns = document.querySelectorAll(".delete_btn");
    delete_btns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const UPDATELIST = this.LIST.filter(
          (elt) => elt.id !== parseInt(btn.value),
        );
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
        setTimeout(() => window.location.reload(), 250);
      });
    });
  }
  // ? Mark as Checked
  mark_check() {
    const tasks = document.querySelectorAll(".task");
    tasks.forEach((task) => {
      task.addEventListener("click", (event) => {
        // ? If it's delete button
        if (event.target.classList.contains("delete_btn")) return;

        const span = task.children[0];
        if (span.classList.contains("unchecked")) {
          span.classList = "checked";
          this.change_Status(task.id, true);
        } else {
          span.classList = "unchecked";
          this.change_Status(task.id, false);
        }
      });
    });
  }
  // ? change Status
  change_Status(id, check = true) {
    this.LIST.forEach((elt) => {
      if (elt.id == parseInt(id)) {
        elt.status = check ? "checked" : "unchecked";
      }
    });
    // ? Update LIST in the localstorage
    localStorage.setItem("TODOList", JSON.stringify(this.LIST));
  }
  // ? Task in LIST
  add_task() {
    const task_container = document.getElementById("task_container");
    const input = document.getElementById("task");
    // ? If task description is empty
    if (input.value.trim() === "") return;

    // ? set value and ID
    const value = input.value;
    const ID = this.LIST.length + 1;

    // ? If it's the first task
    if (this.LIST[0].description.trim() == "") {
      this.LIST[0] = { id: 1, description: value, status: "unchecked" };
    } else {
      this.LIST.unshift({ id: ID, description: value, status: "unchecked" });
    }

    localStorage.setItem("TODOList", JSON.stringify(this.LIST));
    input.value = "";
    task_container.innerHTML = "";
    console.log(localStorage.getItem("TODOList"));
    this.Show_task(task_container);
  }
}

const LIST = JSON.parse(localStorage.getItem("TODOList")) || [
  { id: "", description: "", status: "unchecked" },
];

window.addEventListener("load", Onload());
// localStorage.clear()

function Onload() {
  // console.log(localStorage.getItem("TODOList"));
  const ToDo = new ToDoList(LIST);
  const form = document.getElementById("form");
  const task_container = document.getElementById("task_container");

  task_container.innerHTML = "";
  ToDo.Show_task();

  // ? Add task in the List
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    ToDo.add_task();
  });
}
