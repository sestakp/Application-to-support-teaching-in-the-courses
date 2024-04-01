import Criterion from '@/models/Criterion/Criterion';
import Button from 'primevue/button';
import Card from 'primevue/card';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
    name: "ActivityCard",
    components: { Card, Button },

    props: {
        criterion: { type: Object as () => Criterion, required: true }
    },
    
    methods: {
        ...mapActions('criterion', ['selectItem', 'deleteItem']),

        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete criterion ${this.criterion.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteItem(this.criterion.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Criterion deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting a criterion', life: 3000 });
                    }
                }
            });
        },
    }
})
