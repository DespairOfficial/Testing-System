const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const exphbs = require('express-handlebars')
const homeRoutes = require('./routes/home')
const coursesRoutes = require('./routes/courses')
const addCourseRoutes = require('./routes/addCourse')
const Handlebars = require('handlebars')
const profile = require('./routes/profile')

const User = require('./models/user')
// const password = 'jkWQ9VuJOGU5iOuI'
const URL = 'mongodb+srv://despair:jkWQ9VuJOGU5iOuI@cluster0.6gkn5.mongodb.net/ResolveSystem'
const app = express()

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs'
})

hbs.handlebars.registerHelper('guesses', function (ticket) {
	const arrNotRand = [ticket.answer, ticket.guess1, ticket.guess2, ticket.guess3]
	const arrRand = []
	while (arrNotRand.length > 0) {
		if (Math.random() > 0.5) {
			const removed = arrNotRand.splice(Math.random() * arrNotRand.length, 1)
			arrRand.push(removed[0])
		}
	}
	return new Handlebars.SafeString(`
      <p>
        <label>
          <input lass="group1" name="${ticket.question}" type="radio" value="${arrRand[0]}" checked />
          <span>${arrRand[0]}</span>
        </label>
      </p>
      <p>
        <label>
          <input lass="group1" name="${ticket.question}" type="radio" value="${arrRand[1]}"/>
          <span>${arrRand[1]}</span>
        </label>
      </p>
      <p>
        <label>
          <input class="group1" name="${ticket.question}" type="radio"  value="${arrRand[2]}"/>
          <span>${arrRand[2]}</span>
        </label>
      </p>
      <p>
        <label>
          <input  class="group1" name="${ticket.question}" type="radio"  value="${arrRand[3]}"/>
          <span>${arrRand[3]}</span>
        </label>
      </p>`)
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

app.use(async (req, res, next) => {
	try {
		const user = await User.findById('61a5bd16c0d9c938d6642391')
		req.user = user
		next()
	} catch (e) {
		console.log(e)
	}
})

app.use(express.static('public'))

app.use(express.urlencoded({ extended: true }))

app.use('/', homeRoutes)
app.use('/courses', coursesRoutes)
app.use('/addCourse', addCourseRoutes)
app.use('/profile', profile)

const PORT = process.env.PORT ?? 3000

async function start () {
	try {
		await mongoose.connect(URL, {
			useNewUrlParser: true
		})
		const candidate = await User.findOne()
		if (!candidate) {
			const user = new User({
				email: 'despairtheomniscient@gmail.com',
				name: 'despair',
				grades: { items: [] }
			})
			await user.save()
		}
		app.listen(PORT, () => {
			console.log(`Server has been started on port ${PORT}...`)
		})
	} catch (e) {
		console.log(e)
	}
}

start()
