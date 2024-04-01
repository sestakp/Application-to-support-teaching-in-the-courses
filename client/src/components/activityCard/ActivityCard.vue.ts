import Activity from '@/models/Activity/Activity';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
    name: "ActivityCard",
    components: { Card, Button },

    computed: {
        activityTypeString() { return this.activity.teamBased ? "Team based" : "Individual" }
    },
    props: {
        activity: { type: Object as () => Activity, required: true }
    },
    
    methods: {
        ...mapActions('activity', ['selectItem', 'deleteItem']),

        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete activity ${this.activity.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteItem(this.activity.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Activity deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting an activity', life: 3000 });
                    }
                }
            });
        },
    }
})
