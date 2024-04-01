import Student from "@/models/Student/Student"
import Aassessment from "@/models/Aassessment/Aassessment"
import Team from "@/models/Team/Team"
import Criterion from "@/models/Criterion/Criterion"
import logger from "./loggerUtil"



export default function createAassessmentCSV(students: Student[], aassessments: Aassessment[], teams: Team[], criterias: Criterion[]){
    let aassessmentExport = 'name, VUTlogin, FITlogin,points\n'

    for(let i = 0; i < students.length; i++){
        const student = students[i]

        
        const studentAassessments = aassessments.filter(a => a.studentId == student.id)


        let points = 0
        for(let j = 0; j < studentAassessments.length; j++){
            const aassessment = studentAassessments[j]
            points += aassessment.points ?? 0
        }

        
        const teamMatch = teams.find(t => t.studentIds?.includes(student.id))
        if(teamMatch){

            const teamAassessments = aassessments.filter(a => a.teamId == teamMatch.id)

            for(let j = 0; j < teamAassessments.length; j++){
                const aassessment = teamAassessments[j]

                const criterion = criterias.find(c => c.id == aassessment.criterionId)
                logger.debug("criterion: ", criterion)
                logger.debug("students length: ",  teamMatch.studentIds.length)
                logger.debug("assessment: ",  aassessment)
                if(criterion){
                    if(criterion.assessmentMethod == "Per student"){
                        points += aassessment.points ?? 0
                    }
                    else{
                        points += (aassessment.points ?? 0) / teamMatch.studentIds.length
                    }
                }

            }

        }

        


        aassessmentExport += student.name + ", " + student.vutlogin + ", " + student.fitlogin + ", " + points.toFixed(1) + "\n"
    }

    return aassessmentExport
}