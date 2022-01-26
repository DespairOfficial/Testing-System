const { Router } = require('express')
const router = new Router()
const Course = require('../models/course')

router.get('/', (req, res) => {
	res.render('addCourse', {
		title: 'New course',
		isAddCourse: true
	})
})

router.post('/', async (req, res) => {
	const course = new Course({
		title: req.body.title,
		description: req.body.description,
		image: req.body.image,
		theory: req.body.theory,
		tasks: {
			tickets: []
		}

	})
	try {
		await course.save()
		res.redirect('/courses')
	} catch (e) {
		console.log(e)
	}
})
module.exports = router
