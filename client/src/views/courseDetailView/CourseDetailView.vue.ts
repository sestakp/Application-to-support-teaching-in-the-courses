import Course from '@/models/Course/Course';
import store from '@/store';
import logger from '@/utils/loggerUtil';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import User from '@/models/User/User';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import CourseDetailActivityTab from '@/components/CourseDetailActivityTab.vue';
import CourseDetailTaskTab from '@/components/CourseDetailTaskTab.vue';
import CourseDetailTypeTab from '@/components/CourseDetailTypeTab.vue';
import CourseDetailStudentTab from '@/components/CourseDetailStudentTab.vue';
export default defineComponent({
    name: "CourseDetailView",
    components: { TabView, TabPanel,CourseDetailActivityTab, CourseDetailTaskTab, CourseDetailTypeTab, CourseDetailStudentTab },

    computed: {
        ...mapGetters('course', ['getItemById']),
        ...mapGetters('activity', { allActivities: 'allItems'}),
        ...mapGetters('user', { allUsers: 'allItems', currentUser: 'currentUser'}),

        course(): Course { return this.getItemById(this.courseId) },
        guarantor(): User { return this.allUsers.find((p: User) => p.id == this.course.guarantorId); },
        
    },
    data() {
        return {
            loading: true,
            courseId: Number(this.$route.params.courseId),
            tabId: Number(this.$route.params.tabId)
        };
    },

    created() {

        Promise.all([this.fetchCourseActivities(), this.fetchCourse()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    watch: {
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
        ...mapActions('activity', ['selectItem']),

        async fetchCourseActivities() {
            await store.dispatch("activity/fetchCourseActivities", this.courseId);
        },

        async fetchCourse() {
            await store.dispatch("course/fetchItem", this.courseId);
        }
    }
})
