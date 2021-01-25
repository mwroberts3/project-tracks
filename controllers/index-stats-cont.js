const getDb = require('../database').getDb

async function getHomePage(req, res, next){
    const db = getDb();

    let numberOfProjectIdeas = await db.collection('project-ideas').find({}).toArray();

    let nonActiveIdeas = 0

    numberOfProjectIdeas.forEach((idea) => {
        if (!idea.active) {
            nonActiveIdeas++
        }
    })

    let numberOfActiveProjects = await db.collection('active-projects').find({}).toArray()

    let unfinishedProjects = 0

    numberOfActiveProjects.forEach((project) => {
        if (!project.finished) {
            unfinishedProjects++
        }
    })
    
    let numberOfFinishedProjects = await db.collection('finished-projects').find({}).toArray()

    res.render('index', {pageTitle: 'Project Tracker', projectIdeas: nonActiveIdeas, activeProjects: unfinishedProjects, finishedProjects: numberOfFinishedProjects.length})
}

module.exports.getHomePage = getHomePage