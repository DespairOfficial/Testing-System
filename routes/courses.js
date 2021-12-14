const {Router} = require('express')
const Course = require("../models/course")
const resultChecker = require("../models/resultChecker")
const Handlebars = require('express-handlebars')
const User = require("../models/user");
const { underline } = require('chalk');

const router = new Router()

router.get('/',async (req,res)=>{
    const courses = await Course.find().lean()
    res.render('courses',{
        title: "Courses",
        isCourses: true,
        courses
    })
})
router.get('/:id',async (req,res)=>{
    const course = await Course.findById(req.params.id ).lean()
    res.render('course',{
        layout: 'empty',
        title: `Course ${course.title}`,
        course
    })
})
router.get('/:id/edit', async(req,res)=>{
    if(!req.query.allow){
        return res.redirect('/')
    }
    const course = await Course.findById(req.params.id).lean()
    res.render('courseEdit',{
        title: `Edit ${course.title}`,
        course
    })
})
router.post('/edit' , async(req,res)=>{
    const {id} = req.body
    delete req.body.id
    await Course.findByIdAndUpdate(id,req.body).lean()
    res.redirect('/courses')
})
router.get('/:id/remove', async(req,res)=>{
    try{
        await Course.deleteOne({
            _id: req.params.id
        })
        res.redirect('/courses')
    }
    catch(e){
        console.log(e)
    }
})

router.get('/:id/theory',async (req,res)=>{
    const course = await Course.findById(req.params.id ).lean()
    res.render('theory',{
        layout: 'empty',
        title: `${course.title} Theory`,
        course
    })
})
router.get('/:id/practice',async (req,res)=>{
    const course = await Course.findById(req.params.id ).lean()
    res.render('practice',{ 
        layout: 'empty',
        title: `${course.title}'s practice`,
        course

    })
})
router.post('/:id/practice',async (req,res)=>{
    const course = await Course.findById(req.params.id ).lean()
    let resCheck = await resultChecker.check(req.params.id,req.body,mode='practice')
    res.render('pracResults',{
        layout: 'empty',
        title: "Practice results",
        resCheck

    })
})
router.get('/:id/exam',async (req,res)=>{
    const course = await Course.findById(req.params.id).lean()
    const user = await User.findById('61a5bd16c0d9c938d6642391')

    res.render('exam',{
        layout: 'empty',
        title: `${course.title}'s exam`,
        course
    })     
})


router.post('/:id/exam',async (req,res)=>{
    const course = await Course.findById(req.params.id ).lean()
    let resCheck = await resultChecker.check(req.params.id,req.body,mode='exam')
    
    const user = await User.findById('61a5bd16c0d9c938d6642391')
    let completeness = 0
    let integrity = 0
    let skills = 0
    user.grades.items.forEach(element => {
    const cid = String(element.courseId)
    if (cid.indexOf(req.params.id) != -1)
        {
            completeness = (element.completeness).toFixed(3)
            integrity = element.integrity.toFixed(3)
            skills = element.skills.toFixed(3)
        }
    })
    
    const avg = Math.pow(completeness*integrity*skills,1/3)
    let grade = 0
    if(avg>=0.5){
        if(avg<0.74)
        {
            grade = 3
        }
        else if(avg<0.86) 
        {
            grade = 4
        }     
        else grade = 5 
    }
    else grade =2

    res.render('examResults',{
        layout: 'empty',
        title: "Exam results",
        resCheck,
        completeness,
        integrity,
        skills,
        avg,
        grade
    })
})

module.exports = router