const path = require('path')
const fs = require('fs')

const express = require('express')

const app = express()
const port = 4000
const http = require('http')

let server = http.createServer(app).listen(port)

const bodyParser = require('body-parser')

const mongoConnect = require('./database').mongoConnect

const mongodbCheck = require('./database').mongodbCheck

const indexStatsController = require('./controllers/index-stats-cont')
const projectIdeasController = require('./controllers/project-ideas-cont')
const finishedProjectsController = require('./controllers/finished-projects-cont')
const activeProjectsController = require('./controllers/active-projects-cont')

let databaseCheck = false


app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded( {extended: false } ))

// check for mongodb database connect link
app.get('/', (req, res, next) => {
    if (fs.existsSync(path.join(__dirname, 'mongodb-connect.json'))) {
        if (!databaseCheck) {
            server.close()
            
            mongodbCheck(() => {
                mongoConnect(() => {
                    app.listen(port, () => {
                        console.log('app.js listening')
                    }) 
                })
            })    
            databaseCheck = true
        }

        setTimeout(() => {
            res.redirect('/home')
        },1000)
    } else {
        res.render('connection-setup', {pageTitle: 'Set Up Database Connection'})
    }
})

app.get('/connection-finalize', (req, res, next) => {
    res.redirect('/')
})

app.post('/connection-finalize/', (req, res, next) => {
    fs.writeFileSync(path.join(__dirname, 'mongodb-connect.json'), JSON.stringify({'mongodbConnect': req.body.mongodbLink}))

    server.close()

    mongodbCheck(() => {
        mongoConnect(() => {
           app.listen(port, () => {
                console.log('app.js listening')
            }) 
        })
    })

    databaseCheck = true
    
    setTimeout(() => {
        res.redirect('/')
    },1000)
})

app.get('/home', indexStatsController.getHomePage)

// Project ideas
app.get('/project-ideas', projectIdeasController.getProjectIdeas)
app.post('/project-ideas', projectIdeasController.addProjectIdea)
app.get('/project-ideas/add-from-active', projectIdeasController.addIdeaFromActive)
app.post('/project-ideas/edit/:ideaId', projectIdeasController.editProjectIdea)
app.post('/project-ideas/make-active', projectIdeasController.makeIdeaActive)
app.post('/project-ideas/delete', projectIdeasController.deleteProjectIdea)

// Active projects
app.get('/active-projects', activeProjectsController.getActiveProjects)
app.get('/active-projects/view-idea', projectIdeasController.viewIdeaFromActive)
app.post('/active-projects/view-idea', projectIdeasController.viewIdeaFromActive)
app.post('/active-projects/add-hours', activeProjectsController.addHoursToProject)
app.get('/active-projects/view-bugs-and-todo/:projectId', activeProjectsController.getBugsAndTodo)
app.post('/active-projects/view-bugs-and-todo/:projectId', activeProjectsController.getBugsAndTodo)
app.post('/active-projects/add-task', activeProjectsController.postAddTask)
app.post('/active-projects/delete-task', activeProjectsController.postDeleteTask)
app.post('/active-projects/delete-project', activeProjectsController.postDeleteActiveProject)
app.post('/active-projects/finished/:projectId', activeProjectsController.postFinishedProject)
app.get('/active-projects/finish-project/:projectId', activeProjectsController.getFinishedProjectPopup)

// Finished projects
app.get('/finished-projects', finishedProjectsController.getFinishedProjects)
app.get('/finished-projects/view-idea/:ideaId', finishedProjectsController.getOriginalIdea)
app.get('/finished-projects/iterative-notes/:projectId', finishedProjectsController.getIterativeNotes)
app.post('/finished-projects/edit-notes/', finishedProjectsController.postEditIterativeNotes)
app.post('/finished-projects/reactivate/', finishedProjectsController.postReactivateProject)


