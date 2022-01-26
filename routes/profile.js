const { Router } = require('express')
const router = new Router()
const User = require('../models/user')
const Course = require('../models/course')

router.get('/', async (req, res) => {
	const user = await User.findById('61a5bd16c0d9c938d6642391')
	const value = await Course.find()
	const names = []
	value.forEach((item) => {
		names.push({
			name: item.title,
			id: item._id
		})
	})

	const userItems = user.grades.items
	const items = []
	userItems.forEach((userItem) => {
		items.push({
			id: userItem.courseId,
			completeness: userItem.completeness,
			integrity: userItem.integrity,
			skills: userItem.skills
		})
	})

	for (let i = 0; i < items.length; i++) {
		for (let j = 0; j < names.length; j++) {
			if (String(items[i].id) === String(names[j].id)) {
				items[i].name = names[j].name
			}
		}
	}

	let avgCompletness = 0
	let avgIntegrity = 0
	let avgSkills = 0
	const len = user.grades.items.length
	for (let i = 0; i < len; i++) {
		avgCompletness += user.grades.items[i].completeness
		avgIntegrity += user.grades.items[i].integrity
		avgSkills += user.grades.items[i].skills
	}
	avgCompletness = avgCompletness / len
	avgIntegrity = avgIntegrity / len
	avgSkills = avgSkills / len
	const username = user.name
	let isCertificate = false
	let avgRate = (avgSkills + avgIntegrity + avgCompletness) / 3
	if ((avgRate >= 0.6) && (user.grades.items.length === value.length)) {
		isCertificate = true
	}
	const testResults = []
	items.forEach((item) => {
		testResults.push(`
            <div style="display: flex; flex-direction: column;">
                <p><h2 style="text-align:center"><a href="/courses/${item.id}">${item.name}</a></h2></p>
            
                <div style="border:1px solid #ccc; width:500px; height:500px;padding:5px; margin: 10px"; >
                    <canvas  class="cv" id="${item.name}Chart" width="250" height="250"></canvas>
                </div>
            </div>
        <script>
    
            var ${item.name}Canvas = document.getElementById("${item.name}Chart").getContext("2d");
            var radar = new Chart(${item.name}Canvas, {
                type: 'radar', 
                data: {
                    labels: ["Completeness" , "Integrity"  , "Skills" ],
                    datasets: [{
                    label: 'Grades',
                    data: [${item.completeness},${item.integrity}, ${item.skills}],
                    backgroundColor: [
                        'rgba(100, 255, 132, 0.6)',
                        'rgba(255, 99, 132, 0.6)',
                        'rgba(255, 206, 86, 0.6)'
                        
                    ]
                    }]
                },
                options: {
                    plugins: {
                        legend: {
                            labels: {
                                // This more specific font property overrides the global property
                                font: {
                                    size: 24
                                }
                            }
                        }
                    },
                    scales: {
                        r: {
                            pointLabels: {
                                font: {
                                    size: 20
                                }
                            }
                        }
                    },
                    scale:{
                        ticks: {
                            display: false,
                            beginAtZero: true
                          },
                        pointLabels: { fontSize: 20 } ,
                        reverse: false,
                        r :{
                            angleLines: {
                                display: false
                            },
                            beginAtZero: true,
                            min: 0,
                            max: 1
                        }
                    }
                }
            });
        
        
            </script>
        `)
	})

	avgCompletness = avgCompletness.toFixed(2)
	avgIntegrity = avgIntegrity.toFixed(2)
	avgSkills = avgSkills.toFixed(2)
	avgRate = avgRate.toFixed(2)
	const percent = String(avgRate * 100) + '%'

	const today = new Date()

	const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()

	const dateTime = date

	res.render('profile', {
		title: 'Profile',
		isProfile: true,
		avgCompletness,
		avgIntegrity,
		avgSkills,
		avgRate,
		username,
		isCertificate,
		testResults,
		percent,
		dateTime

	})
})

module.exports = router
