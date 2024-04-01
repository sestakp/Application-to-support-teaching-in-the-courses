import store from '@/store';
import logger from '@/utils/loggerUtil';
import Button from 'primevue/button';
import { defineComponent } from 'vue';
import Student from '@/models/Student/Student';
import Team from '@/models/Team/Team';
import { mapGetters, mapActions } from 'vuex';
import Activity from '@/models/Activity/Activity';
import CriterionSidePanel from '@/components/CriterionSidePanelForm.vue'
import Divider from 'primevue/divider';
import User from '@/models/User/User';
import LoadingBadger from "@/components/LoadingBadger.vue"
import Task from '@/models/Task/Task';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Course from '@/models/Course/Course';
import Criterion from '@/models/Criterion/Criterion';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
import ScrollPanel from 'primevue/scrollpanel';
import Aassessment from '@/models/Aassessment/Aassessment';
import ReportSidePanel from '@/components/ReportSidePanelForm.vue';
import StudentAssessmentCard from '@/components/StudentAssessmentCard.vue'
import deepEqual from '@/utils/deepEqual';
import Checkbox from 'primevue/checkbox';
import Breadcrumb from 'primevue/breadcrumb';
import useTimer from '@/hooks/useTimer';

const timer = useTimer();


interface TaskDetailViewData {
    loading: boolean;
    taskId: number;
    courseId: number;
    started: boolean;
    aassessments: Aassessment[]; // Replace 'any' with the actual type of your assessments
    teamTabIndex: number;
    aassessedUnits: number;
}

export default defineComponent({
    name: "TaskDetailView",
    components: { Button, Divider, CriterionSidePanel, LoadingBadger, Accordion,AccordionTab,InputNumber,Textarea, ScrollPanel, ReportSidePanel, StudentAssessmentCard,Checkbox, Breadcrumb },

    computed: {
        ...mapGetters('course', {getCourseById: 'getItemById'}),
        ...mapGetters('task', {getTaskById: 'getItemById'}),
        ...mapGetters('activity', {getActivityById: 'getItemById'}),
        ...mapGetters('criterion', { allCriterias: 'allItems', getCategories: 'getCategories'}),
        ...mapGetters('user', { allUsers: 'allItems', getUserById: 'getItemById', currentUser: 'currentUser'}),
        
        ...mapGetters('aassessment', {allAassessments: 'allItems'}),
        ...mapGetters('student', { allStudents: 'allItems', selectedStudent: 'selectedItem'}),
        ...mapGetters('team', { allTeams: 'allItems', selectedTeam: 'selectedItem'}),
        
        course(): Course { return this.getCourseById(this.courseId) },
        task(): Task { return this.getTaskById(this.taskId) },  
        activity(): Activity { return this.getActivityById(this.task?.activityId)},
        responsibleUser(): User { return this.getUserById(this.task?.responsibleUserId)},
        isSupervizor():boolean { return this.task?.responsibleUserId == this.currentUser?.id },
        isTeamBased():boolean { return this.activity?.teamBased },
        
        categories(): string[] { return this.task?.criteriaCategory == null ?  this.getCategories(this.task?.activityId) : [this.task?.criteriaCategory]},

        canEdit():boolean { return this.started && (this.selectedStudent != undefined || this.selectedTeam != undefined) && this.isSupervizor},
        timerStarted():boolean { return timer.formattedTime() !== '00:00:00'},

        home(): any { return {
            icon: 'pi pi-home',
            route: '/courses'
        }},

        items(): any[] { return [
            { label: `${this.course?.name} (${this.course?.abbrevation})`, route: `/courses/${this.courseId}/1`},
            
            { label: `${this.task?.order}. ${this.task?.name}` }
        ]}
    },
    data(): TaskDetailViewData {
        return {
            loading: true,
            taskId: Number(this.$route.params.taskId),
            courseId: Number(this.$route.params.courseId),
            started: false,
            aassessments: [],
            teamTabIndex: -1,
            aassessedUnits: 0,
        };
    },

    created() {
        Promise.all([this.fetchTask(), this.fetchAassessmentsByTask()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
        
        Promise.all([this.fetchCourse()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },
    watch: {
        allCriterias:{
            handler(newValue: Criterion[], oldValue: Criterion[]) {
                if (newValue) {
                    const allAassessments = this.allAassessments as Aassessment[]
                    this.aassessments = [];
                    newValue.forEach((criterion) => {
                        
                        let aassessment = allAassessments.find(a => a.criterionId == criterion.id && (this.activity?.teamBased ? a.teamId == this.selectedTeam?.id : a.studentId == this.selectedStudent?.id))
                        
                        if(aassessment === undefined){

                            aassessment = {} as Aassessment;
                            aassessment.criterionId = criterion.id;
                            //aassessment.feedback = criterion.feedback;
                            aassessment.points = undefined;
                        }

                        this.aassessments.push(aassessment);
                    });
                }
            }
        },
        teamTabIndex:{
            handler(newValue: number, oldValue: number) {
                logger.debug("new team tab index: ", newValue)
                
                const team = this.getTeams().at(newValue)
                if(team){                        
                    this.selectTeam(team);
                }               
            }
        },

        aassessments:{
            async handler(newValue: Aassessment[], oldValue: Aassessment[]) {

                for(let i = 0; i < this.aassessments.length; i++){
                    const assessment = this.aassessments[i];
                    const criterion =  this.findCriterion(assessment)

                    if(criterion.maxPoints == assessment.points && criterion.feedback == assessment.feedback){
                        assessment.feedback = undefined;
                    }
                    else if(assessment.feedback == undefined && assessment.points != undefined && assessment.points < criterion.maxPoints){
                        assessment.feedback = criterion.feedback;
                    }
                }
            },
            deep:true
        },

        selectedStudent: {
            async handler(newValue: Student, oldValue: Student) {
                if(oldValue && newValue != undefined){
                    await this.submit(oldValue.id);
                }

                if(newValue){
                    logger.debug("selectedStudent: ", newValue);

                    const allAassessments = (this.allAassessments as Aassessment[]).filter(a => a.studentId == newValue.id);
                    const criterias = this.allCriterias as Criterion[]
                    
                    this.aassessments = [];
                    if(allAassessments.length < 1){
                        criterias.forEach((criterion) => {
                        
                            const aassessment = {} as Aassessment;
                            aassessment.criterionId = criterion.id;
                            //aassessment.feedback = criterion.feedback;
                            aassessment.points = undefined;
                      
                            this.aassessments.push(aassessment);
                        });
                    }
                    else {
                        criterias.forEach(criterion => {

                            const assessment = allAassessments.find(a => a.criterionId == criterion.id)
                            if(assessment){
                                this.aassessments.push({...assessment})
                            }
                            else{
                                this.aassessments.push({
                                    criterionId: criterion.id,
                                    //feedback: criterion.feedback,
                                    points: undefined
                                } as Aassessment)
                            }
                        }); 
                    }
                }
            }
        },
        selectedTeam: {
            async handler(newValue: Team, oldValue: Team) {
                logger.debug("selected team: ", newValue)
                //TODO... update old, when user just change user
                if(oldValue && newValue != undefined){
                    logger.debug("submitting old team: ", oldValue)
                    await this.submit(oldValue.id);
                    
                }

                if (newValue) {
                    const allAassessments = (this.allAassessments as Aassessment[]).filter(a => a.teamId == newValue.id);
                    const criterias = (this.allCriterias as Criterion[]).filter(c => c.category == this.task.criteriaCategory || this.task.criteriaCategory == null)
                
                    this.aassessments = [];

                    logger.debug("new team assessments: ", allAassessments)
                    if(allAassessments.length < 1){
                        criterias.forEach((criterion) => {
                            
                            const aassessment = {} as Aassessment;
                            aassessment.criterionId = criterion.id;
                            //aassessment.feedback = criterion.feedback;
                            aassessment.points = undefined;
                      
                            this.aassessments.push(aassessment);
                        });
                        
                    }
                    else {
                        criterias.forEach(criterion => {
                            const assessment = allAassessments.find(a => a.criterionId == criterion.id)
                            //logger.debug("assessment from api: ", {...assessment})
                            if(assessment){
                                this.aassessments.push({...assessment})
                            }
                            else{
                                this.aassessments.push({
                                    criterionId: criterion.id,
                                    //feedback: criterion.feedback,
                                    points: undefined
                                } as Aassessment)
                            }
                        });
                    }
                }
            }
        },
    },

    methods: {
        formattedTime: timer.formattedTime,
        ...mapActions('student', {selectStudent: 'selectItem', unselectStudent: 'unselectItem'}),
        ...mapActions('team', {selectTeam: 'selectItem', unselectTeam: 'unselectItem'}),
        ...mapActions('task', {updateTask: 'updateItem'}),
        ...mapActions('report', {selectReport: 'selectItem'}),
        
        ...mapActions('aassessment', {createOrUpdateAassessment: 'createOrUpdateItem'}),
        
        async fetchCourse() {
            const course = await store.dispatch("course/fetchItem", this.courseId);
            await Promise.all([
                this.fetchCourseStudents(course),
                this.fetchCourseTeams(course.id)
            ]);
        },

        async fetchCourseStudents(course: Course) {
            await store.dispatch("student/fetchCourseStudents", course);
        },

        async fetchCourseTeams(courseId: number) {
            await store.dispatch("team/fetchCourseTeams", courseId);
        },

        async fetchTask() {
            const task: Task = await store.dispatch('task/fetchItem', this.taskId);
            logger.debug("fetch task: ", task)
            const fetchs = [this.fetchActivity(task.activityId), this.fetchActivityCriteria(task.activityId)]
            
            if (task.responsibleUserId != undefined) {
                fetchs.push(this.fetchUser(task.responsibleUserId));
            }

            await Promise.all(fetchs);
        },  
        
        isStudentAassessed(studentId: number): boolean{
            const aassessments = this.allAassessments as Aassessment[]
            const findResult = aassessments.find(a => a.studentId == studentId)
            return findResult != undefined;
        },
        
        async fetchUser(userId: number): Promise<void> {
            await store.dispatch('user/fetchItem', userId);
        },  
        
        async fetchActivity(activityId: number): Promise<void> {
            const activity = await store.dispatch('activity/fetchItem', activityId);
        },

        async fetchAassessmentsByTask(): Promise<void>{
            
            const aassessments = await store.dispatch('aassessment/fetchAassessmentsByTask', this.taskId);

        },

        filterStudentsByTeam(team:Team): Student[] {
            return this.allStudents.filter((student: Student) => team.studentIds.includes(student.id))
        },

        findCriterion(aassessment:Aassessment): Criterion{
            return this.allCriterias.find((c: Criterion) => c.id == aassessment.criterionId);
        },

        filterAassessmentsByCriterionCategory(category:string): Aassessment[]{
            const criterionIds = this.filteredCriterions(category).map(c => c.id);
            return this.aassessments.filter(a => criterionIds?.includes(a.criterionId))
        },

        async fetchActivityCriteria(activityId: number): Promise<void> {
            await store.dispatch("criterion/fetchActivityCriteria", activityId);
        },

        filteredCriterions(category:string): Criterion[] {
            // if(category == null){
            //     return this.allCriterias as Criterion[];
            // }
            return (this.allCriterias as Criterion[]).filter(c => c.category === category);
        },
        
        async takeResponsibility(){
            let updatedTask = this.task;
            updatedTask.responsibleUserId = this.currentUser.id;
            updatedTask = await this.updateTask({...updatedTask}) as Task
        },

        getMaxPoints(){
            let criterias: Criterion[];
            if (this.task.criteriaCategory == undefined) {
                criterias = this.allCriterias;
            }
            else {
                criterias = this.filteredCriterions(this.task.criteriaCategory);
            }

            let sum = 0;
            for(let i = 0; i < criterias.length; i++){
                sum = sum + criterias[i].maxPoints;
            }
            return sum;
        },

        getStudentPoints(studentId: number){
            let aassessments = this.allAassessments as Aassessment[];
            if (this.task.criteriaCategory == undefined) {
                aassessments = aassessments.filter(a => a.studentId == studentId);
            }
            else {
                const criterias = this.filteredCriterions(this.task.criteriaCategory).map(c => c.id);
                aassessments = aassessments.filter(a => a.studentId == studentId && criterias.includes(a.criterionId))
            }

            let sum = 0
            for(let i = 0; i < aassessments.length; i++){
                sum = sum + (aassessments[i].points ?? 0)
            }
            return sum
        },
        
        isTeamAassessed(teamId: number): boolean{
            const aassessments = this.allAassessments as Aassessment[]
            const findResult = aassessments.find(a => a.teamId == teamId)
            return findResult != undefined;
        },

        getTeamPoints(team: Team){
            let aassessments = this.allAassessments as Aassessment[];
            const criterias = this.filteredCriterions(this.task.criteriaCategory);

            if (this.task.criteriaCategory == undefined) {
                aassessments = aassessments.filter(a => a.teamId == team.id)
            }
            else {
                const criteriasIds = criterias.map(c => c.id)
                aassessments = aassessments.filter(a => a.teamId == team.id && criteriasIds.includes(a.criterionId))
            }

            let sum = 0;
            if(team) {
                for(let i = 0; i < aassessments.length; i++){
                    const aassessment = aassessments[i]

                    const criterion = criterias.find(c => c.id == aassessment.criterionId);

                    if(aassessment && criterion){
                        sum = sum + (aassessment.points ?? 0);
                    }
                }
            }
            return sum;
        },

        async start(){
            timer.startTimer();
            this.started = true;
        },

        async pause(){
            timer.stopTimer();
            this.started = false;
        },

        async reset(){
            timer.resetTimer();
        },

        resetCounters(){
            this.aassessedUnits = 0;
            this.reset();
        },

        async submitAndNext() {
            const input = this.$refs.assessmentInput as Array<any>
            const id = this.activity?.teamBased ? this.selectedTeam.id : this.selectedStudent.id

            if (this.activity?.teamBased) {
                const index = this.allTeams.findIndex((t: Team) => t.id === id) + 1;
                if (index < this.allTeams.length) {
                    this.teamTabIndex = index;
                    input[0].$el.children[0].focus();
                }
                else {
                    this.submit(id);
                }
            }
            else {
                const index = this.allStudents.findIndex((s: Student) => s.id === id) + 1;
                if (index < this.allStudents.length) {
                    this.selectStudent(this.allStudents[index]);
                    input[0].$el.children[0].focus();
                }
                else {
                    this.submit(id);
                }
            }
        },
        async submit(id:number|null){
            const criterias = this.allCriterias as Criterion[];
            let assessments: Aassessment[];

            if (this.task.criteriaCategory == undefined) {
                assessments = this.aassessments as Aassessment[];
            }
            else {
                assessments = this.filterAassessmentsByCriterionCategory(this.task?.criteriaCategory);
            }

            if(typeof id != 'number'){
                logger.debug("id is not number");
                id = null;
            }

            for (let i = 0; i < assessments.length; i++) {
                const aassessment = assessments[i];
                aassessment.userId = this.currentUser?.id;

                const criterion = criterias.find(c => c.id == aassessment.criterionId);
                
                if(criterion != undefined){
                    if(criterion.maxPoints == aassessment.points){
                        aassessment.feedback = undefined;
                    }
                }

                if (this.activity?.teamBased) {
                    if(this.selectedTeam){
                        aassessment.teamId = id ?? this.selectedTeam.id;
                    }
                    else{
                        return;
                    }
                }
                else {
                    if(this.selectedStudent){
                        aassessment.studentId = id ?? this.selectedStudent.id;
                    }
                    else{
                        return;
                    }
                }

                const aassessmentStored = this.allAassessments.find((a: Aassessment) => a.id == aassessment.id);
                
                if(aassessmentStored){
                    if(deepEqual(aassessmentStored, aassessment)){
                        continue;
                    }
                }

                if(aassessment.points == undefined){
                    continue;
                }

                this.createOrUpdateAassessment(aassessment);                
            }

            this.aassessedUnits = this.aassessedUnits + 1;

            if(id == undefined){
                this.unselectStudent()
                this.unselectTeam()
            }
        },

        getTeams(){            
            return this.allTeams
        }
    },

    beforeUnmount() {
        // This hook is called right before the component is destroyed
        this.unselectStudent();
        this.unselectTeam();
        timer.stopTimer();
        timer.resetTimer();
    }
})
