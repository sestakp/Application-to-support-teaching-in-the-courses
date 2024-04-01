import Student from "@/models/Student/Student";
import Button from "primevue/button";
import { defineComponent } from "vue";
import { mapActions } from "vuex";

export default defineComponent({
    name: "StudentCard",
    components: { Button },

    props: {
        student: { type: Object as () => Student, required: true },
        isAssessed: { type: Boolean, required: true },
        studentPoints: { type: Number, required: false },
        maxPoints: { type: Number, required: false }
    },

    methods: {
        ...mapActions("student", ["selectItem", "deleteItem"])
    }
})
