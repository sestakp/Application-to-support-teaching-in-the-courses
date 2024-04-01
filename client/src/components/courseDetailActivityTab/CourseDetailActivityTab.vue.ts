import Course from '@/models/Course/Course';
import store from '@/store';
import logger from '@/utils/loggerUtil';
import Button from 'primevue/button';
import { defineComponent, ref } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import ActivityCard from '@/components/ActivityCard.vue';
import ActivitySidePanelForm from '@/components/ActivitySidePanelForm.vue';
import Activity from '@/models/Activity/Activity';
import LoadingBadger from "@/components/LoadingBadger.vue"
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';
import Divider from 'primevue/divider';
import Breadcrumb from 'primevue/breadcrumb';

export default defineComponent({
    name: "CourseDetailActivityTab",
    components: { Button, ActivityCard, ActivitySidePanelForm, LoadingBadger, Accordion, AccordionTab, Divider, Breadcrumb },

    computed: {
        ...mapGetters('course', ['getItemById']),
        ...mapGetters('activity', { allActivities: 'allItems'}),

        course(): Course { return this.getItemById(this.courseId) },

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
        };
    },
    props: {
        courseId: { type: Number, required: true }
    },

    created: function() {
        Promise.all([this.fetchCourseActivities()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    methods: {
        ...mapActions('activity', ['selectItem']),

        async fetchCourseActivities() {
            await store.dispatch("activity/fetchCourseActivities", this.courseId);
        },
        
        selectActivity(activity: Activity) {
            this.$router.push(`/courses/${this.courseId}/activities/${activity.id}/0`);
        }
    }
})
