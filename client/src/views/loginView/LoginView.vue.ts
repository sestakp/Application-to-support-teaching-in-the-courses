import { defineComponent } from 'vue';
import Button from 'primevue/button';
import type UserLogin from '@/models/User/UserLogin';
import type UserRegister from '@/models/User/UserRegister';
import { ToastMessageOptions } from 'primevue/toast';
import store from '@/store';
import { mapGetters } from 'vuex';
import CurrentUser from '@/models/User/CurrentUser';
import logger from '@/utils/loggerUtil';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';

export default defineComponent({
    components: { Button, InputText, Password },

    computed:{

        ...mapGetters('user', { currentUser: 'currentUser'}),
    },

    data() {
        return {
            isRegistering: false,
            loginModel: {} as UserLogin,
            registerModel: {} as UserRegister,
            passwordError: "",
            loading: false,
        };
    },

    watch: {
        currentUser: {
            handler(newValue: CurrentUser, oldValue: CurrentUser) {
                if (newValue) {
                    this.$router.push('/')
                }
            },
            immediate: true,
        },
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
        },
    },

    methods: {
        toggleRegistrationForm() {
            this.isRegistering = !this.isRegistering;
            this.loginModel = <UserLogin>{};
            this.registerModel = <UserRegister>{};
        },

        async onLogin() {
            
            try{
                this.loading = true
                const result = await store.dispatch("user/login", this.loginModel);
                if (result) {
                    this.$toast.add(<ToastMessageOptions>{severity: "info", detail: "Logged in", life: 5000});
                    await this.$router.push('courses');
                }
                else {
                    this.$toast.add(<ToastMessageOptions>{severity: "error", detail: "Invalid credentials", life: 5000});
                }
            }
            catch{
                this.$toast.add(<ToastMessageOptions>{severity: "error", detail: "Registration failed, maybe backend is down", life: 5000});
            }
            finally{
                this.loading = false
            }
        },

        async onRegister() {
            try{
                this.loading = true
                const result = await store.dispatch("user/register", this.registerModel);

                if (result) {
                    this.$toast.add(<ToastMessageOptions>{severity: "info", detail: "Registered", life: 5000});
                    this.isRegistering = false;
                }
                else {
                    this.$toast.add(<ToastMessageOptions>{severity: "error", detail: "Registration failed", life: 5000});
                }
            }
            catch{
                this.$toast.add(<ToastMessageOptions>{severity: "error", detail: "Registration failed, probably email is already registered", life: 5000});
            }
            finally {
                this.loading = false
            }
        },
    }
});
