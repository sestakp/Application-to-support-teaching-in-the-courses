import Task from '@/models/Task/Task'
import Button from 'primevue/button';
import Card from 'primevue/card';
import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';
import formatDate from '@/utils/formatDate';
import Divider from 'primevue/divider';
import Activity from '@/models/Activity/Activity';
import Type from '@/models/Type/Type';
import User from '@/models/User/User';
import logger from '@/utils/loggerUtil';
import store from '@/store';
import LoadingBadger from "@/components/LoadingBadger.vue";

export default defineComponent({
    name: "TaskCard",
    components: { Card, Button, Divider, LoadingBadger },

    data() {
        return {
            loading: true
        }
    },

    props: {
        task: { type: Object as () => Task, required: true }
    },

    computed: {
        ...mapGetters('activity', {getActivityById: 'getItemById'}),
        ...mapGetters('type', {getTypeById: 'getItemById'}),
        ...mapGetters('user', {getUserById: 'getItemById'}),

        activity(): Activity { return this.getActivityById(this.task.activityId)},
        type(): Type { return this.getTypeById(this.task.typeId)},
        user(): User { return this.getUserById(this.task?.responsibleUserId)}
    },

    created() {
        Promise.all([this.fetchActivity(), this.fetchType(), this.fetchUser()])
            .then(() => {
                logger.debug(this.activity);
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    
    methods: {
        ...mapActions('task', ['selectItem', 'deleteItem']),
        formatDate,

        openDeleteDialog(){
            this.$confirm.require({
                message: 'Do you want to delete this record?',
                header: `Do you want to delete task ${this.task.name}?`,
                icon: 'pi pi-info-circle',
                rejectClass: 'p-button-text p-button-text',
                acceptClass: 'p-button-danger p-button-text',
                accept: () => {
                    try{
                        this.deleteItem(this.task.id)
                        this.$toast.add({ severity: 'success', summary: 'Deleted', detail: 'Task deleted', life: 3000 });
                    }
                    catch{
                        this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when deleting a task', life: 3000 });
                    }
                }
            });
        },

        async fetchActivity() {
            await store.dispatch("activity/fetchItem", this.task.activityId);
        },
        async fetchType() {
            await store.dispatch("type/fetchItem", this.task.typeId);
        },
        async fetchUser() {
            if (this.task?.responsibleUserId) {
                await store.dispatch("user/fetchItem", this.task?.responsibleUserId);
            }
        }
    }
});
