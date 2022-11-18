const url = 'https://jsonplaceholder.typicode.com/users'
const jsButton = document.querySelector('.js-btn')
const fetchButton = document.querySelector('.fetch-btn')
const firstBlock = document.querySelector('.first-block')
const secondBlock = document.querySelector('.second-block')


jsButton.addEventListener('click', handleJsButton)
fetchButton.addEventListener('click', handleFetchButton)

function handleJsButton(e) {
    const xhr = new XMLHttpRequest()

    loading(e)

    xhr.open('GET', url)

    xhr.onload = () => {
        const data = JSON.parse(xhr.response)
        renderUsersInFirstBlock(data)
        jsButton.innerHTML = 'Load by JS'
    }

    xhr.send()
}

function handleFetchButton(e) {
    loading(e)

    fetch(url)
        .then(response => response.json())
        .then(data => renderUsersInSecondBlock(data))
        .then(() => {
            addChangeBlock()
            deleteUser()
        })
        .finally(() => {
            fetchButton.innerHTML = 'Load by Fetch'
        })
}

function renderUsersInFirstBlock(data) {
    data.forEach(user => {
        const userBlock = document.createElement('div')
        userBlock.classList.add('user')
        userBlock.innerText = user.name
        firstBlock.append(userBlock)
    })
}

function renderUsersInSecondBlock(data) {
    data.forEach(user => {
        const userBlock = document.createElement('div')
        userBlock.classList.add('user-fetch')
        userBlock.innerHTML = `
<div class="user-name">${user.name}</div>
<div class="user-buttons">
<button class="user-button edit-btn">Edit</button>
<button class="user-button delete-btn">Delete</button>
</div>
`
        secondBlock.append(userBlock)
    })
}

function addChangeBlock() {
    const editButton = document.querySelectorAll('.edit-btn')
    editButton.forEach(button => {
        button.addEventListener('click', handleEditButton)
    })
}

function handleEditButton(e) {
    const userBlock = e.target.closest('.user-fetch')
    userBlock.innerHTML += `
    <div class="change">
    <input class="change-input" type="text">
    <button class="save-btn">Save</button>
</div>
    `
    const saveButton = document.querySelector('.save-btn')
    saveButton.addEventListener('click', handleSaveButton)
}

function handleSaveButton(e) {
    let newUserName = e.target.previousElementSibling.value
    const id = getUserId(e)

    loading(e)

    fetch(`${url}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            name: newUserName
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(response => response.json())
        .then(updatedUser => updateUser(updatedUser, e));
}

function updateUser(updatedUser, e) {
    const currentBlock = e.target.closest('.user-fetch')
    const userName = currentBlock.firstElementChild

    userName.innerText = updatedUser.name

    const changeBlock = e.target.parentElement
    changeBlock.innerHTML = null

    addChangeBlock()
    deleteUser()
}

function getUserId(e) {
    const secondBlock = document.querySelector('.second-block')
    const usersBlocks = Array.from(secondBlock.childNodes)
    const currentUser = e.target.closest('.user-fetch')
    return usersBlocks.indexOf(currentUser) + 1
}

function deleteUser() {
    const deleteButtons = document.querySelectorAll('.delete-btn')
    deleteButtons.forEach(delBtn => {
        delBtn.addEventListener('click', handleDeleteButton)
    })
}

function handleDeleteButton(e) {
    const id = getUserId(e)

    loading(e)

    fetch(`${url}/${id}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(() => {
            alert(`User with id – ${id} was deleted`)
            const currentUser = e.target.closest('.user-fetch')

            currentUser.innerHTML = null
            currentUser.classList.add('hidden')
        })
}

function loading(e) {
    e.target.innerHTML = '...loading'
}