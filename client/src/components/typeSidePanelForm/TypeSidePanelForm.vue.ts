import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Sidebar from 'primevue/sidebar';
import { mapActions, mapGetters } from 'vuex';
import Type from '@/models/Type/Type';
import isStringSet from '@/utils/isStrSet';
import logger from '@/utils/loggerUtil';

export default defineComponent({
    name: "TypeSidePanelForm",
    components: { Button, Sidebar, InputText },

    computed: {
        ...mapGetters('type', ['selectedItem']),

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

    props:{
        courseId: { type: Number, required: true }
    },

    data() {
        return {
            error: ""
        }
    },

    methods: {
        ...mapActions('type', ['unselectItem', 'createOrUpdateItem']),

        async handleSubmit() {
            try{

                const type = this.selectedItem as Type;
                type.courseId = this.courseId;
    
                if (!isStringSet(type.name)) {
                    this.error = "Name is required";
                    return;
                }
    
                this.error = "";
    
                logger.debug("type to add: ", type)
                this.createOrUpdateItem(this.selectedItem)
                this.$toast.add({ severity: 'success', summary: this.selectedItem.id == undefined ? 'Created' :'Edited', detail: 'Type ' + this.selectedItem.id == undefined ? 'created' :'edited', life: 3000 });
            }
            catch{
                this.$toast.add({ severity: 'error', summary: "Error", detail: 'Type is not '+ this.selectedItem.id == undefined ? 'created' :'edited', life: 3000 });
            }
                //.then(() => this.$router.push(`courses/${selectedItemCache.id}`));
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
