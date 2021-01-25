const ProjectIdea = require('../models/project-idea')

const moment = require('moment')

exports.getProjectIdeas = (req, res, next) => {
    ProjectIdea.loadAllProjectIdeas()
        .then((allProjectIdeas) => {
        res.render('project-ideas', {pageTitle: 'Project Ideas', projectIdeas: allProjectIdeas, 
        editMode: false, addFromActive: false, editFromActive: false})})
        .catch((err) => console.log(err))
}

exports.addProjectIdea = (req, res, next) => {
    const newIdea = new ProjectIdea(req.body['project-name'], moment().format("MMM Do YYYY"), req.body['project-description'], req.body['necessary-tech'], req.body['estimated-hours-to-completion'])

    let customFieldTitle = [];
    let customFieldContent = [];

    if (req.body['custom-field-content']) {
        customFieldTitle = req.body['custom-field-title']
        customFieldContent = req.body['custom-field-content']
    }

    newIdea.save(customFieldTitle, customFieldContent, req.body.editMode, req.body.ideaId, req.body.editFromActive)
    .then((ideas) => {
    
    if (req.body.addFromActive) {
        ProjectIdea.activateIdea(ideas[ideas.length-1]._id)
            .then(() => {
                res.redirect('/active-projects')  
            })
    } else {
        if (req.body.editFromActive) {
            res.redirect('/active-projects')
        } else {
            res.redirect('/project-ideas')
        }
    }
    })
    .catch(err => console.log(err))
}

exports.addIdeaFromActive = (req, res, next) => {
    res.render('project-ideas', {
        pageTitle: 'Project Ideas',
        addFromActive: true,
        projectIdeas: [],
        editMode: false, 
        editFromActive: true
    })
}

exports.makeIdeaActive = (req, res, next) => {
    ProjectIdea.activateIdea(req.body.ideaId)
        .then((activeProject) => {
        res.redirect('/project-ideas')})
        .catch((err) => console.log(err))

}

exports.editProjectIdea = (req, res, next) => {
    let editMode = req.query.edit
    editMode = (editMode == 'true')

    let editFromActive = req.query.fromActive
    editFromActive = (editFromActive == 'true')

    if(!editMode) {
       return res.redirect('/')
    } else {
        let allProjectIdeas;
        ProjectIdea.loadAllProjectIdeas().then((ideas) => {
            allProjectIdeas = ideas;
        }).then(() => {
            ProjectIdea.editProjectIdea(req.body.ideaId)
             .then((selectedIdea) => {
                res.render('project-ideas', { pageTitle: 'Project-Ideas', projectIdeas: allProjectIdeas,selectedIdea : selectedIdea[0], editMode: editMode, addFromActive: false, editFromActive })
            })
             .catch(err => console.log(err))
        })
        .catch((err) => console.log(err))
    }
}

exports.deleteProjectIdea = (req, res, next) => {
    ProjectIdea.deleteProjectIdea(req.body.ideaId)
        .then(() => {
        res.redirect('/project-ideas')
        })
        .catch((err) => console.log(err))
}

exports.viewIdeaFromActive = (req, res, next) => {
    ProjectIdea.loadProjectIdea(req.body.ideaId)
        .then((project) => {
        res.render('view-idea-from-active', {pageTitle: "Viewing Idea", project})
         })
         .catch((err) => console.log(err))
}