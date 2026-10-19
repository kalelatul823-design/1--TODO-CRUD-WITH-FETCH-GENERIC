let cl = console.log;

const spinner = document.getElementById("spinner");
const todoController = document.getElementById("todoController");
const todoForm = document.getElementById("todoForm")
const todoItemControl = document.getElementById("todoItem");
const descriptionControl = document.getElementById("description");
const isCompletedControl = document.getElementById("isCompleted");
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")


let BASE_URL =
  "https://fetch-api-crud-c0cc4-default-rtdb.asia-southeast1.firebasedatabase.app";

let TODO_URL = `${BASE_URL}/todo1.json`;

let state = {
  todoArr: [],
  editId: null,
};

function handleSpinner() {
  spinner.classList.toggle("d-none");
}

// snackBar
function snackBar(msg, icon) {
  Swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
}

//generic function
function makeApiCall(url, methodType, msgBody = null) {
  let body = msgBody ? JSON.stringify(msgBody) : null;
  return fetch(url, {
    method: methodType,
    body: body,
    headers: {
      "content-type": "application/json",
      Authrization: "JWT TOKEN",
    },
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error();
      }

      return res.json();
    })
    .catch((err) => {
      snackBar(`Something went wrrong`, `error`);
    })
    .finally(() => {
      handleSpinner();
    });
}

//read
function showUi() {
  handleSpinner();
  makeApiCall(TODO_URL, "GET")
    .then((data) => {
      cl(data);
      let arr = Object.entries(data);
      let arr2 = arr.map((data) => {
        data[1].id = data[0];
        state.todoArr.push(data[1]);
        cl(state.todoArr)
      });
      templetingUi(state.todoArr)
    })
    .catch((err) => {
      snackBar(`Something went wrrong`, `error`);
    });
}



function templetingUi(arr){
    let result = "";
    arr.forEach((ele)=>{
        result  += `<li class="list-group-item" id="${ele.id}">
                  <div
                    class="d-flex justify-content-between"
                    onclick="toggleDescription(this)"
                  >
                    <div>
                      ${ele.isCompleted ? `<input type="checkbox" onclick=" event.stopPropagation(); onCheck(this)" checked/>` : `<input type="checkbox" onclick=" event.stopPropagation(); onCheck(this)"/>`} 
                      <strong>${ele.todoItem}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >Edit</button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >Delete</button>
                    </div>
                  </div>
                  <div class="collapse">
                    <div class="card-body">
                      ${ele.description}
                      
                    </div>
                  </div>
                </li>`
    })
    todoController.innerHTML = result;
}


showUi()


//create
function onAddTodo(eve){
    eve.preventDefault();
    let newObj = {
        todoItem : todoItemControl.value,
        description : descriptionControl.value,
        isCompleted : isCompletedControl.value === "yes" ? true : false 
    }
    handleSpinner()
    makeApiCall(TODO_URL, "POST", newObj)
    .then((data)=> {
        cl(data);
        newObj.id = data.name;
        state.todoArr.push(newObj);
        let li = document.createElement("li")
        li.id = data.id
        li.className = `list-group-item`;
        li.innerHTML = `<div
                    class="d-flex justify-content-between"
                    onclick="toggleDescription(this)"
                  >
                    <div>
                      ${newObj.isCompleted ? `<input type="checkbox" onclick=" event.stopPropagation(); onCheck(this)" checked/>` : `<input type="checkbox" onclick=" event.stopPropagation(); onCheck(this)"/>`} 
                      <strong>${newObj.todoItem}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >Edit</button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >Delete</button>
                    </div>
                  </div>
                  <div class="collapse">
                    <div class="card-body">
                      ${newObj.description}
                      
                    </div>
                  </div>`
                  todoController.append(li)
                  todoForm.reset()
                  snackBar(`todo is created successfully`, `success`)
    })
    .catch((err)=>{
        snackBar(`Something went wrrong`, `error`);
    })
}

//edit 
function onTodoEdit(ele){
    let editId = ele.closest("li").id;
    state.editId = editId;
    let editObj = state.todoArr.find(ele => ele.id === editId);
    todoItemControl.value = editObj.todoItem;
    descriptionControl.value = editObj.description;
    isCompletedControl.value = editObj.isCompleted  ? "yes" : "no"

    addBtn.classList.add("d-none")
    updateBtn.classList.remove("d-none")
}


//update
function onUpdateTodo(ele){
    let updateId = state.editId;
    let UPDATE_URL = `${BASE_URL}/todo1/${updateId}.json`
    let updateIndex = state.todoArr.findIndex(ele => ele.id === updateId);
    let updateObj = {
        todoItem : todoItemControl.value,
        description : descriptionControl.value,
        isCompleted : isCompletedControl.value === "yes" ? true : false 
    }
    state.todoArr[updateIndex] = updateObj
    handleSpinner()
    makeApiCall(UPDATE_URL, "PATCH", updateObj)
    .then((data)=>{
         let li = document.getElementById(updateId);
         li.innerHTML = `<div
                    class="d-flex justify-content-between"
                    onclick="toggleDescription(this)"
                  >
                    <div>
                      ${updateObj.isCompleted ? `<input type="checkbox" onclick=" event.stopPropagation(); onCheck(this)" checked/>` : `<input type="checkbox" onclick=" event.stopPropagation(); onCheck(this)"/>`} 
                      <strong>${updateObj.todoItem}</strong>
                    </div>
                    <div>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoEdit(this);
                        "
                        class="btn btn-sm btn-primary"
                      >Edit</button>
                      <button
                        onclick="
                          event.stopPropagation();
                          onTodoRemove(this);
                        "
                        class="btn btn-sm btn-danger"
                      >Delete</button>
                    </div>
                  </div>
                  <div class="collapse">
                    <div class="card-body">
                      ${updateObj.description}
                      
                    </div>
                  </div>`
                  todoForm.reset()
                  state.editId = null;
                  updateBtn.classList.add("d-none");
                  addBtn.classList.remove("d-none");
                  snackBar(`todo is Updated successfully`, `success`)
    })
    .catch((err)=>{
        snackBar(`Something went wrrong`, `error`);
    })
}

//remove
function onTodoRemove(ele){
  Swal.fire({
  title: "Are you sure?",
  text: "You won't be able to revert this!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!"
}).then((result) => {
  if (result.isConfirmed) {
    let removeId = ele.closest("li").id;
   let REMOVE_URL = `${BASE_URL}/todo1/${removeId}.json`
   handleSpinner()
   makeApiCall(REMOVE_URL, "DELETE",)
   .then((data)=>{
      let getIndex = state.todoArr.findIndex(ele=> ele.id === removeId);
      state.todoArr.splice(getIndex, 1);
      ele.closest("li").remove()
      snackBar(`todo is deleted successfully`, `success`)
   })
   .catch((err)=>{
    snackBar(`something went wrong`, `error`)
   })
  }
});

}


function onCheck(obj){
    let todoId = obj.closest("li").id;
    let updateObj = {
        isCompleted : obj.checked
    }
    let updateUrl = `${BASE_URL}/todo1/${todoId}.json`;
    handleSpinner()
    makeApiCall(updateUrl, "PATCH", updateObj)
    .then((data)=>{
        let getIndex = state.todoArr.findIndex(ele => ele.id === todoId)
        state.todoArr[getIndex].isCompleted = obj.checked
    })
    .catch((err)=>{
        snackBar(`something went wrong`, `error`)
    })
}

function toggleDescription(ele){
    let description = ele.nextElementSibling;
    let isOpen = description.classList.contains("show");
    let allDescription = ele.closest("#todoController").querySelectorAll(".collapse");

    allDescription.forEach(ele => ele.classList.remove("show"))
    if(!isOpen){
        description.classList.add("show")
    }
}

todoForm.addEventListener("submit", onAddTodo);
updateBtn.addEventListener("click", onUpdateTodo)
