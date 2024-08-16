document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');

    // Check if user is logged in
    if (token) {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('logout-button').style.display = 'block';
        document.getElementById('todo-form').style.display = 'block';
        fetchTodos(); // Fetch and display todos
    } else {
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('logout-button').style.display = 'none';
        document.getElementById('todo-form').style.display = 'none';
    }
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    const response = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    if (data.token) {
        localStorage.setItem('token', data.token);
        alert('Login successful!');
        location.reload(); // Reload the page to refresh the UI
    } else {
        alert('Login failed!');
    }
});

document.getElementById('logout-button').addEventListener('click', () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
    location.reload(); // Reload the page to refresh the UI
});

// Fetch todos from the backend
async function fetchTodos() {
    const token = localStorage.getItem('token');
    const response = await fetch('/todos', {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    const todos = await response.json();
    displayTodos(todos);
}

// Display todos in the UI
function displayTodos(todos) {
    const todoContainer = document.getElementById('todo-container');
    todoContainer.innerHTML = ''; // Clear previous todos
    todos.forEach(todo => {
        const todoElement = document.createElement('div');
        todoElement.textContent = todo.title;
        todoContainer.appendChild(todoElement);
    });
}

// Handle creating a new todo
document.getElementById('todo-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = e.target.title.value;

    const token = localStorage.getItem('token');
    const response = await fetch('/todos', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });

    const newTodo = await response.json();
    fetchTodos(); // Refresh the todo list




    
});
