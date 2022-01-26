const Course = require('../models/course')
const User = require('./user')
class ResChecker {
	async check (id, questsAnswers, mode = 'practice') {
		const user = await User.findById('61a5bd16c0d9c938d6642391')
		const course = await Course.findById(id).lean()
		const result = []
		const categoriesCounter = {
			completeness: 0,
			integrity: 0,
			skills: 0
		}
		const categoriesUser = {
			completeness: 0,
			integrity: 0,
			skills: 0
		}
		for (let i = 0; i < course.tasks.tickets.length; i++) {
			if (course.tasks.tickets[i].question in questsAnswers) {
				categoriesCounter[course.tasks.tickets[i].category] += 1
				result.push({
					question: course.tasks.tickets[i].question,
					urAnswer: questsAnswers[course.tasks.tickets[i].question],
					rightAnswer: course.tasks.tickets[i].answer,
					isRight: course.tasks.tickets[i].answer === questsAnswers[course.tasks.tickets[i].question],
					explain: course.tasks.tickets[i].explain
				})

				if (course.tasks.tickets[i].answer === questsAnswers[course.tasks.tickets[i].question]) {
					categoriesUser[course.tasks.tickets[i].category] += 1
				}
			}
		}
		if (mode === 'exam') {
			const cid = []
			for (let i = 0; i < user.grades.items.length; i++) {
				cid.push(String(user.grades.items[i].courseId))
				if (user.grades.items[i].courseId === id) {
					const completeness = (categoriesUser.completeness / categoriesCounter.completeness) > 0 ? categoriesUser.completeness / categoriesCounter.completeness : 0.00001
					const integrity = (categoriesUser.integrity / categoriesCounter.integrity) > 0 ? categoriesUser.integrity / categoriesCounter.integrity : 0.00001
					const skills = (categoriesUser.skills / categoriesCounter.skills) > 0 ? categoriesUser.skills / categoriesCounter.skills : 0.00001
					user.grades.items[i] =
					{
						courseId: id,
						completeness: completeness,
						integrity: integrity,
						skills: skills
					}
				}
			}
			if (cid.indexOf(id) === -1) {
				const completeness = (categoriesUser.completeness / categoriesCounter.completeness) > 0 ? categoriesUser.completeness / categoriesCounter.completeness : 0.00001
				const integrity = (categoriesUser.integrity / categoriesCounter.integrity) > 0 ? categoriesUser.integrity / categoriesCounter.integrity : 0.00001
				const skills = (categoriesUser.skills / categoriesCounter.skills) > 0 ? categoriesUser.skills / categoriesCounter.skills : 0.00001
				user.grades.items.push(
					{
						courseId: id,
						completeness: completeness,
						integrity: integrity,
						skills: skills
					}
				)
			}

			try {
				await user.save()
			} catch (e) {
				console.log(e)
			}
		}
		return result
	}
}
const resCheck = new ResChecker()
module.exports = resCheck
