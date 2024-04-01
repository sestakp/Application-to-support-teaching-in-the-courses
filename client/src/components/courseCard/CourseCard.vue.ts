import { defineComponent } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import Course from '@/models/Course/Course';  
import { mapActions, mapGetters } from 'vuex';
import User from '@/models/User/User';
import ConfirmDialog from 'primevue/confirmdialog';
import logger from '@/utils/loggerUtil';

export default defineComponent({
    name: "CourseCard",
    components: { Card, Button, ConfirmDialog },

    computed: {
        ...mapGetters('user', {getUserById: 'getItemById', currentUser: "currentUser"}),

        guarantor():User { return this.getUserById(this.course?.guarantorId) }
    },
    props: {
        course: {
            type: Object as () => Course,
            required: true,
        },
    },

    methods: {
        ...mapActions('course', ['selectItem', 'deleteItem']),
        
        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete course ${this.course?.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteItem(this.course.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Course deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting a course', life: 3000 });
                    }
                }
            });
        },
    },
})
