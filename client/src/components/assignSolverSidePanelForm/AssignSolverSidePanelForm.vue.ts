import { defineComponent } from 'vue';
import Button from 'primevue/button';
import Sidebar from 'primevue/sidebar';
import { mapActions, mapGetters } from 'vuex';
import Dropdown from 'primevue/dropdown';
import logger from '@/utils/loggerUtil';
import store from '@/store';
import User from '@/models/User/User';
import Course from '@/models/Course/Course';

interface assignSolverSidePanelFormDataInterface{
    selectedSolver?: User,
    loading: boolean
}

export default defineComponent({
    name: "AssignSolverSidePanelForm",
    components: { Button, Sidebar, Dropdown },
    data():assignSolverSidePanelFormDataInterface{
        return {
            selectedSolver: undefined,
            loading: false,
        }
    },

    props:{
        course: {type: Object as () => Course, require: true},
        open: {type: Boolean, require: true},
        toggle: {type: Function, require: true},
    },

    created() {
        // Call the Vuex action to fetch data
        // Use Promise.all to wait for both actions to complete
        Promise.all([this.fetchUsers()])
            .then(() => {
                this.loading = false;
            })
            .catch((error) => {
                logger.error('Error fetching data:', error);
                this.loading = false;
            });
    },

    computed: {
        ...mapGetters('user', {allUsers: 'allItems'}),
        users(): User[] { 
            return this.allUsers?.filter((u: User) => !(u.privilegedCourses?.includes(this.course?.id ?? -1) || this.course?.guarantorId == u.id))
        },

        isOpen: {
            get() : boolean {
                return this.open;
            },
            set(value: boolean) {
                if (!value) {
                    if(this.toggle){
                        this.toggle(); // Call the action to update the store when the sidebar is hidden
                    }
                }
            },
        },
    },

    methods: {
        ...mapActions('user', {createOrUpdateUser: 'createOrUpdateItem'}),

        async handleSubmit(){
            try{

                if(this.selectedSolver && this.course?.id){   
                    this.selectedSolver.privilegedCourses.push(this.course?.id)
                    
                    this.createOrUpdateUser(this.selectedSolver)
                    if(this.toggle){
                        this.toggle()
                    }
                }
                this.$toast.add({ severity: 'success', summary: 'Solver added', detail: 'Solver added', life: 3000 });
            }
            catch{
                
                this.$toast.add({ severity: 'error', summary: 'Error', detail: 'Error when adding solver', life: 3000 });
            }

        },

        onShow() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.add("overflow-hidden");
            if (!this.loading) this.fetchUsers();
        },

        onHide() {
            const body = document.getElementsByTagName('body')[0];
            body.classList.remove("overflow-hidden");
        },

        async fetchUsers() {
            return await store.dispatch('user/fetchItems');
        }
    },
})
