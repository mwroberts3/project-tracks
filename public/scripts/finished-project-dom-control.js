const finishedProjectList = document.querySelector('.finished-project-list-container')

// Details dropdown
finishedProjectList.addEventListener('click', (e) => {
    if (e.target.classList.contains('show-finished-project-details') || e.target.parentElement.classList.contains('show-finished-project-details')) {
        // if 'Details' is clicked
        if (e.target.nextElementSibling) {
            e.target.nextElementSibling.nextElementSibling.classList.toggle('hidden')
            e.target.parentElement.classList.toggle('height-adjustment')
            e.target.children[0].classList.toggle('fa-chevron-down')
            e.target.children[0].classList.toggle('fa-chevron-up')
        // if icon is clicked
        } else {
            e.target.classList.toggle('fa-chevron-down')
            e.target.classList.toggle('fa-chevron-up')
            e.target.parentElement.nextElementSibling.nextElementSibling.classList.toggle('hidden')
            e.target.parentElement.parentElement.classList.toggle('height-adjustment')
        }
    }
})

// Exit popup listener
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('popup-overlay')) {
        window.location.href = "/finished-projects"
    }
})