let Input;
let errorInfo;
let addBtn; 
let ulList;

let popup;
let popupInfo;
let popupInput; 
let popupAddBtn;
let popupCloseBtn; 

let todoArray = []; // Array to store the to-do items
let todoToEditIndex; // To keep track of the index of the item being edited

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();
}

const prepareDOMElements = () => {
    Input = document.querySelector('.todo-input');
    errorInfo = document.querySelector('.error-info');
    addBtn = document.querySelector('.btn-add');
    ulList = document.querySelector('.todolist ul');

    popup = document.querySelector('.popup');
    popupInfo = document.querySelector('.popup-info');
    popupInput = document.querySelector('.popup-input');
    popupAddBtn = document.querySelector('.accept');
    popupCloseBtn = document.querySelector('.cancel');
}

const prepareDOMEvents = () => {
    addBtn.addEventListener('click', addNewToDo);
    ulList.addEventListener('click', checkClick);
    popupCloseBtn.addEventListener('click', closePopup);
    popupAddBtn.addEventListener('click', changeTodoText);
    Input.addEventListener('keyup', enterKeyCheck);
}

const addNewToDo = () => {
    if (Input.value.trim() !== '') {
        todoArray.push(Input.value); // Add new item to the array
        renderTodoList();
        Input.value = '';
        errorInfo.textContent = '';

        // SweetAlert for successful addition
        Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: 'Your task has been added.',
            showConfirmButton: false,
            timer: 1500
        });

    } else {
        errorInfo.textContent = 'Please input a task';

        // SweetAlert for missing input
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please input a task!',
        });
    }
}

const renderTodoList = () => {
    ulList.innerHTML = ''; // Clear the current list
    todoArray.forEach((todo, index) => {
        const newToDo = document.createElement('li');
        newToDo.textContent = todo;
        createToolAreal(newToDo, index);
        ulList.append(newToDo);
    });
}

const createToolAreal = (todoItem, index) => {
    const div = document.createElement('div');
    div.classList.add('tools');

    const buttonDone = document.createElement('button');
    buttonDone.classList.add('complete');
    buttonDone.innerHTML = '<i class="fas fa-check"></i>'

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit');
    buttonEdit.textContent = 'EDIT';

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('delete');
    buttonCancel.innerHTML = '<i class="fas fa-times"></i>'

    div.append(buttonDone, buttonEdit, buttonCancel);
    todoItem.append(div);

    // Add data-index attribute to track which todo item this belongs to
    todoItem.setAttribute('data-index', index);
}

const checkClick = (e) => {
    if (e.target.matches('.complete')) {
        e.target.closest('li').classList.toggle('completed');
        e.target.classList.toggle('completed');
    } else if (e.target.matches('.edit')) {
        editToDo(e);
    } else if (e.target.matches('.delete')) { 
        deleteToDo(e);
    }
}

const editToDo = (e) => { 
    const todoItem = e.target.closest('li');
    todoToEditIndex = todoItem.getAttribute('data-index'); // Get index of the item being edited

    // SweetAlert for editing confirmation
    Swal.fire({
        title: 'Edit Task',
        input: 'text',
        inputLabel: 'Update your task',
        inputValue: todoArray[todoToEditIndex],
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Cancel',
        inputValidator: (value) => {
            if (!value) {
                return 'You need to write something!';
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            todoArray[todoToEditIndex] = result.value; // Update the item in the array
            renderTodoList();

            Swal.fire({
                icon: 'success',
                title: 'Updated!',
                text: 'Your task has been updated.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

const closePopup = () => {
    popup.style.display = 'none';
    popupInfo.textContent = '';
}

const deleteToDo = (e) => {
    const todoItem = e.target.closest('li');
    const index = todoItem.getAttribute('data-index'); // Get the index of the item to be deleted

    // SweetAlert for deletion confirmation
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            todoArray.splice(index, 1); // Remove the item from the array
            renderTodoList();
            if (todoArray.length === 0) {
                errorInfo.textContent = 'No tasks left in the list.';
            }

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Your task has been deleted.',
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
}

const enterKeyCheck = (e) => {
    if (e.key === 'Enter') {
        addNewToDo();
    }
}

document.addEventListener('DOMContentLoaded', main);
