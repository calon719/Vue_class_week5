import api from './customer-api.js';
import productModal from './user-productModal.js';

const { Form, Field, ErrorMessage, defineRule, configure } = VeeValidate;

defineRule('email', VeeValidateRules['email']);
defineRule('required', VeeValidateRules['required']);
defineRule('min', VeeValidateRules['min']);

VeeValidateI18n.loadLocaleFromURL('./../zh_TW.json');

configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true,
});

const app = Vue.createApp({
  data() {
    return {
      productsData: [],
      pagination: {},
      cartData: [],
      product: {},
      orderForm: {
        user: {
          name: '',
          email: '',
          tel: '',
          address: '',
        },
        message: '',
      },
      isLoadingBtn: {
        id: '',
        status: '',
      },
      isLoading: false,
      resetQty: 1
    }
  },
  components: {
    productModal,
    VForm: Form,
    VField: Field,
    ErrorMessage
  },
  methods: {
    getProductsData() {
      this.isLoading = true;
      axios.get(`${api.baseUrl}/${api.getProducts_path}`)
        .then(res => {
          const { products, pagination } = res.data;
          this.productsData = products;
          this.pagination = pagination;
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoading = false;
        });
    },
    getCartData() {
      axios.get(`${api.baseUrl}/${api.cart_path}`)
        .then(res => {
          this.cartData = res.data.data;
        }).catch(err => {
          console.dir(err);
        });
    },
    getProductData(id) {
      this.isLoadingBtn.status = 'detail';
      this.isLoadingBtn.id = id;
      axios.get(`${api.baseUrl}/${api.getProduct_path}/${id}`)
        .then(res => {
          this.product = res.data.product;
          this.$refs.userProductModal.showModal();
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoadingBtn = {
            id: '',
            status: '',
          };
        });
    },
    addCart(id, qty = 1) {
      this.isLoadingBtn.status = 'addCart';
      this.isLoadingBtn.id = id;
      let cart = {
        data: {
          product_id: id,
          qty
        }
      };
      const product = this.cartData.carts.find(item => item.product_id === id);

      if (product) {
        cart.qty = qty + product.qty;
      };
      axios.post(`${api.baseUrl}/${api.cart_path}`, cart)
        .then(res => {
          this.getCartData();
          this.$refs.userProductModal.hideModal();
          alert(res.data.message);
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoadingBtn = {
            id: '',
            status: '',
          };
        });
    },
    delAllCarts() {
      this.isLoadingBtn.status = 'delCart';
      axios.delete(`${api.baseUrl}/${api.delAllCart_path}`)
        .then(res => {
          this.getCartData();
          alert(res.data.message);
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoadingBtn.status = '';
        });
    },
    delProduct(id) {
      this.isLoadingBtn.id = id;
      this.isLoadingBtn.status = 'delProduct';
      axios.delete(`${api.baseUrl}/${api.cart_path}/${id}`)
        .then(res => {
          this.getCartData();
          alert(res.data.message);
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoadingBtn = {
            id: '',
            status: '',
          };
        });
    },
    updateCart(e, product) {
      const cart = {
        data: {
          product_id: product.product_id,
          qty: parseInt(e.target.value)
        }
      };
      axios.put(`${api.baseUrl}/${api.cart_path}/${product.id}`, cart)
        .then(res => {
          alert(res.data.message);
          this.getCartData();
        }).catch(err => {
          console.dir(err);
        });
    },
    createOrder() {
      this.isLoading = true;
      axios.post(`${api.baseUrl}/${api.order_path}`, { data: this.orderForm })
        .then(res => {
          this.$refs.form.resetForm();
          this.getCartData();
          alert(res.data.message);
        }).catch(err => {
          console.dir(err);
        }).then(() => {
          this.isLoading = false;
        });
    }
  },
  mounted() {
    this.getProductsData();
    this.getCartData();
  }
});

app.component('loading', VueLoading.Component);

app.mount('#app');