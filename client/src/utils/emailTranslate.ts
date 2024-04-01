import Aassessment from "@/models/Aassessment/Aassessment"
import Criterion from "@/models/Criterion/Criterion"
import Student from "@/models/Student/Student"
import Team from "@/models/Team/Team"
import logger from "./loggerUtil"

function getCriterion(category:string, name:string, criterias: Criterion[]){
    return criterias.find(c => c.category == category && c.code == name)
}

function getAassessment(criterionId: number, assessments: Aassessment[], selectedStudent: Student | undefined, selectedTeam: Team | undefined){
    
    if(selectedTeam != undefined){
        return assessments.find(a => a.criterionId == criterionId && a.teamId == selectedTeam.id)
    }
    else if(selectedStudent != undefined){
        return assessments.find(a => a.criterionId == criterionId && a.studentId == selectedStudent.id)
    }
    return undefined;
}

export default function emailTranslate(emailTemplate:string, categories: string[], criterias: Criterion[], assessments: Aassessment[], selectedStudent: Student | undefined, selectedTeam: Team | undefined):string
{   
    //console.log("email translate: ", selectedTeam, selectedStudent)
    let translatedEmail = emailTemplate ?? ""
    for (const category of categories) {
        const pattern = new RegExp(`{(${category}\\..*?)}`, 'g');
        const matches = emailTemplate?.match(pattern);
        
        if (matches) {
            for (const match of matches) {
                const criteriaName = match.split('.')[1].slice(0, -1);
                const criterion = getCriterion(category, criteriaName, criterias);
                if (criterion !== undefined && criterion !== null) {
                    
                    const aassessment = getAassessment(criterion.id, assessments, selectedStudent, selectedTeam)
                    //console.log("email translate assessment: ", aassessment)
                    if(aassessment !== undefined && aassessment !== null){
                        
                        translatedEmail = translatedEmail.replace(`{${category}.${criteriaName}}`, criterion.category + "-" + criterion.name + ": "+ aassessment.points + "/" + criterion.maxPoints + ( aassessment.points !== undefined && aassessment.points < criterion.maxPoints ? " " + (aassessment.feedback != null ? "("+ aassessment.feedback +")" : ""): ""));
                    }
                }
            }
        }
    }
    return translatedEmail
}