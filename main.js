const fs = require('fs');
const readline = require('readline');
const { exit } = require('process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const dataFile = 'todos.json';
let todos = loadTodos();

function saveTodos() {
  const todosJSON = JSON.stringify(todos, null, 2);
  fs.writeFileSync(dataFile, todosJSON);
}

function loadTodos() {
  try {
    const todosData = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(todosData) || [];
  } catch (error) {
    return [];
  }
}

function displayMenu() {
  console.log('\nTodo List Menu:');
  console.log('1. Add Todo');
  console.log('2. Edit Todo');
  console.log('3. Remove Todo');
  console.log('4. Check Todo');
  console.log('5. Uncheck Todo');
  console.log('6. List All Todos');
  console.log('7. List Completed Todos');
  console.log('8. List Uncompleted Todos');
  console.log('9. Quit');
}

function addTodo(title, body) {
  todos.push({ title, body, completed: false });
  console.log('Todo added successfully.');
  saveTodos();
  displayMenu();
  processMenuChoice();
}

function editTodo(todoId, title, body) {
  if (isValidIndex(todoId)) {
    todos[todoId].title = title;
    todos[todoId].body = body;
    console.log('Todo edited successfully.');
    saveTodos();
    displayMenu();
    processMenuChoice();
  } else {
    console.log('Invalid todo ID. Please try again.');
    processMenuChoice();
  }
}

function removeTodo(todoId) {
  if (isValidIndex(todoId)) {
    todos.splice(todoId, 1);
    console.log('Todo removed successfully.');
    saveTodos();
    displayMenu();
    processMenuChoice();
  } else {
    console.log('Invalid todo ID. Please try again.');
    processMenuChoice();
  }
}

function checkTodo(todoId) {
  if (isValidIndex(todoId)) {
    todos[todoId].completed = true;
    console.log('Todo checked successfully.');
    saveTodos();
    displayMenu();
    processMenuChoice();
  } else {
    console.log('Invalid todo ID. Please try again.');
    processMenuChoice();
  }
}

function uncheckTodo(todoId) {
  if (isValidIndex(todoId)) {
    todos[todoId].completed = false;
    console.log('Todo unchecked successfully.');
    saveTodos();
    displayMenu();
    processMenuChoice();
  } else {
    console.log('Invalid todo ID. Please try again.');
    processMenuChoice();
  }
}

function listTodos(filter) {
  console.log('\nTodo List:');
  todos.forEach((todo, index) => {
    if (!filter || (filter === 'checked' && todo.completed) || (filter === 'unchecked' && !todo.completed)) {
      console.log(`${index}. [${todo.completed ? 'X' : ' '}] ${todo.title} - ${todo.body}`);
    } else if (!filter || filter === 'all') {
      console.log(`${index}. [${todo.completed ? 'X' : ' '}] ${todo.title} - ${todo.body}`);
    }
  });
  displayMenu();
  processMenuChoice();
}

function processMenuChoice() {
  rl.question('Enter your choice (1-9): ', (choice) => {
    switch (choice) {
      case '1':
        rl.question('Enter todo title: ', (title) => {
          rl.question('Enter todo body: ', (body) => {
            addTodo(title, body);
          });
        });
        break;
      case '2':
        rl.question('Enter todo ID to edit: ', (todoId) => {
          rl.question('Enter new todo title: ', (title) => {
            rl.question('Enter new todo body: ', (body) => {
              editTodo(todoId, title, body);
            });
          });
        });
        break;
      case '3':
        rl.question('Enter todo ID to remove: ', (todoId) => {
          removeTodo(todoId);
        });
        break;
      case '4':
        rl.question('Enter todo ID to check: ', (todoId) => {
          checkTodo(todoId);
        });
        break;
      case '5':
        rl.question('Enter todo ID to uncheck: ', (todoId) => {
          uncheckTodo(todoId);
        });
        break;
      case '6':
        listTodos('all');
        break;
      case '7':
        listTodos('checked');
        break;
      case '8':
        listTodos('unchecked');
        break;
      case '9':
        rl.close();
        break;
      default:
        console.log('Invalid choice. Please try again.');
        processMenuChoice();
    }
  });
}

function isValidIndex(index) {
  return index >= 0 && index < todos.length;
}

// Handle command-line arguments
const [, , command, firstArg, secondArg, thirdArg] = process.argv;

switch (command) {
  case 'add':
    addTodo(firstArg, secondArg);
    break;
  case 'edit':
    editTodo(parseInt(firstArg), secondArg, thirdArg);
    break;
  case 'remove':
    removeTodo(parseInt(firstArg));
    break;
  case 'check':
    checkTodo(parseInt(firstArg));
    break;
  case 'uncheck':
    uncheckTodo(parseInt(firstArg));
    break;
  case 'list':
    if (firstArg === 'all' || firstArg === 'checked' || firstArg === 'unchecked') {
      listTodos(firstArg);
    } else {
      console.log('Invalid list filter. Please provide "all", "checked", or "unchecked".');
      exit(1);
    }
    break;
  default:
    console.log('Invalid command. Please use "add", "edit", "remove", "check", "uncheck", or "list".');
    exit(1);
    break;
}
