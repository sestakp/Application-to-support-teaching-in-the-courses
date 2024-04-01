import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputSwitch from 'primevue/inputswitch';
import EmailTemplateEditor from '@/components/EmailTemplateEditor.vue'
import Sidebar from 'primevue/sidebar';
import Activity from '@/models/Activity/Activity';
import { mapActions, mapGetters } from 'vuex';
import logger from '@/utils/loggerUtil';
import isStringSet from '@/utils/isStrSet';

export default defineComponent({
    name: "ActivitySidePanelForm",
    components: { Button, Sidebar, InputText, InputSwitch,EmailTemplateEditor },

    computed: {
        ...mapGetters('activity', ['selectedItem']),

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

    data() {
        return {
            error: ""
        }
    },

    props:{
        courseId: { type: Number, required: true }
    },

    methods: {
        ...mapActions('activity', ['unselectItem', 'createOrUpdateItem']),

        async handleSubmit(){
            const selectedItemCache = this.selectedItem as Activity;
            
            selectedItemCache.courseId = this.courseId

            if( ! isStringSet(selectedItemCache.name)){
                this.error = "Name is required"
                return;
            }

            this.error = ''

            logger.debug("creating or updating activity: ", selectedItemCache)
            this.createOrUpdateItem(selectedItemCache)
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
        },

        updateActivity(activity:Activity) {
            this.selectedItem = activity;
        }
    },
})
