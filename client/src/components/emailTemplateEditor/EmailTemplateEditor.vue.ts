import Activity from "@/models/Activity/Activity";
import logger from "@/utils/loggerUtil";
import { defineComponent } from "vue";
import { mapGetters, mapActions } from 'vuex';
import Textarea from 'primevue/textarea';
import store from "@/store";
import Criterion from "@/models/Criterion/Criterion";

interface EmailTemplateEditorData {
    contextMenuIndex: number,
    contextMenuTop: number,
    contextMenuLeft: number,
    contextMenuMarkers: string[],
    showSuggestions: boolean,
    afterInsert: boolean,
    availableMarkers: string[],
}

export default defineComponent({
    name: "EmailTemplateEditor",
    components: { Textarea },
    
    props: {
        activityProp: { type: Object as () => Activity, required: true },
        updateActivity: { type: Function, required: true}
    },

    watch: {
        allCriterias: function (newValue: Criterion[], oldValue: Criterion[]) {
                if (newValue) {
                    this.availableMarkers = newValue.map(c => '{' + c.category + '.' + c.code + '}')
                }
            }
    },

    data():EmailTemplateEditorData {
        return {
            contextMenuIndex: 0,
            contextMenuTop: 0,
            contextMenuLeft: 0,
            contextMenuMarkers: [],
            showSuggestions: false,
            afterInsert: false,
            availableMarkers: ['{criterion.cleanCode}', '{criterion.wellDocumented}', '{criterion.meetsRequirements}'],
        };
    },

    computed: {
        
        ...mapGetters('criterion', { allCriterias: 'allItems', getCategories: 'getCategories' }),
        activity: {
            get() {
              return this.activityProp;
            },
            set(value: Activity) {
              this.updateActivity(value)
            },
          },
    },

    mounted() {
        //this.updateMarkerSuggestions();
    },
    created() {
        Promise.all([this.fetchActivityCriteria()])
            .then(() => {
                //this.loading = false;
            })
            .catch((error) => {
                logger.error("Error fetching data:", error);
                //this.loading = false;
            });
    },

    methods: {
        
        updateMarkerSuggestions() {
            const textArea = this.$refs.templateTextarea as HTMLTextAreaElement
            const cursorPosition = textArea.selectionStart;
            const lastCurlyBraceIndex = this.activity.emailTemplate.lastIndexOf('{', cursorPosition - 1);
            const currentText = this.activity.emailTemplate.substring(lastCurlyBraceIndex + 1, cursorPosition);

            if (lastCurlyBraceIndex < 0 || this.afterInsert) {
                this.contextMenuMarkers = []
                this.showSuggestions = false
                this.afterInsert = false
                return;
            }

            this.afterInsert = false
            const lineNumber = this.activity.emailTemplate.substring(0, cursorPosition).split('\n').length
            //logger.debug("line number: ", lineNumber)
            //logger.debug("top: ", 20 * lineNumber)
            this.contextMenuTop = 10 + (16*lineNumber)

            if(lineNumber > 25){
                this.contextMenuTop = 10 + (16*25)
            }

            const lastNewlineIndex = this.activity.emailTemplate.lastIndexOf('\n', cursorPosition - 1);
            const charsFromLastNewline = cursorPosition - (lastNewlineIndex + 1);
            //logger.debug("left: ", charsFromLastNewline)
            this.contextMenuLeft = charsFromLastNewline * 5;


            // Filter available markers based on current text
            const filteredMarkers = this.availableMarkers.filter(marker => marker.includes(currentText));

            // Set context menu markers
            this.contextMenuMarkers = filteredMarkers;
            this.contextMenuIndex = 0;
            this.showSuggestions = filteredMarkers.length > 0;
        },

        handleUp(event: Event) {
            if(this.showSuggestions){
                this.contextMenuIndex = Math.max(0, this.contextMenuIndex - 1)
                event.stopPropagation();
                event.preventDefault();
            }
        },

        handleDown(event: Event) {
            if(this.showSuggestions){
                this.contextMenuIndex = Math.min(this.availableMarkers.length-1, this.contextMenuIndex + 1)
                event.stopPropagation();
                event.preventDefault();
            }
        },

        handleEnter(event: Event) {
            if(this.showSuggestions){
                this.insertMarker(this.contextMenuMarkers[this.contextMenuIndex])
                event.preventDefault()
                event.stopPropagation()
            }
        },

        insertMarker(marker:string) {
            const textArea = this.$refs.templateTextarea as HTMLTextAreaElement
            const cursorPosition = textArea.selectionStart;

            // Find the last curly brace
            let lastCurlyBraceIndex = this.activity.emailTemplate.lastIndexOf('{', cursorPosition - 1);
            if (lastCurlyBraceIndex === -1) {
                lastCurlyBraceIndex = this.activity.emailTemplate.lastIndexOf('{');
            }

            // Calculate the offset relative to the last curly brace
            const offset = cursorPosition - lastCurlyBraceIndex - 1;

            // Update the content
            const updatedContent = this.activity.emailTemplate.substring(0, lastCurlyBraceIndex) + marker + this.activity.emailTemplate.substring(cursorPosition);
            
            this.activity.emailTemplate = updatedContent;

            // Maintain the cursor position relative to the updated content
            const newCursorPosition = cursorPosition + marker.length - offset;
            textArea.focus()
            textArea.setSelectionRange(newCursorPosition,newCursorPosition);

            logger.debug('New cursor:', textArea.selectionStart);
            this.afterInsert = true;
            this.updateMarkerSuggestions();
        },

        
        async fetchActivityCriteria() {
            await store.dispatch("criterion/fetchActivityCriteria", this.activity.id);
        },

    },
})
