import { defineComponent } from 'vue';
import { mapActions, mapGetters } from 'vuex';

export default defineComponent({
    name: 'NavbarComponent',

    computed: {
        ...mapGetters('user', ['currentUser', 'isLogged']),
    },
    data() {
        return {};
    },

    methods: {
        ...mapActions('user', ['logout'])
    },
})
