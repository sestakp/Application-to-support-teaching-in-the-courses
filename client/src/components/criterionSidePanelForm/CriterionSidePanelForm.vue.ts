import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputNumber from 'primevue/inputnumber';
import Sidebar from 'primevue/sidebar';
import Dropdown from 'primevue/dropdown';
import { mapActions, mapGetters } from 'vuex';
import Criterion from '@/models/Criterion/Criterion';
import logger from '@/utils/loggerUtil';
import isStringSet from '@/utils/isStrSet';

export default defineComponent({
    name: "CriterionSidePanelForm",
    components: { Button, Sidebar, InputText, InputNumber,Textarea, Dropdown },

    computed: {
        
        ...mapGetters('criterion', { getCategories: 'getCategories', selectedCriterion: 'selectedItem' }),
        
        categories(): string[] { return this.getCategories(this.activityId) },


        isSelectedItem: {
            get() : boolean {
                return this.selectedCriterion !== undefined;
            },
            set(value: boolean) {
                if (!value) {
                    this.unselectItem(); // Call the action to update the store when the sidebar is hidden
                }
            },
        },
    },

    data(vm) {
        return {
            error: ""
        }
    },

    props: {
        activityId: { type: Number, require: true},
    },

    methods: {
        ...mapActions('criterion', ['unselectItem', 'createOrUpdateItem']),

        async handleSubmit(){
            //const selectedItemCache = this.selectedItem;
            try{
                const selectedCriterion = this.selectedCriterion as Criterion;
                if(this.activityId == undefined){
                    this.error = "Activity is not set"
                    return;
                }

                if( ! isStringSet(selectedCriterion.name)){
                    this.error = "Name is required"
                    return;
                }

                if( ! isStringSet(selectedCriterion.code)){
                    this.error = "Code is required"
                    return;
                }

                if( ! isStringSet(selectedCriterion.category)){
                    this.error = "Category is required"
                    return;
                }

                if( ! isStringSet(selectedCriterion.assessmentMethod)){
                    this.error = "Assessment method is required"
                    return;
                }

                this.error = ""


                selectedCriterion.activityId = this.activityId;


                this.createOrUpdateItem(selectedCriterion)
                    //.then(() => this.$router.push(`courses/${selectedItemCache.id}`));
                this.$toast.add({ severity: 'success', summary: 'Criterion added', detail: 'Criterion added', life: 3000 });
            }
            catch{
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when adding criterion', life: 3000 });
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
