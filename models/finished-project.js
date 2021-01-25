const mongodb = require('mongodb')
const getDb = require('../database').getDb

class FinishedProject {
    static loadAllFinishedProjects() {
        const db = getDb()
        
        return db.collection('finished-projects')
            .find({})
            .toArray()
    }

    static getOriginalIdea(ideaId) {
        const db = getDb()

        return db.collection('project-ideas')
            .findOne({_id: mongodb.ObjectId(ideaId)})
    }

    static getIterativeNotes(projectId) {
        const db = getDb()

        return db.collection('finished-projects')
            .findOne({_id: mongodb.ObjectId(projectId)})
    }

    static editIterativeNotes(projectId, website, iterativeNotes) {
        const db = getDb()

        return db.collection('finished-projects')
            .updateOne({_id: mongodb.ObjectId(projectId)}, {$set: {website, iterativeNotes}})
    }

    static reactivateProject(finishedProjectId, activeProjectId) {
        const db = getDb()

        return db.collection('finished-projects')
            .deleteOne({_id: mongodb.ObjectId(finishedProjectId)})
            .then(() => {
                return db.collection('active-projects')
                    .updateOne({_id: mongodb.ObjectId(activeProjectId)}, {$set: {finished: false}})
            })
            .catch((err) => console.log(err))
    }
}

module.exports = FinishedProject