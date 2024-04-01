import Type from '@/models/Type/Type'
import Button from 'primevue/button';
import { defineComponent } from 'vue';
import { mapActions } from 'vuex';

export default defineComponent({
    name: "TypeCard",
    components: { Button },

    props: {
        type: { type: Object as () => Type, required: true }
    },
    
    methods: {
        ...mapActions('type', ['selectItem', 'deleteItem']),

        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete type ${this.type.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteItem(this.type.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Type deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting a type', life: 3000 });
                    }
                }
            });
        },
    }
})
