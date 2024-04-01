import CourseCard from '@/components/CourseCard.vue';
import CourseSidePanelForm from '@/components/CourseSidePanelForm.vue';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import store from '@/store';
import Button from 'primevue/button';
import Course from "@/models/Course/Course"
import logger from '@/utils/loggerUtil';
import LoadingBadger from "@/components/LoadingBadger.vue"

export default defineComponent({
    name: "CourseListView",
    components: { CourseCard, Button, CourseSidePanelForm,LoadingBadger},

    computed: {
        ...mapGetters('course', ['allItems']),
    },
    data() {
        return {
            loading: true,
        };
    },

    created() {
        // Call the Vuex action to fetch data
        // Use Promise.all to wait for both actions to complete
        Promise.all([this.fetchCourses(), this.fetchUsers()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error('Error fetching data:', error);
                this.loading = false;
            });
    },

    methods: {
        ...mapActions('course', ['selectItem']),

        async fetchCourses() {
            await store.dispatch('course/fetchItems');
        },
        
        async fetchUsers() {
            await store.dispatch('user/fetchItems');
        },
        
        selectCourse(course: Course) {
            this.$router.push(`courses/${course.id}/0`);
        }
    },
});
