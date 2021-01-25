const FinishedProject = require('../models/finished-project')

exports.getFinishedProjects = (req, res, next) => {
    let editing = req.query.editing
    editing = (editing == 'true')

    FinishedProject.loadAllFinishedProjects().then((finishedProjects) => {
        res.render('finished-projects', {pageTitle: 'Finished Projects', finishedProjects, selectedOriginalIdea: false,
        selectedProject: false,
        editing
        })
    })
    .catch((err) => console.log(err))
}

exports.getOriginalIdea = (req, res, next) => {
    let editing = req.query.editing
    editing = (editing == 'true')

    FinishedProject.loadAllFinishedProjects().then((finishedProjects) => {
        FinishedProject.getOriginalIdea(req.params.ideaId)
            .then((selectedOriginalIdea) => {
                res.render('finished-projects', {
                    pageTitle: 'Finished Projects',
                    finishedProjects, 
                    selectedOriginalIdea,
                    selectedProject: false,
                    editing
                })
            })
            .catch((err) => console.log(err))
    })
    .catch((err) => console.log(err))

}

exports.getIterativeNotes = (req, res, next ) => {
    let editing = req.query.editing
    editing = (editing == 'true')

    FinishedProject.loadAllFinishedProjects().then((finishedProjects) => {
    FinishedProject.getIterativeNotes(req.params.projectId)
        .then((selectedProject) => {
            res.render('finished-projects', {
                pageTitle: 'Finished Projects',
                finishedProjects, 
                selectedOriginalIdea: false, 
                selectedProject,
                editing
            })
        })
        .catch((err) => console.log(err))

    })
    .catch((err) => console.log(err))
}

exports.postEditIterativeNotes = (req, res, next) => {
    FinishedProject.editIterativeNotes(req.body.projectId, req.body.finishedProjectWebsite, req.body.iterativeNotes)
        .then(() => {
            res.redirect('/finished-projects')
        })
        .catch((err) => console.log(err))
}

exports.postReactivateProject = (req, res, next) => {
    FinishedProject.reactivateProject(req.body.finishedProjectId, req.body.activeProjectId)
        .then(() => {
            res.redirect('/finished-projects')
        })
        .catch((err) => console.log(err))
}
