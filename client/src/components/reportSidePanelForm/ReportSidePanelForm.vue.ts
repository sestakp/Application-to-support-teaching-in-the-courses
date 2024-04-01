import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Sidebar from 'primevue/sidebar';
import Activity from '@/models/Activity/Activity';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import { mapActions, mapGetters } from 'vuex';
import Report from '@/models/Report/Report';
import isValidRatio from '@/utils/isValidRation';
import logger from '@/utils/loggerUtil';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';

export default defineComponent({
    name: "ReportSidePanelForm",
    components: { Button, Sidebar, InputText, Dropdown, Textarea, InputMask, InputNumber },
    props: {
        taskId: { type: Number, require: true },
        time: { type: String, require: true },
        aassessedUnits: { type: Number, require: true },
        teamBased: { type: Boolean, require: true },
        resetCounters: { type: Function, require: true },
    },

    data(vm) {
        return {
            hoursError: '',
            descriptionError: '',
        }
    },

    computed: {
        ...mapGetters('report', ['selectedItem']),
        ...mapGetters('user', ['currentUser']),

        isError() { return this.hoursError != '' || this.descriptionError != '' },

        isSelectedItem: {
            get(): boolean {
                return this.selectedItem !== undefined;
            },
            set(value: boolean) {
                if (!value) {
                    this.unselectItem(); // Call the action to update the store when the sidebar is hidden
                }
            },
        },
    },

    watch: {
        selectedItem: {
            handler(newValue: Report, oldValue: Report) {

                if(newValue){
                    this.valid()
                }                

            },
            deep:true
        },

    },

    methods: {
        ...mapActions('report', ['unselectItem', 'createOrUpdateItem']),

        async handleSubmit() {
            //const selectedItemCache = this.selectedItem;
            try{
                if ( ! this.valid()) {
                    return
                }
    
    
                this.selectedItem.userId = this.currentUser?.id;
                this.selectedItem.taskId = this.taskId;
    
                if(this.selectedItem.hours == '00:00:00'){
                    this.hoursError = 'Hours must be set'
                    return;
                }
                else{
                    this.hoursError = ''
                }
    
                this.createOrUpdateItem(this.selectedItem);
    
                if (this.resetCounters) {
                    this.resetCounters();
                }
                this.$toast.add({ severity: 'success', summary: 'Report added', detail: 'Report added', life: 3000 });
            }
            catch{
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when adding report', life: 3000 });

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
        },


        valid(){

            const timePattern = /^[0-9][0-9]?[0-9]?:[0-5][0-9]:[0-5][0-9]$/;

            if (!timePattern.test(this.selectedItem.hours.trim())) {
                logger.debug("time pattern not match")
                this.hoursError = 'Hours spent must be entered in hhh:mm:ss format.'
                return false
            }
            else {
                this.hoursError = ''
            }


            if(this.selectedItem.description == undefined || this.selectedItem.description == ''){
                this.descriptionError = "Description must be set"
                return false
            }
            else{
                this.descriptionError = ''
            }
            return true;
        },


        updateActivity(activity: Activity) {
            this.selectedItem = activity;
        },
    },
})
