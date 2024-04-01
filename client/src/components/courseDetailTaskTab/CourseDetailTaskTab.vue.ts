import Course from '@/models/Course/Course';
import store from '@/store';
import logger from '@/utils/loggerUtil';
import Task from "@/models/Task/Task";
import Button from 'primevue/button';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import TaskCard from '@/components/TaskCard.vue';
import UserCard from '@/components/UserCard.vue';
import TaskSidePanelForm from '@/components/TaskSidePanelForm.vue';
import User from '@/models/User/User';
import LoadingBadger from "@/components/LoadingBadger.vue"
import Divider from 'primevue/divider';
import AssignSolverSidePanelForm from '@/components/AssignSolverSidePanelForm.vue';
import Dropdown from 'primevue/dropdown';
import Type from '@/models/Type/Type';
import Breadcrumb from 'primevue/breadcrumb';


export default defineComponent({
    name: "CourseDetailTaskTab",
    components: { Button, TaskCard, UserCard, TaskSidePanelForm,LoadingBadger, Divider, AssignSolverSidePanelForm, Dropdown,Breadcrumb },

    computed: {
        ...mapGetters('course', ['getItemById']),
        ...mapGetters('task', { allTasks: 'allItems'}),
        ...mapGetters('type', { allTypes: 'allItems'}),
        ...mapGetters('user', { allUsers: 'allItems', currentUser: 'currentUser'}),

        course(): Course { return this.getItemById(this.courseId) },
        guarantor(): User { return this.allUsers.find((p: User) => p.id == this.course.guarantorId); },
        isGuarantor(): boolean { return this.guarantor?.id == this.currentUser?.id },
        allUsersWithoutGuarantor(): User[] { return this.allUsers.filter((u: User) => u.id !== this.course.guarantorId && u.privilegedCourses?.includes(this.courseId))},

        home(): any { return {
            icon: 'pi pi-home',
            route: '/courses'
        }},

        items(): any[] { return [
            { label: `${this.course?.name} (${this.course?.abbrevation})` }
        ]}

    },
    data() {
        return {
            loading: true,
            openAddSolverSidePanel: false,
            typeCategory: undefined,
        };
    },
    props: {
        courseId: { type: Number, required: true }
    },

    created() {
        Promise.all([this.fetchCourseTasks(), this.fetchCourseUsers(this.courseId), this.fetchCourseTypes()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },
    watch: {
        course: {
            handler(newValue: Course, oldValue: Course) {
                if (newValue) {
                    this.loading = true;
                    this.fetchCourseUsers(newValue.id)
                        .then(() => {
                            this.loading = false;
                        })
                        .catch((error) => {
                            logger.error("Error fetching data:", error);
                            this.loading = false;
                        });
                }
            },
            deep:true
        }
    },

    methods: {
        ...mapActions('task', ['selectItem']),

        async fetchCourseTasks() {
            await store.dispatch("task/fetchCourseTasks", this.courseId);
        },

        async fetchCourseUsers(courseId: number) {
            await store.dispatch("user/fetchCourseUsers", courseId);
        },

        
        async fetchCourseTypes() {
            await store.dispatch("type/fetchCourseTypes", this.courseId);
        },
        
        selectTask(course: Course, task: Task) {
            this.$router.push(`/courses/${course.id}/tasks/${task.id}`);
        },

        async toggleOpenAddSolver(){
            this.openAddSolverSidePanel = ! this.openAddSolverSidePanel
        },

        getTasks(){
            if(this.typeCategory != undefined){
                const type = this.typeCategory as Type
                logger.debug("type category: ", this.typeCategory);
                logger.debug("tasks: ", this.allTasks);
                return this.allTasks.filter((t: Task) => t.typeId == type.id);
            }

            return this.allTasks
        }
    }
});
