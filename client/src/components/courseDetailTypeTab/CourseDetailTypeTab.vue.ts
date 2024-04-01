import Course from '@/models/Course/Course';
import store from '@/store';
import logger from '@/utils/loggerUtil';
import Button from 'primevue/button';
import { defineComponent } from 'vue';
import { mapGetters, mapActions } from 'vuex';
import LoadingBadger from "@/components/LoadingBadger.vue"
import TypeCard from '@/components/TypeCard.vue';
import TypeSidePanelForm from '@/components/TypeSidePanelForm.vue';
import Breadcrumb from 'primevue/breadcrumb';

export default defineComponent({
    name: "CourseDetailTypeTab",
    components: { Button, LoadingBadger, TypeCard, TypeSidePanelForm, Breadcrumb },

    computed: {
        ...mapGetters('course', ['getItemById']),
        ...mapGetters('type', {allTypes: 'allItems'}),

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
        Promise.all([this.fetchCourseTypes()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    methods: {
        ...mapActions('type', ['selectItem']),

        async fetchCourseTypes() {
            await store.dispatch("type/fetchCourseTypes", this.courseId);
        },
    }
});
