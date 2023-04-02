var isImportant = false;
const serverUrl = "http://fsdiapi.azurewebsites.net/"

function togglePanel(){
    console.log("button clicked");
    //hide the section/element
    $("#form").slideToggle('slow');
    //$("#form").hide();
}

function saveTask(){
    console.log("Save Clicked");

    const title=$("#txtTitle").val();
    const desc=$("#txtDescription").val();
    const dueDate=$("#txtDueDate").val();
    const duration=$("#txtDuration").val();
    const status=$("#selStatus").val();
    const color=$("#selColor").val();
    const budget=$("#txtBudget").val();


    let task = new Task(title, isImportant, desc, dueDate, duration, status, color, budget);

    // send the obj to server
    $.ajax({
        type:"POST",
        url: serverUrl + "/api/tasks/",
        data: JSON.stringify(task),
        contentType:"application/json",
        success: function(res){
            console.log("Saved Worked", res);
            displayTask(task);
            clearForm();
        },
        error: function(error){
            console.log("Save Failed", error);
            alert("Unexpected Error, task was not saved:(");
        }

    });

}

function clearForm(){
    $("#txtTitle").val("");
    $("#txtDescription").val("");
    $("#txtDueDate").val("");
    $("#txtDuration").val("");
    $("#selStatus").val("");
    $("#selColor").val("#000000");
    $("#txtBudget").val("");
    
}

function formatDate(date){
    let trueDate = new Date(date);//parse date string into date obj

    return trueDate.toLocaleDateString() + " " + trueDate.toLocaleTimeString();

}

function displayTask(task){
    let syntax = `<div class="task" style="border:1px solid ${task.color};"> 
    <div class="info">
        <h5>${task.title}</h5>
        <p>${task.description}</p>
        </div>

        <label>${task.status}</label>

        <label>$${task.budget || 0}</label>


        <div class="dates">
        <label> ${formatDate(task.dueDate)}</label>
        <label> ${task.duration}</label>
        
        </div>

    </div>`;

    $("#pendingTasks").append(syntax);

}

function toggleImportant(){
    const nonImpClasses="fa-regular fa-bookmark not-important";
    const impClasses="fa-solid fa-bookmark important";

    if(isImportant){
        $("#iImportant").removeClass(impClasses).addClass(nonImpClasses);
        isImportant=false;
    }
    else{
        $("#iImportant").removeClass(nonImpClasses).addClass(impClasses);
        isImportant=true;
    }
}

function fetchTasks(){
    //retrieve all the tasks from the server
    $.ajax({
        url: serverUrl + "/api/tasks/",
        type:"GET",
        success: function(response){
            const list = JSON.parse(response);//parse a json string into array/objects
            for(let i=0; i<list.length; i++){
                let record = list [i];
                if(record.name==="Eloim"){
                    displayTask(record);
                }
            }
        },
        error: function(error){
            console.log("Error",error);
        }
    });
}

function init(){
    console.log("Task Manager")

    // retrieve data
    fetchTasks();

    //hook events
    $("#btnShowPanel").click(togglePanel);
    $("#btnSave").click(saveTask);
    $("#iImportant").click(toggleImportant);
}

window.onload = init;

/**
- add the control on the form (add an id)
- update save task to read that value
- update task class to receive that new value
- send the new value when creating a new task (on saveTask fn)
- update the display function to display the budget (css changes may be needed)

 http://fsdiapi.azurewebsites.net/**/
