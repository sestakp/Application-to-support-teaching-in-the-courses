import User from '@/models/User/User';
import Card from 'primevue/card';
import Course from '@/models/Course/Course';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
    name: "UserCard",
    components: { Card },

    computed: {
        highlight() { return this.isGuarantor ? "highlight" : "" },
        ...mapGetters('user', {currentUser: 'currentUser'}),
    },
    props: {
        user: { type: Object as () => User, required: true },
        isGuarantor: { type: Boolean, required: false, default: false },
        course: { type: Object as () => Course, required: true },
    },

    methods: {
        
        ...mapActions('course', {createOrUpdateCourse: 'createOrUpdateItem'}),
        ...mapActions('user', {removeCourseFromUser: 'removeCourseFromUser'}),

        async removeUser(){
            this.removeCourseFromUser({course: this.course, user: this.user})
        },

        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to remove solver ${this.user.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.removeCourseFromUser({course: this.course, user: this.user});
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Solver removed', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when removing solver', life: 3000 });
                    }
                }
            });
        },

    },
})
