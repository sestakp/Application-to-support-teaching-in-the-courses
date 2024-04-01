import { defineComponent } from "vue";
import Button from "primevue/button";
import Sidebar from "primevue/sidebar";
import Textarea from "primevue/textarea";
import { mapGetters, mapActions } from "vuex";
import logger from "@/utils/loggerUtil";
import store from "@/store";
import Course from "@/models/Course/Course";
import Student from "@/models/Student/Student";
import LoadingBadger from "@/components/LoadingBadger.vue"
import StudentCard from "@/components/StudentCard.vue";
import InputText from "primevue/inputtext";
import isStringSet from "@/utils/isStrSet";
import Breadcrumb from 'primevue/breadcrumb';

export default defineComponent({
    name: "CourseDetailStudentTab",
    
    components: {Button, LoadingBadger, Sidebar, Textarea, InputText, StudentCard, Breadcrumb},
    data() {
        return{
            loading: false,
            openImportStudentsSidePanel: false,
            courseId: Number(this.$route.params.courseId),
            studentImportInput: "",
            studentImportError: "",
            insertStudentError: "",
            importing: false
        }
    },
    computed: {
        ...mapGetters('student', { allStudents: 'allItems', selectedStudent: 'selectedItem' }),
        ...mapGetters('course', ['getItemById']),

        course(): Course { return this.getItemById(this.courseId) },

        isSelectedStudent: {
            get(): boolean { return this.selectedStudent !== undefined },
            set(value: boolean) { if (!value) this.unselectStudent() }
        },

        home(): any { return {
            icon: 'pi pi-home',
            route: '/courses'
        }},

        items(): any[] { return [
            { label: `${this.course?.name} (${this.course?.abbrevation})` }
        ]}
    },

    created() {
        Promise.all([this.fetchCourse()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    methods: {
        ...mapActions('student', {selectStudent: 'selectItem', unselectStudent: 'unselectItem', createOrUpdateStudent: 'createOrUpdateItem', deleteStudent: 'deleteItem'}),
        ...mapActions('course', {createOrUpdateCourse: 'createOrUpdateItem'}),

        toggleImportStudensOpen(){
            this.openImportStudentsSidePanel = ! this.openImportStudentsSidePanel
        },

        async fetchCourse() {
            const course = await store.dispatch("course/fetchItem", this.courseId);
            await this.fetchCourseStudents(course);
        },

        async fetchCourseStudents(course: Course) {
            await store.dispatch("student/fetchCourseStudents", course);
        },

        onStudentInputChange(){
            const lines = this.studentImportInput.split('\n');
            
            let lineCounter = 1;
            for (const line of lines) {
                if (line.split('\t').length != 3) {
                    this.studentImportError = `Parsing error: not 3 elements on line ${lineCounter}`
                    return;
                }
                lineCounter = lineCounter + 1;
            }
            
            this.studentImportError = "";
        },

        insertTab(event:any) {
            // Get the current selection and caret position
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;
      
            // Insert a tab character at the caret position
            this.studentImportInput = this.studentImportInput.substring(0, start) + '\t' + this.studentImportInput.substring(end);
      
            // Move the caret to after the inserted tab character
            this.$nextTick(() => {
              event.target.setSelectionRange(start + 1, start + 1);
            });
        },

        async onSubmit(){
            this.importing = true;
            try{
                if(this.studentImportError == ""){
                    const lines = this.studentImportInput.split('\n');
                    const studentIds: number[] = [];
                    const students = this.allStudents as Student[];
    
                    /*for(let i = 0; i < students.length; i++){
    
                        const student = students[i];
                        //TODO... error
    
    
                        if(this.course.students.includes(student.id)){ //safe check
                            this.deleteStudent(student.id)
                        }
                    }*/
    
                    console.log("allStudents: ", students)
                    for (const line of lines) {
                        const [name, login, xname] = line.split('\t');
                        console.log("parsed line: ", name, login, xname)
                        let student = students.find(s => s.name == name && s.vutlogin == login && s.fitlogin == xname);
                        console.log("student: ", student)
                        if(student != undefined){
                            continue;
                        }

                        
                        student = {} as Student

                        student.name = name;
                        student.vutlogin = login;
                        student.fitlogin = xname;
                        student.courseId = this.courseId;


    
                        const insertedStudent = await this.createOrUpdateStudent(student)
                        studentIds.push(insertedStudent.id);
                    }
                    
                    this.toggleImportStudensOpen()
                }
            }
            finally{
                this.studentImportInput = ""
                this.importing = false;
            }
            
        },

        async saveStudentSubmit() {
            const student = this.selectedStudent as Student;
            student.courseId = this.courseId;

            if( ! isStringSet(student.name)){
                this.insertStudentError = "Name is required"
                return
            }

            if( ! isStringSet(student.vutlogin)){
                this.insertStudentError = "VUT login is required"
                return
            }

            if( ! isStringSet(student.fitlogin)){
                this.insertStudentError = "FIT login is required"
                return
            }

            this.insertStudentError = "";

            this.createOrUpdateStudent(student)
        },

        async deleteAllStudents(){

            while(this.allStudents.length > 0){
                const student = this.allStudents[0];
                if(this.course.students.includes(student.id)){ //safe check
                    logger.debug("deleting student")
                    await this.deleteStudent(student.id)
                }
            }
        },

        onShow() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add("overflow-hidden");
        },

        onHide() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove("overflow-hidden");
            this.unselectStudent();
        }
    }
})
