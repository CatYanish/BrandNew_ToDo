console.log('JS sourced');
var completedTaskId;

$('document').ready(function() {
  console.log('jQuery sourced');
  clickEvent();
  getTasks();
  completeTask();
  deleteButton();
});

//function receives new task data and calls ajax post request
function clickEvent() {
  $('#addTask').on('click', function() {
    console.log('add task button clicked');
    var taskToSend = {
      taskname: $('#task').val(),
      details: $('#details').val()
    };
    console.log('task to send is: ', taskToSend);
    addTask(taskToSend);
  }); //end of click event
} //end clickEvent function

//ajax post new data
function addTask(taskInfo) {
  $.ajax({
    type: 'POST',
    url: '/task',
    data: taskInfo,
    success: function(response) {
      console.log('successfully posted data');
      getTasks();
    }
  });//end of ajax post
} //end of addTask function

//ajax get request to receive all tasks
function getTasks(){
  console.log( 'in getTasks' );
  $.ajax({
    url: '/task',
    type: 'GET',
    success: function( response ){
      console.log( 'got some tasks: ', response );
      console.log('response.tasks: ', response.tasks);
      appendToDom(response.tasks);
    } // end success
  }); //end ajax
} // end getTasks



//append all tasks to DOM
function appendToDom(tasks) {
  $('#viewTaskList').empty();
  for(var i = 0; i < tasks.length; i += 1) {
    var task = tasks[i];
    $tr = $('<tr></tr>');
    $tr.data('tasks', task);
    $tr.append('<td>' + task.taskname + '</td>');
    $tr.append('<td>' + task.details + '</td>');
    $tr.append('<td><button class="completeBtn" data-taskid="' + task.id + '">Mark as Completed</button></td>');
    $tr.append('<td><button class="deleteBtn" data-taskid="' + task.id + '">Delete</button></td>');
    addClass(task.completed);
    $('#viewTaskList').append($tr);
  }
}
//this function will visually indicate if a task has been marked complete
function addClass(taskCompleted){
  if(taskCompleted) {
    $tr.addClass("complete");
  }
}

//clicking complete button will update server
function completeTask() {
  $('#viewTaskList').on('click', '.completeBtn', function(){
    var selectedTask = $(this).parent().parent();
    completedTaskId = $(this).data('taskid');
    updateTask(completedTaskId);
  }); //end of on click function
}

//ajax put request to update a task to completed
function updateTask(completedTaskId) {
  $.ajax({
    type: 'PUT',
    url: '/task',
    data: {completedTaskId: completedTaskId },
    success: function(response) {
      console.log(response);
    }
  });
  getTasks();
}


// Function called when delete button is clicked
function deleteButton() {
  $('#viewTaskList').on('click', '.deleteBtn', function(){
    console.log('delete button clicked');
    var taskId = $(this).data('taskid');
    console.log(taskId);
    console.log('Delete book with id of :', taskId);
    //this function creates a confirm pop up, using third party library
      $.confirm({
      title: 'Are you sure you want to delete this task?',
      content: 'Select a button to confirm',
      buttons: {
        confirm: function () {
          deleteBook(taskId);
        },
        cancel: function () {
          $.alert('Canceled!');
        },
      }
    }); //end of confirm function
  }); //end delete click listener
} //end delete click function

// DELETE
function deleteBook(task) {
  $.ajax({
    type: 'DELETE',
    url: '/task/' + task,
    success: function(response) {
      console.log(response);
      getTasks();
    }
  }); //end of ajax function
} //end of delete function
