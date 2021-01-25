const ActiveProject = require('../models/active-project')

exports.getActiveProjects = (req, res, next) => {
    ActiveProject.loadAllActiveProjects()
    .then((activeProjects) => {
        res.render('active-projects', {pageTitle: 'Active Projects', activeProjects, finished: false, projectId: null})
    })
    .catch((err) => console.log(err))
}

exports.addHoursToProject = (req, res, next) => {
    // get selected active project id
    ActiveProject.addHours(req.body.projectId, req.body.hoursWorked).then(() => {
        res.redirect('/active-projects')
    })
    .catch((err) => console.log(err))
}

exports.getBugsAndTodo = (req, res, next) => {
    let editMode = req.query.edit
    editMode = (editMode == 'true')

    let selectedTask = { _id: req.query.taskId, title: req.query.taskTitle, content: req.query.taskContent }

    ActiveProject.viewBugsAndTodo(req.params.projectId)
        .then((project) => {
            res.render('bugs-and-todo', {
                pageTitle: 'Active Projects', 
                projectId: req.params.projectId,
                bugsAndTodo: project.bugsAndTodo, 
                editMode, 
                selectedTask
            })
        })
        .catch((err) => console.log(err))
}

exports.postAddTask = (req, res, next) => {
    let editing = req.body.editing
    editing = (editing == 'true')

    if (!editing) {
        ActiveProject.addNewTask(req.body.projectId, req.body.taskTitle, req.body.taskDesc)
            .then(() => {
                res.redirect(`/active-projects/view-bugs-and-todo/${req.body.projectId}`)
            })
            .catch((err) => console.log(err))
    } else {
        let selectedTask = { _id: req.body.taskId, title: req.body.taskTitle, content: req.body.taskDesc }

        ActiveProject.editTask(req.body.projectId, selectedTask)
            .then(() => {
                res.redirect(`/active-projects/view-bugs-and-todo/${req.body.projectId}`)
            })
            .catch((err) => console.log(err))
    }
    }

exports.postDeleteTask = (req, res, next) => {
    ActiveProject.deleteTask(req.body.projectId, req.body.taskId)
        .then(() => {
            res.redirect(`/active-projects/view-bugs-and-todo/${req.body.projectId}`)
        })
        .catch((err) => console.log(err))
}

exports.postDeleteActiveProject = (req, res, next) => {
    ActiveProject.deleteActiveProject(req.body.projectId)
        .then(() => {
            res.redirect('/active-projects')
        })
        .catch((err) => console.log(err))
}

exports.getFinishedProjectPopup = (req, res, next) => {
    ActiveProject.loadAllActiveProjects()
    .then((activeProjects) => {
        res.render('active-projects', {pageTitle: 'Active Projects', activeProjects, finished: true, projectId: req.params.projectId})
    })
    .catch((err) => console.log(err))
}

exports.postFinishedProject = (req, res, next) => {
    ActiveProject.finishProject(req.body.projectId, req.body.finishedProjectVersion, req.body.finishedProjectWebsite, req.body.iterativeNotes)
        .then(() => {
            res.redirect('/active-projects')
        })
        .catch((err) => console.log(err))
}