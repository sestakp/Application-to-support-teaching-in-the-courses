import { defineComponent } from 'vue';
import Button from 'primevue/button';
import type UserRegister from '@/models/User/UserRegister';
import { ToastMessageOptions } from 'primevue/toast';
import store from '@/store';
import { mapGetters } from 'vuex';
import logger from '@/utils/loggerUtil';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import CurrentUser from '@/models/User/CurrentUser';

export default defineComponent({
    name: "UserProfileView",
    components: { Button, InputText, Password },

    computed: {
        ...mapGetters('user', { currentUser: 'currentUser' }),
    },

    data() {
        return {
            registerModel: {} as UserRegister,
            passwordError: "",
            loading: false,
        };
    },

    created() {
        this.registerModel.name = this.currentUser.name;
        this.registerModel.email = this.currentUser.email;
    },

    watch: {
        registerModel: {
            handler(newValue: UserRegister, oldValue: UserRegister) {
                if(newValue.password !== '' && newValue.passwordConfirm !== ''){
                    if(newValue.password !== newValue.passwordConfirm){
                        this.passwordError = "Passwords don't match!"
                        return;
                    }
                }
                this.passwordError = "";
            },
            deep: true,
        }
    },

    methods: {
        async onUpdate() {
            try {
                this.loading = true;
                const result = await store.dispatch("user/updateItem", this.registerModel);

                if (result) {
                    this.$toast.add(<ToastMessageOptions>{severity: "info", detail: "User updated", life: 5000});
                }
                else {
                    this.$toast.add(<ToastMessageOptions>{severity: "error", detail: "User update failed", life: 5000});
                }
            }
            catch {
                this.$toast.add(<ToastMessageOptions>{severity: "error", detail: "User update failed", life: 5000});
            }
            finally {
                this.loading = false
            }
        }
    }
});
