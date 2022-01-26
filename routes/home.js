const { Router } = require('express')
const Course = require('../models/course')
const router = new Router()

router.get('/', async (req, res) => {
	const coursesNames = []
	const courses = await Course.find().lean()
	courses.forEach((course) => {
		coursesNames.push({
			title: course.title,
			description: course.description,
			id: course._id
		})
	})
	res.render('index', {
		title: 'Main page',
		isHome: true,
		coursesNames

	})
})

module.exports = router
