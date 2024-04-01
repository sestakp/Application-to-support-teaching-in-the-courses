import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Sidebar from 'primevue/sidebar';
import Course from '@/models/Course/Course';
import { mapActions, mapGetters } from 'vuex';
import logger from '@/utils/loggerUtil';
import InputNumber from 'primevue/inputnumber';
import isStringSet from '@/utils/isStrSet';

export default defineComponent({
    components: { Button, Sidebar, InputText,InputNumber },
    computed: {
        ...mapGetters('course', ['selectedItem']),
        ...mapGetters('user', ['currentUser']),

        isSelectedItem: {
            get() : boolean {
                return this.selectedItem !== undefined;
            },
            set(value: boolean) {
                if (!value) {
                    this.unselectItem(); // Call the action to update the store when the sidebar is hidden
                }
            },
        },
    },

    data(){
        return {
            error: "",
        }
    },

    methods: {
        ...mapActions('course', ['unselectItem', 'createOrUpdateItem']),

        async handleSubmit(){
            try{
                const course = this.selectedItem as Course;
                
                if( ! isStringSet(course.name)){
                    this.error = "Name is required"
                    return;
                }

                if( ! isStringSet(course.abbrevation)){
                    this.error = "Abbrevation is required"
                    return;
                }

                this.error = ''

                //course.students = [];

                logger.debug("course to add: ", course)
                this.createOrUpdateItem(this.selectedItem)
                    //.then(() => this.$router.push(`courses/${selectedItemCache.id}/0`));
                this.$toast.add({ severity: 'success', summary: 'Course added', detail: 'Course added', life: 3000 });
            }
            catch{
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when adding course', life: 3000 });
            }
        },

        onShow() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add("overflow-hidden");
        },

        onHide() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove("overflow-hidden");
            this.unselectItem();
        }
    },
})
