import Student from "@/models/Student/Student";
import Button from "primevue/button";
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
    name: "StudentCard",
    components: { Button },

    props: {
        student: { type: Object as () => Student, required: true },
        isEditable: { type: Boolean, required: false, default: false }
    },

    methods: {
        ...mapActions("student", ["selectItem", "deleteItem"]),

        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete student ${this.student.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteItem(this.student.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Student deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting a student', life: 3000 });
                    }
                }
            });
        },
    }
})
