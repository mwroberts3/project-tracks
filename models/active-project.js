const mongodb = require('mongodb')
const getDb = require('../database').getDb
const moment = require('moment')

class ActiveProject {
    static loadAllActiveProjects() {
        const db = getDb()
        let allActiveProjects = []
        let projectIdeas = []

        return db.collection('active-projects')
            .find({})
            .toArray()
            .then((activeProjects) => {
                allActiveProjects = activeProjects
            })
            .then(() => {
                return db.collection('project-ideas')
                .find({})
                .toArray()
                .then((ideas) => {
                    projectIdeas = ideas
                }).then(() => {
                    allActiveProjects.forEach(project => {
                        let ideaIdMatch = projectIdeas.find(idea => idea._id.toString() === project.ideaId.toString() )

                        project.title = ideaIdMatch.title

                        project.desc = ideaIdMatch.desc

                        project.hoursToComplete = ideaIdMatch.hoursToComplete
                    })
                })
                .then(() => {
                    return allActiveProjects
                })
            })
    }

    static addHours(projectId, hoursWorked) {
        const db = getDb()

        return db.collection('active-projects').updateOne({_id: mongodb.ObjectId(projectId)}, {$inc: {hoursWorked: +hoursWorked}})

        // might want to add a way to see a log that tracks hours added and the date they were added
    }

    static deleteActiveProject(projectId) {
        const db = getDb()

        return db.collection('active-projects')
            .findOne({_id: mongodb.ObjectId(projectId)})
            .then((activeProject) => {
                let ideaId = activeProject.ideaId
                return db.collection('active-projects').deleteOne({_id: mongodb.ObjectId(projectId)})
                .then(() => {
                    return db.collection('project-ideas')
                    .deleteOne({_id: mongodb.ObjectId(ideaId)})
                })
            })
            .catch(err => console.log(err))
    }

    static viewBugsAndTodo(projectId) {
        const db = getDb()

        return db.collection('active-projects')
            .findOne({_id: mongodb.ObjectId(projectId)})
    }

    static addNewTask(projectId, taskTitle, taskContent) {
        const db = getDb()

        return db.collection('active-projects')
            .updateOne({_id: mongodb.ObjectId(projectId)}, {$push: {bugsAndTodo: {_id: new mongodb.ObjectId(), date: moment().format("MMM Do YYYY"),title: taskTitle, content: taskContent}}})
    }

    static editTask(projectId, selectedTask) {
        const db = getDb()
        let updatedTasks = []

        return db.collection('active-projects')
            .findOne({_id: mongodb.ObjectId(projectId)})
            .then((project) => {
                updatedTasks = project.bugsAndTodo.filter((task) => task._id.toString() !== selectedTask._id.toString())

                selectedTask.date = `EDITED: ${moment().format("MMM Do YYYY, h:mm:ss a")}`
                updatedTasks.push(selectedTask)

                return db.collection('active-projects')
                    .updateOne({_id: mongodb.ObjectId(projectId)}, {$set: {bugsAndTodo: updatedTasks}})
            })
            .catch((err) => console.log(err))
    }

    static deleteTask(projectId, taskId) {
        const db = getDb()

        let editedBugsAndTodo = []

        return db.collection('active-projects')
            .findOne({_id: mongodb.ObjectId(projectId)})
            .then((project) => {
                editedBugsAndTodo = project.bugsAndTodo.filter(task => task._id.toString() != taskId.toString())
            })
            .then(() => {
                return db.collection('active-projects')
                .updateOne({_id: mongodb.ObjectId(projectId)}, {$set: {bugsAndTodo: editedBugsAndTodo}})
            })


    }

    static finishProject(projectId, version, website, iterativeNotes) {
        const db = getDb()

        let finishedProject = {}

        return db.collection('active-projects')
            .findOne({_id: mongodb.ObjectId(projectId)})
            .then((project) => {
                finishedProject.date = moment().format("MMM Do YYYY")
                finishedProject.activeProjectId = project._id
                finishedProject.ideaId = project.ideaId
                finishedProject.hoursWorked = project.hoursWorked
                finishedProject.version = version
                finishedProject.website = website
                finishedProject.iterativeNotes = iterativeNotes

                return db.collection('project-ideas')
                    .findOne({_id: mongodb.ObjectId(project.ideaId)})
                    .then((originalIdea) => {
                        finishedProject.title = originalIdea.title
                        finishedProject.startDate = originalIdea.date
                    })
                    .then(() => {
                        return db.collection('finished-projects')
                        .insertOne(finishedProject)
                    })
                    .catch((err) => console.log(err))
            })
            .then(() => {
                return db.collection('active-projects')
                    .updateOne({_id: mongodb.ObjectId(projectId)}, {$set: {finished: true}})
            })
            .catch((err) => console.log(err))
    }
}

module.exports = ActiveProject