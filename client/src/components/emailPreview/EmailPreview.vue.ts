import { defineComponent } from "vue";
import Activity from "@/models/Activity/Activity";
import Criterion from "@/models/Criterion/Criterion";
import { mapGetters } from "vuex";
import logger from "@/utils/loggerUtil";
import store from "@/store";
import Aassessment from "@/models/Aassessment/Aassessment";
import Student from "@/models/Student/Student";
import Team from "@/models/Team/Team";
import Textarea from 'primevue/textarea';
import emailTranslate from "@/utils/emailTranslate";

export default defineComponent({
    name: "emailPreview",
    
    components: { Textarea },

    data() {
        return {
            loading: false,
            translatedEmail: ""
        }
    },

    props: {
        activityId: {type: Number, require: true},
    },
    
    mounted() {
        //this.updateMarkerSuggestions();
        
        this.translatedEmail = emailTranslate(this.activity?.emailTemplate ?? "", this.categories, this.allCriterias, this.allAassessments, this.selectedStudent, this.selectedTeam)
    },


    watch: {
        activity: {
            handler(newValue: Activity, oldValue: Activity) {
                if(newValue.emailTemplate){
                    this.translatedEmail = emailTranslate(newValue.emailTemplate, this.categories, this.allCriterias, this.allAassessments, this.selectedStudent, this.selectedTeam)
                }
            },
            deep: true,
        },
        selectedStudent: {
            handler(newValue: Student, oldValue: Student) {
                if(newValue){
                    
                    this.translatedEmail = emailTranslate(this.activity?.emailTemplate ?? "", this.categories, this.allCriterias, this.allAassessments, newValue, this.selectedTeam)
                }
            },
            deep: true,
        },
        selectedTeam: {
            handler(newValue: Team, oldValue: Team) {
                if(newValue){
                    logger.debug("selected team")
                    this.translatedEmail = emailTranslate(this.activity?.emailTemplate ?? "", this.categories, this.allCriterias, this.allAassessments, this.selectedStudent, newValue)
                }
            },
            deep: true,
        },
    },
    
    computed: {

        ...mapGetters('criterion', { allCriterias: 'allItems',  getCategories: 'getCategories' }),
        ...mapGetters('aassessment', { allAassessments: 'allItems' }),
        ...mapGetters('student', { selectedStudent: 'selectedItem' }),
        ...mapGetters('team', { selectedTeam: "selectedItem" }),
        ...mapGetters('activity', { getActivityById: "getItemById" }),

        activity(): Activity { return this.getActivityById(this.activityId)},

        categories(): string[] { return this.getCategories(this.activityId) }
    },

    created() {
        Promise.all([this.fetchActivity(), this.fetchActivityCriteria(), this.fetchAassessmentsByActivity()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                this.loading = false;
            });
    },

    methods: {
        
        async fetchActivity() {
            await store.dispatch("activity/fetchItem", this.activityId);
        },
        async fetchActivityCriteria() {
            await store.dispatch("criterion/fetchActivityCriteria", this.activityId);
        },

        async fetchAassessmentsByActivity(){
            await store.dispatch("aassessment/fetchAassessmentsByActivity", this.activityId)
        },
    }
})