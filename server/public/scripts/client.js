console.log('JS sourced');
var completedTaskId;

$('document').ready(function() {
  console.log('jQuery sourced');
  clickEvent();
  getTasks();
  completeTask();
  deleteButton();
});

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




function appendToDom(tasks) {
  // Remove koalas that currently exist in the table
  $('#viewTaskList').empty();
  for(var i = 0; i < tasks.length; i += 1) {
    var task = tasks[i];
    // For each koalas, append a new row to our table
    $tr = $('<tr></tr>');
    $tr.data('tasks', task);
    $tr.append('<td>' + task.taskname + '</td>');
    $tr.append('<td>' + task.details +'</td>');
    $tr.append('<td><button class="deleteBtn" data-taskid="' + task.id + '">Delete</button></td>');
    console.log(task.completed);
    addClass(task.completed);
    $tr.append('<td><button class="completeBtn" data-taskid="' + task.id + '">Mark as Completed</button></td>');
    $('#viewTaskList').append($tr);
  }
}

function addClass(taskCompleted){
  if(taskCompleted) {
    $tr.addClass("complete");
  }
}


function completeTask() {
  $('#viewTaskList').on('click', '.completeBtn', function(){
    console.log('complete');
    var selectedTask = $(this).parent().parent();
    completedTaskId = $(this).data('taskid');
    console.log(completedTaskId);
    // console.log(selectedTask);
    // $(selectedTask).addClass("complete"); //kinda sketchy

    updateTask(completedTaskId);
  }); //end of on click function
}

function updateTask(completedTaskId) {
  $.ajax({
     type: 'PUT',
     url: '/task',
        data: {completedTaskId: completedTaskId },
        success: function(response) {
          console.log(response);
        }
  });
  // getTasks();
}


// Function called when delete button is clicked
function deleteButton() {
$('#viewTaskList').on('click', '.deleteBtn', function(){
  console.log('delete button clicked');
  // We attached the bookid as data on our button
  var taskId = $(this).data('taskid');
  console.log(taskId);
  console.log('Delete book with id of :', taskId);
  deleteBook(taskId);
});
}

// DELETE
function deleteBook(task) {
  // When using URL params, your url would be...
  // '/books/' + bookId
  $.ajax({
    type: 'DELETE',
    url: '/task/' + task,
    success: function(response) {
      console.log(response);
      getTasks();
    }
  }); //end of ajax function
} //end of deleteBook function
