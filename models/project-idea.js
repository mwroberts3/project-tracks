const mongodb = require('mongodb')
const getDb = require('../database').getDb

class ProjectIdea {
    constructor(title, date, desc, techStack, hoursToComplete) {
        this.title = title;
        this.date = date;
        this.desc = desc;
        this.techStack = techStack;
        this.hoursToComplete = hoursToComplete;
        this.active = false;
    }

    save(customFieldTitle, customFieldContent, editMode, ideaId, editFromActive) {
        const db = getDb()

        if (customFieldTitle) {
            let customFieldsToAdd = [];
            this.customFields = true;

            if (Array.isArray(customFieldTitle)) {
                for (let i = 0; i < customFieldTitle.length; i++) {
                    customFieldsToAdd.push({title: customFieldTitle[i], content: customFieldContent[i]})
                }
            } else {
                customFieldsToAdd = [{title: customFieldTitle, content: customFieldContent}]
            }

            if (editFromActive) {
                this.active = true;
            }

            this.customFieldsData = customFieldsToAdd;
        }

        // if editing argument is true updateOne instead of insertOne
        if (editMode !== "true" && !editFromActive) {
            return db.collection('project-ideas').insertOne(this)
        } else if (editMode == "true") {
            return db.collection('project-ideas').replaceOne({_id: mongodb.ObjectId(ideaId)}, this) 
        } else {
            return db.collection('project-ideas').insertOne(this).then(() => {
                return db.collection('project-ideas').find({}).toArray()
            })
        }
    }

    static activateIdea(ideaId) {
        const db = getDb();

        return db.collection('project-ideas')
            .updateOne({_id: mongodb.ObjectId(ideaId)}, {$set: {active: true}})
            .then(() => {
                return db.collection('project-ideas')
            .findOne({_id: mongodb
            .ObjectId(ideaId)})
            .then((idea) => {
                return db.collection('active-projects').insertOne({ideaId: idea._id, hoursWorked: 0, bugsAndTodo: [], finished: false})
            })})        
            .catch(err => console.log(err))
    }

    static editProjectIdea(ideaId) {
        const db = getDb();

        return db.collection('project-ideas').find({_id : mongodb.ObjectId(ideaId)}).toArray()
    }

    static deleteProjectIdea(ideaId) {
        const db = getDb()

        return db.collection('project-ideas').deleteOne({"_id": mongodb.ObjectId(ideaId)})
    }

    static loadAllProjectIdeas() {
        const db = getDb()

        return db.collection('project-ideas').find({}).toArray()
    }

    static loadProjectIdea(ideaId) {
        const db = getDb()

        return db.collection('project-ideas').findOne({_id: mongodb.ObjectId(ideaId)})
    }
}

module.exports = ProjectIdea