export default {
  template: '#userProductModal',
  data() {
    return {
      modal: {},
      qty: 1
    }
  },
  props: ['product'],
  methods: {
    showModal() {
      this.modal.show();
    },
    hideModal() {
      this.modal.hide();
    }
  },
  mounted() {
    this.modal = new bootstrap.Modal(this.$refs.modal);
  }
};