import store from '@/store';
import logger from '@/utils/loggerUtil';
import Button from 'primevue/button';
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import { defineComponent, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import CriterionCard from '@/components/CriterionCard.vue';
import Criterion from '@/models/Criterion/Criterion';
import CriterionSidePanel from '@/components//CriterionSidePanelForm.vue'
import LoadingBadger from "@/components/LoadingBadger.vue"
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Activity from '@/models/Activity/Activity';
import Sidebar from 'primevue/sidebar'
import Report from '@/models/Report/Report';
import Textarea from 'primevue/textarea'
import Student from '@/models/Student/Student';
import ScrollPanel from 'primevue/scrollpanel';
import InputNumber from 'primevue/inputnumber';
import User from '@/models/User/User';
import Course from '@/models/Course/Course';
import Team from '@/models/Team/Team';
import EmailTemplateEditor from '@/components/EmailTemplateEditor.vue';
import EmailPreview from '@/components/EmailPreview.vue';
import Aassessment from '@/models/Aassessment/Aassessment';
import createAassessmentCSV from '@/utils/createAassessmentCSV';
import Divider from 'primevue/divider';
import Card from 'primevue/card';
import {addTimes, getTimesRatio } from '@/utils/times';
import StudentCard from '@/components/StudentCard.vue';
import StudentAssessmentCard from '@/components/StudentAssessmentCard.vue';
import deepEqual from '@/utils/deepEqual';
import MailApi from '@/api/Mail/MailApi';
import CurrentUser from '@/models/User/CurrentUser';
import emailTranslate from '@/utils/emailTranslate';
import Breadcrumb from 'primevue/breadcrumb';

interface ActivityDetailViewData {
    loading: boolean,
    courseId: number,
    activityId: number,
    aassessmentExport: string,
    importTeamsOpen: boolean,
    teamImportInput: string,
    teamImportError: string,
    aassessments: Aassessment[],
    teamTabIndex: number,
    mailSended: number | undefined,
    teamImportLabel: string,
    tabId: number,
}

export default defineComponent({
    name: "ActivityDetailView",
    components: { Button, 
        CriterionCard, 
        CriterionSidePanel, 
        Accordion, 
        AccordionTab, 
        LoadingBadger, 
        TabView, 
        TabPanel,
        Sidebar, 
        Textarea, 
        ScrollPanel,
        EmailTemplateEditor, 
        EmailPreview, 
        InputNumber,
        Divider, 
        Card, 
        StudentCard, 
        StudentAssessmentCard, 
        Breadcrumb 
    },

    computed: {
        ...mapGetters('course', {getCourseById: 'getItemById'}),
        ...mapGetters('activity', {getActivityById: 'getItemById'}),
        ...mapGetters('criterion', { allCriterias: 'allItems', getCategories: 'getCategories' }),
        ...mapGetters('user', { allUsers: 'allItems', currentUser: 'currentUser' }),
        ...mapGetters('student', { allStudents: 'allItems', selectedStudent: 'selectedItem' }),
        ...mapGetters('team', { allTeams: 'allItems', selectedTeam: "selectedItem" }),
        ...mapGetters('report', { allReports: 'allItems'}),
        ...mapGetters('aassessment', { allAassessments: 'allItems'}),

        activity(): Activity { return this.getActivityById(this.activityId) },
        categories(): string[] { return this.getCategories(this.activityId) },
        course(): Course { return this.getCourseById(this.courseId)},
        guarantor(): User { return this.allUsers.find((p: User) => p.id == this.course.guarantorId); },
        usersWithAccessToCurrentCourse(): User[] { return this.allUsers.filter((u: User) => u.privilegedCourses?.includes(this.courseId))},
        isGuarantor(): boolean {return this.guarantor?.id === this.currentUser?.id},
        
        canEdit():boolean { return (this.selectedStudent != undefined || this.selectedTeam != undefined)},

        home(): any { return {
            icon: 'pi pi-home',
            route: '/courses'
        }},

        items(): any[] { return [
            { label: `${this.course?.name} (${this.course?.abbrevation})`, route: `/courses/${this.courseId}/0`},
            
            { label: `${this.activity?.name}` }
        ]}
    },
    data():ActivityDetailViewData {
        return {
            loading: true,
            courseId: Number(this.$route.params.courseId),
            activityId: Number(this.$route.params.activityId),
            aassessmentExport: "",
            importTeamsOpen: false,
            teamImportInput: "",
            teamImportError: "",
            aassessments: [],
            teamTabIndex: -1,
            mailSended: undefined,
            teamImportLabel: "Import",            
            tabId: Number(this.$route.params.tabId)
        };
    },

    created() {
        Promise.all([this.fetchActivityCriteria(), this.fetchCourse(), this.fetchActivityReports(), this.fetchAassessmentsByActivity()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    watch: {
        allStudents: {
            handler(newValue: Student[], oldValue: Student[]) {
                if (newValue &&  this.activity?.teamBased) {
                    this.createAassessmentCSV();
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
                    await this.onAassessmentSubmit(oldValue.id);
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
                    else{
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
                if(oldValue && newValue != undefined){
                    logger.debug("selected team new: ", newValue, " old: ", oldValue)
                    await this.onAassessmentSubmit(oldValue.id)
                }

                if(newValue){
                    logger.debug("selectedTeam: ", newValue)

                    const allAassessments = (this.allAassessments as Aassessment[]).filter(a => a.teamId == newValue.id);

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
                    else{
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

        allAassessments: {
            
            handler(newValue: Aassessment[], oldValue: Aassessment[]) {
                if(newValue){
                    this.createAassessmentCSV();
                }
            }
        },

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
                
                const team = this.allTeams.at(newValue)
                if(team){                  
                    this.selectTeam(team);
                }
            }
        },

        allTeams: {
            handler(newValue: Team[], oldValue: Team[]) {
                
                if(newValue){

                    for(let i = 0; i < newValue.length; i++){
                        const team = newValue[i];
                        if(team.studentIds.length == 0){
                            this.deleteTeam(team.id);
                        }
                    }
                }
            }
        },

        tabId(newTabIndex, oldTabIndex) {
            if(this.$route.params.tabId != newTabIndex){
                this.$router.push(`${newTabIndex}`);
            }
        },

    },
    beforeRouteUpdate(to, from, next) {
        this.tabId = Number(to.params.tabId);
        next();
    },

    methods: {
        ...mapActions('criterion', {selectCriterion: 'selectItem'}),
        ...mapActions('student', {selectStudent: 'selectItem', createOrUpdateStudent: 'createOrUpdateItem', unselectStudent: 'unselectItem'}),
        ...mapActions('activity', {createOrUpdateActivity: 'createOrUpdateItem'}),
        ...mapActions('course', {createOrUpdateCourse: 'createOrUpdateItem'}),
        ...mapActions('aassessment', {createOrUpdateAassessment: 'createOrUpdateItem'}),
        ...mapActions('team', {selectTeam: 'selectItem', deleteTeam: 'deleteItem', createOrUpdateTeam: 'createOrUpdateItem', unselectTeam: 'unselectItem'}),

        onTeamInputChange(){
            const lines = this.teamImportInput.split('\n');
            
            let lineCounter = 1;
            for (const line of lines) {
                if (line.split('\t').length != 4) {
                    this.teamImportError = `Parsing error: not 4 elements on line ${lineCounter}`
                    return;
                }
                lineCounter = lineCounter + 1;
            }
            
            this.teamImportError = "";
        },

        toggleImportTeamsOpen(){
            this.importTeamsOpen = ! this.importTeamsOpen
        },

        insertTab(event:any) {
            // Get the current selection and caret position
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
      
            // Insert a tab character at the caret position
            this.teamImportInput = this.teamImportInput.substring(0, start) + '\t' + this.teamImportInput.substring(end);
      
            // Move the caret to after the inserted tab character
            this.$nextTick(() => {
              event.target.setSelectionRange(start + 1, start + 1);
            });
        },

        async onAassessmentSubmitAndNext() {
            const input = this.$refs.assessmentInput as Array<any>
            const id = this.activity.teamBased ? this.selectedTeam.id : this.selectedStudent.id

            if (this.activity.teamBased) {
                const index = this.allTeams.findIndex((t: Team) => t.id === id) + 1;
                if (index < this.allTeams.length) {
                    this.teamTabIndex = index;
                    input[0].$el.children[0].focus();
                }
                else {
                    this.onAassessmentSubmit(id);
                }
            }
            else {
                const index = this.allStudents.findIndex((s: Student) => s.id === id) + 1;
                if (index < this.allStudents.length) {
                    this.selectStudent(this.allStudents[index]);
                    input[0].$el.children[0].focus();
                }
                else {
                    this.onAassessmentSubmit(id);
                }
            }
        },
        async onAassessmentSubmit(id:number|null){
            const aassessments = this.aassessments as Aassessment[];
            const criterias = this.allCriterias as Criterion[]

            if(typeof id != 'number'){
                logger.debug("id is not number")
                id = null;
            }

            for (let i = 0; i < aassessments.length; i++) {
                const aassessment = aassessments[i];
                aassessment.userId = this.currentUser?.id;

                const criterion = criterias.find(c => c.id == aassessment.criterionId);
                
                if (this.activity?.teamBased) {
                    aassessment.teamId = id ?? this.selectedTeam.id;
                }
                else {
                    aassessment.studentId = id ?? this.selectedStudent.id;
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

                logger.debug("create or update aassessment: ", aassessment)
                this.createOrUpdateAassessment(aassessment);
                
            }
            if(id == undefined){
                this.unselectStudent()
                this.unselectTeam()
            }
        },

        async onTeamSubmit(){
            try{
                if(this.teamImportError == ""){
                    const lines = this.teamImportInput.split('\n');
                    const lineCount = lines.length;
                    const teams: Team[] = [];
                    const studentIds: number[] = [];
                    const students = this.allStudents as Student[];
    
                    const allTeams = this.allTeams as Team[]
    
                    for(let i = 0; i < allTeams.length; i++){
                        const team = allTeams[i] as Team
                        await this.deleteTeam(team.id)
                    }
                    
                    let iterator = 0;
                    for (const line of lines) {
                        const [name, login, xname, teamName] = line.split('\t');
    
    
                        let studentMatch = students.find(s => s.name == name && s.fitlogin == xname && s.vutlogin == login)
    
                        if(studentMatch == undefined){
                            //create student
                            const student = {} as Student;
                            student.name = name;
                            student.vutlogin = login;
                            student.fitlogin = xname;
                            student.courseId = this.courseId;
                            studentMatch = await this.createOrUpdateStudent(student) as Student
                            
                        }
                        studentIds.push(studentMatch.id)
    
                        let teamMatch = teams.find(t => t.name == teamName)
    
                        if(teamMatch == undefined){
                            teamMatch = {} as Team;
                            teamMatch.name = teamName;
                            teamMatch.studentIds = [];
                            teamMatch.studentIds.push(studentMatch?.id)
                            teamMatch.activityId = this.activityId;
                            teams.push(teamMatch)
                        }
                        else{
                            teamMatch.studentIds.push(studentMatch.id)
                        }
                        iterator += 1;
                        this.teamImportLabel = `Processed ${iterator}/${lineCount} students`
                    }
    
                    for(let i = 0; i < teams.length; i++){
                        const team = teams[i]
                        
                        await this.createOrUpdateTeam(team) as Team
                        
                        this.teamImportLabel = `Processed ${i}/${teams.length} teams`
                    }
    
    
                    this.toggleImportTeamsOpen()
                }    
            }
            finally{
                this.teamImportInput = ""
                this.teamImportLabel = "Import"
            }
            
        },

        openTeamDeleteDialog(team:Team){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete team ${team.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteTeam(team.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Team deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting a team', life: 3000 });
                    }
                }
            });
        },

        async fetchActivityCriteria() {
            await store.dispatch("criterion/fetchActivityCriteria", this.activityId);
        },

        async fetchAassessmentsByActivity(){
            await store.dispatch("aassessment/fetchAassessmentsByActivity", this.activityId)
        },


        async fetchCourse() {
            const course = await store.dispatch("course/fetchItem", this.courseId);
            await Promise.all([
                this.fetchCourseUsers(course),
                this.fetchCourseStudents(course),
                this.fetchCourseTeams(course.id)
            ]);
        },

        async fetchCourseUsers(course: Course){
            await store.dispatch("user/fetchCourseUsers", course.id);
        },

        async fetchCourseStudents(course: Course) {
            await store.dispatch("student/fetchCourseStudents", course);
        },
        
        async fetchCourseTeams(courseId: number) {
            await store.dispatch("team/fetchCourseTeams", courseId);
        },

        filteredCriterions(category: string) {
            return (this.allCriterias as Criterion[]).filter(c => c.category === category);
        },

        async fetchActivityReports() {
            await store.dispatch("report/fetchActivityReports", this.activityId);
        },

        isStudentAassessed(studentId: number): boolean{
            const aassessments = this.allAassessments as Aassessment[]
            const findResult = aassessments.find(a => a.studentId == studentId)
            return findResult != undefined;
        },

        isTeamAassessed(teamId: number): boolean{
            const aassessments = this.allAassessments as Aassessment[];
            const findResult = aassessments.find(a => a.teamId == teamId);
            return findResult != undefined;
        },

        getMaxPoints(){
            const criterias = this.allCriterias as Criterion[];
            let sum = 0;
            for(let i = 0; i < criterias.length; i++){
                sum = sum + criterias[i].maxPoints;
            }
            return sum;
        },

        getStudentPoints(studentId: number){
            let aassessments = this.allAassessments as Aassessment[];
            aassessments = aassessments.filter(a => a.studentId == studentId);
            let sum = 0;
            for(let i = 0; i < aassessments.length; i++){
                sum = sum + (aassessments[i].points ?? 0);
            }
            return sum;
        },

        getUserHours(userId: number){
            
            let reports = this.allReports as Report[];
            reports = reports.filter(r => r.userId == userId)

            let sum = "0:00:00";
            for(let i = 0; i < reports.length; i++){
                sum = addTimes(sum, reports[i].hours)
            }

            return sum;
        },


        getUserRatio(userId: number){
            let totalTime = "0:00:00"
            
            const reports = this.allReports as Report[];
            

            for(let i = 0; i < reports.length; i++){
                totalTime = addTimes(totalTime, reports[i].hours)
            }

            const percents = (getTimesRatio(this.getUserHours(userId), totalTime) * 100);
            if(isNaN(percents) ){
                return (0).toFixed(1);
            }

            return percents.toFixed(1)
        },

        getTeamPoints(team: Team){
            let aassessments = this.allAassessments as Aassessment[];
            //const criterias = this.allCriterias as Criterion[];

            aassessments = aassessments.filter(a => a.teamId == team.id)

            let sum = 0
            if(team){
                for(let i = 0; i < aassessments.length; i++){
                    const aassessment = aassessments[i]
                    if(aassessment){
                        sum = sum + (aassessment.points ?? 0)
                        /*
                        const criterion = criterias.find(c => c.id == aassessment.criterionId)
                        if(criterion){
                            if(criterion.aassessmentMethod == 'Per team'){
                                sum = sum + (aassessment.points ?? 0) / team.studentIds.length
                            }
                            else{
                                sum = sum + (aassessment.points ?? 0)
                            }
                        }*/
                    }
                    
                }
            }
            return sum
        },

        filterAassessmentsByCriterionCategory(category:string): Aassessment[]{
            const criterionIds = this.filteredCriterions(category).map(c => c.id);
            return this.aassessments.filter(a => criterionIds?.includes(a.criterionId))
        },
 
        findCriterion(aassessment:Aassessment): Criterion{
            return this.allCriterias.find((c: Criterion) => c.id == aassessment.criterionId);
        },

        filterStudentsByTeam(team:Team): Student[] {
            return this.allStudents.filter((student: Student) => team.studentIds?.includes(student.id))
        },

        updateActivity(activity:Activity) {
            this.activity = activity;
        },

        createAassessmentCSV(){
            const students = this.allStudents as Student[]
            const aassessments = this.allAassessments as Aassessment[]
            const teams = this.allTeams as Team[]
            const criterias = this.allCriterias as Criterion[]
            this.aassessmentExport = createAassessmentCSV(students, aassessments, teams, criterias)
        },

        async massSendingOfEmails(){
            logger.debug("mass sending of emails")

            const students = this.allStudents as Student[]
            const teams = this.allTeams as Team[]
            const user = this.currentUser as CurrentUser;
            this.loading = true
            try{
                this.mailSended = 0;
                for(let i = 0; i < students.length; i++){
                    const student = students[i]
                    const team = teams.find(t => t.studentIds?.includes(student.id))
                    
                    if(this.activity.teamBased && team == undefined){
                        logger.error("its team based, but team not found")
                    }
                    const translatedEmail = emailTranslate(this.activity.emailTemplate, this.categories, this.allCriterias, this.allAassessments, student, team)
                    
                    if(translatedEmail != ""){
                        //logger.debug("translated email: ", translatedEmail)
                        await MailApi.sendMessage(user.email, `${student.fitlogin}@stud.fit.vutbr.cz`, `Hodnocení ${this.course.abbrevation} - ${this.activity.name}`, translatedEmail, user.token);
                        
                        this.mailSended += 1;
                    }
                }
            }
            finally{
                this.loading = false
                this.mailSended = undefined;
            }   
        }
    }
});
