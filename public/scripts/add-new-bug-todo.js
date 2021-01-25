document.getElementById('add-new-bug-todo-btn').addEventListener('click', () => {
    document.querySelector('.popup-overlay').classList.remove('hidden')
})

document.querySelector('.popup-overlay').addEventListener('click', (e) => {
    if (e.target.tagName === 'DIV') {
        e.target.classList.add('hidden')
    }
})