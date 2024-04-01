import { defineComponent } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Sidebar from 'primevue/sidebar';
import Calendar from 'primevue/calendar';
import { mapActions, mapGetters } from 'vuex';
import Task from '@/models/Task/Task';
import Dropdown from 'primevue/dropdown';
import Activity from '@/models/Activity/Activity';
import logger from '@/utils/loggerUtil';
import store from '@/store';
import LoadingBadger from '@/components/LoadingBadger.vue';
import Type from '@/models/Type/Type';
import isStringSet from '@/utils/isStrSet';
import Textarea from 'primevue/textarea';

export default defineComponent({
    name: "TaskSidePanelForm",
    components: { Button, Sidebar, InputNumber, InputText, Calendar, LoadingBadger, Dropdown, Textarea },

    props: {
        courseId: { type: Number, required: true }
    },
    data() {
        return {
            loading: true,
            freshOpen: true,
            type: "" as string | Type,
            activity: undefined as Activity | undefined,
            dates: undefined as Date[] | undefined,
            dateFormat: "dd.mm.yy",
            isDuplicate: false,
            categories: [] as string[],
            errorMessage: ""
        };
    },
    computed: {
        ...mapGetters('task', {selectedItem: 'selectedItem', allTasks: 'allItems'}),
        ...mapGetters('type', {types: 'allItems'}),
        ...mapGetters('criterion', { getCategories: 'getCategories'}),
        ...mapGetters('activity', {activities: 'allItems', getActivityById: 'getItemById'}),

        isSelectedItem: {
            get() : boolean {
                return this.selectedItem !== undefined;
            },
            set(value: boolean) {
                if (!value) {
                    this.onHide()
                }
            },
        },
    },
    watch: {
        selectedItem: {
            handler(newValue: Task, oldValue: Task) {
                logger.debug("newValue: ", newValue, "OldValue: ", oldValue)
                if (newValue) {
                    this.type = this.types.find((t: Type) => t.id == this.selectedItem.typeId || ( this.type instanceof Object && t.id == this.type?.id)) ?? ""
                    
                    if (this.selectedItem.start != undefined && this.selectedItem.end != undefined) {
                        this.dates = [new Date(this.selectedItem.start), new Date(this.selectedItem.end)]
                    }
                    else if (this.dates != undefined && this.dates.length < 2) {
                        this.dates = undefined
                    }
                    
                    if (newValue?.activityId != oldValue?.activityId) {
                        this.activity = {...this.getActivityById(this.selectedItem.activityId)};
                        this.fetchActivityCriteriaAndSetCategories(newValue.activityId);
                    }
                    
                    this.isDuplicate = this.allTasks.some((t: Task) => t.order == newValue.order && t.id != newValue.id) || newValue.order < 0;
                    
                    if(this.isDuplicate || this.selectedItem.order === undefined){
                        const max = Math.max(...this.allTasks.map((t: Task) => t.order));
                        this.selectedItem.order = max < 0 ? 1 : max + 1;
                    }
                    
                }
            },
            deep: true
        },

        activity: {
            handler(newValue: Task, oldValue: Task) {
                if (newValue) {
                    if( newValue?.id != oldValue?.id) {    
                        this.fetchActivityCriteriaAndSetCategories(newValue.id);
                    }

                    if (!this.freshOpen) {
                            this.selectedItem.criteriaCategory = undefined;
                    }
                        
                    this.freshOpen = false;
                }
            },
        }
    },
    
    created() {
        Promise.all([this.fetchCourseTypes()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    methods: {
        ...mapActions('task', { unselectTask: 'unselectItem', createOrUpdateTask: 'createOrUpdateItem'}),
        ...mapActions('type', { createOrUpdateType: 'createOrUpdateItem'}),

        async fetchCourseTypes() {
            await store.dispatch("type/fetchCourseTypes", this.courseId);
        },

        async fetchActivityCriteriaAndSetCategories(activityId:number) {
            await store.dispatch("criterion/fetchActivityCriteria", activityId);
            this.categories = this.getCategories(activityId);
            
        },

        onShow() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add("overflow-hidden");
        },

        onHide() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove("overflow-hidden");
            this.dates = []
            this.unselectTask()     
            this.freshOpen = true
        },

        async handleSubmit() {
            try{
            const selectedItemCache = this.selectedItem as Task;
            logger.debug("selected task: ", selectedItemCache);


            if (this.dates == undefined || this.dates?.length < 2) {
                
                this.errorMessage = "It is necessary to enter both dates"
                return;
            }

            if (this.isDuplicate) {
                this.errorMessage = "A record with the same order already exists"
                return;
            }

            if( selectedItemCache.order == undefined){
                this.errorMessage = "Order is required"
                return;
            }

            if( ! isStringSet(selectedItemCache.name)){
                this.errorMessage = "Name is required"
                return;
            }

            if(typeof this.type === "string" && ! isStringSet(this.type)){
                this.errorMessage = "Type is required"
                return;
            }


            
            this.errorMessage = ""

            selectedItemCache.start = this.dates[0]
            selectedItemCache.end = this.dates[1]
            if (this.activity != undefined) {
                selectedItemCache.activityId = this.activity?.id;
                this.activity = undefined;
            }
            this.dates = undefined;
            selectedItemCache.courseId = this.courseId;
            
            if (typeof this.type === "string" && (this.types as Type[]).find((t: Type) => t.name === this.type) === undefined) {
                const type = {} as Type;
                type.courseId = this.courseId;
                type.name = this.type;
                this.type = await this.createOrUpdateType(type);
            }
            
            if (typeof this.type === 'object' && 'id' in this.type) {
                selectedItemCache.typeId = (this.type as Type).id;
            }
            this.type = "";

            this.createOrUpdateTask(this.selectedItem)
                //.then(() => this.$router.push(`courses/${selectedItemCache.id}`));
                
                this.$toast.add({ severity: 'success', summary: 'Task added', detail: 'Task added', life: 3000 });
            }
            catch{
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when adding task', life: 3000 });

            }
        }
    },
})
