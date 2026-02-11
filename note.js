const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

const db = firebase.database();
const tasksRef = db.ref("tasks");

function addTask(){
    const text = inputBox.value.trim();
    if(text === ''){
        alert("You must write something");
        return;
    }

    tasksRef.push({
        text,
        checked: false,
        createdAt: firebase.database.ServerValue.TIMESTAMP
    });

    inputBox.value = '';
    
}

listContainer.addEventListener("click", function(e){
    if(e.target.tagName === "LI"){
        const li = e.target;
        const key = li.getAttribute("data-key");
        const isChecked = li.classList.toggle("checked");
        if (key) {
            tasksRef.child(key).update({ checked: isChecked });
        }
    }

    else if(e.target.tagName === "SPAN"){
        const li = e.target.parentElement;
        const key = li.getAttribute("data-key");
        if (key) {
            tasksRef.child(key).remove();
        }
    }
}, false);

function renderTask(key, task){
    const li = document.createElement("li");
    li.setAttribute("data-key", key);
    li.textContent = task.text;
    if (task.checked) {
        li.classList.add("checked");
    }

    const span = document.createElement("span");
    span.innerHTML = "\u00d7";
    li.appendChild(span);
    listContainer.appendChild(li);
}

tasksRef.on("value", function(snapshot){
    listContainer.innerHTML = '';
    const data = snapshot.val() || {};
    Object.entries(data).forEach(([key, task]) => {
        renderTask(key, task);
    });
});
