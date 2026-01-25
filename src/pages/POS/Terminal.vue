  <template>
    <q-page class="row items-stretch window-height-minus-header bg-grey-2">

      <div class="col-12 col-md-4 bg-white column shadow-1 z-top">

        <div class="q-pa-md border-bottom bg-grey-1">
          <q-select
            outlined
            dense
            v-model="customer"
            :options="['Walk-in Customer', 'VIP Member', 'Regular Customer']"
            label="Select Customer"
          >
            <template v-slot:prepend><q-icon name="person" /></template>
          </q-select>
        </div>

        <q-scroll-area class="col q-pa-md">
          <div v-if="cart.length === 0" class="column flex-center full-height text-grey-5">
            <q-icon name="shopping_cart" size="64px" />
            <div class="text-subtitle1 q-mt-sm">Cart is empty</div>
          </div>

          <q-list separator v-else>
            <q-item v-for="(item, i) in cart" :key="i">
              <q-item-section>
                <div class="text-weight-bold">{{ item.name }}</div>
                <div class="text-caption">${{ item.price.toFixed(2) }} x {{ item.qty }}</div>
              </q-item-section>

              <q-item-section side>
                <div class="row items-center bg-grey-2 rounded-borders">
                  <q-btn flat dense round icon="remove" size="sm" @click="item.qty > 1 ? item.qty-- : removeFromCart(i)" />
                  <span class="q-px-sm text-weight-bold">{{ item.qty }}</span>
                  <q-btn flat dense round icon="add" size="sm" @click="item.qty++" />
                </div>
              </q-item-section>

              <q-item-section side>
                <div class="text-weight-bold">${{ (item.price * item.qty).toFixed(2) }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <div class="q-pa-md bg-grey-1 border-top">
          <div class="row justify-between q-mb-xs text-grey-7">
            <span>Subtotal</span>
            <span>${{ subtotal }}</span>
          </div>
          <div class="row justify-between q-mb-md text-grey-7">
            <span>Tax (5%)</span>
            <span>${{ tax }}</span>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-btn
                outline
                color="orange-9"
                label="Hold Order"
                icon="pause_circle"
                class="full-width"
                :disable="cart.length === 0"
                @click="holdOrder"
              />
            </div>

            <div class="col-6">
              <q-btn
                color="red-5"
                flat
                label="Clear Cart"
                icon="delete_sweep"
                class="full-width"
                @click="confirmClear"
              />
            </div>

            <div class="col-12">
              <q-btn
                color="green-7"
                class="full-width text-weight-bold"
                size="lg"
                :label="`PAY $${total}`"
                icon="payments"
                :disable="cart.length === 0"
                @click="processPayment"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-md-8 column">

        <div class="q-pa-md bg-white border-bottom">
          <div class="row q-col-gutter-sm">
            <div class="col">
              <q-input outlined dense v-model="search" placeholder="Search products..." autofocus>
                <template v-slot:prepend><q-icon name="search" /></template>
              </q-input>
            </div>
            <div class="col-auto">
              <q-btn-dropdown outline label="All Categories" color="primary" icon="category">
                <q-list>
                  <q-item clickable v-close-popup @click="filter = ''"><q-item-section>All Products</q-item-section></q-item>
                  <q-item clickable v-close-popup @click="filter = 'Food'"><q-item-section>Food</q-item-section></q-item>
                  <q-item clickable v-close-popup @click="filter = 'Drink'"><q-item-section>Drinks</q-item-section></q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </div>
        </div>

        <q-scroll-area class="col q-pa-md">
          <div class="row q-col-gutter-md">
            <div class="col-6 col-sm-4 col-md-3" v-for="p in filteredProducts" :key="p.id">
              <q-card class="cursor-pointer fit hover-border transition-half" @click="addToCart(p)">
                <q-img :src="p.img || 'https://cdn.quasar.dev/img/ecommerce.png'" height="120px">
                  <div class="absolute-bottom text-center text-subtitle2 q-pa-xs bg-black-transparent">
                    ${{ p.price.toFixed(2) }}
                  </div>
                </q-img>
                <q-card-section class="q-pa-sm text-center">
                  <div class="text-caption text-weight-bold ellipsis">{{ p.name }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-scroll-area>
      </div>

    </q-page>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useQuasar } from 'quasar'

  const $q = useQuasar()

  // --- State Management ---
  const customer = ref('Walk-in Customer')
  const search = ref('')
  const filter = ref('')
  const cart = ref([])

  // --- Mock Database ---
  const products = [
    { id: 1, name: 'Double Burger', price: 8.50, category: 'Food' },
    { id: 2, name: 'Large Fries', price: 3.00, category: 'Food' },
    { id: 3, name: 'Coca Cola', price: 1.50, category: 'Drink' },
    { id: 4, name: 'Cheese Pizza', price: 14.00, category: 'Food' },
    { id: 5, name: 'Mineral Water', price: 1.00, category: 'Drink' },
    { id: 6, name: 'Chicken Nuggets', price: 5.50, category: 'Food' },
  ]

  // --- Computed Logic ---
  const filteredProducts = computed(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
      const matchesFilter = filter.value ? p.category === filter.value : true
      return matchesSearch && matchesFilter
    })
  })

  const subtotal = computed(() => cart.value.reduce((acc, item) => acc + (item.price * item.qty), 0).toFixed(2))
  const tax = computed(() => (subtotal.value * 0.05).toFixed(2))
  const total = computed(() => (parseFloat(subtotal.value) + parseFloat(tax.value)).toFixed(2))

  // --- Cart Actions ---
  const addToCart = (p) => {
    const existing = cart.value.find(i => i.id === p.id)
    if(existing) existing.qty++
    else cart.value.push({ ...p, qty: 1 })
  }

  const removeFromCart = (index) => cart.value.splice(index, 1)

  const clearCart = () => {
    cart.value = []
    customer.value = 'Walk-in Customer'
  }

  const confirmClear = () => {
    if (cart.value.length === 0) return
    $q.dialog({
      title: 'Clear Cart?',
      message: 'Are you sure you want to remove all items?',
      cancel: true,
      persistent: true
    }).onOk(() => { clearCart() })
  }

  // --- HOLD ORDER LOGIC (Parking the cart) ---
  const holdOrder = () => {
    if (cart.value.length === 0) return

    // 1. Get current held orders from storage
    const heldOrders = JSON.parse(localStorage.getItem('pos_held_orders') || '[]')

    // 2. Add the new parked order
    heldOrders.unshift({
      id: Date.now(),
      customer: customer.value,
      items: [...cart.value], // Clone the cart
      total: total.value,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    // 3. Save back to LocalStorage
    localStorage.setItem('pos_held_orders', JSON.stringify(heldOrders))

    // 4. Reset Terminal for the next customer
    $q.notify({
      type: 'warning',
      message: `Order for ${customer.value} saved to Held Orders.`,
      icon: 'pause_circle',
      position: 'top'
    })

    clearCart()
  }

  // --- RESTORE LOGIC (Retrieving the parked cart) ---
  onMounted(() => {
    // Check if there is a pending restore request (usually set by HeldOrders.vue)
    const restoreData = localStorage.getItem('pos_cart_restore')

    if (restoreData) {
      const order = JSON.parse(restoreData)
      cart.value = order.items || []
      customer.value = order.customer || 'Walk-in Customer'

      // Clear the temp storage so it doesn't load again on refresh
      localStorage.removeItem('pos_cart_restore')

      $q.notify({
        type: 'positive',
        message: `Restored order for ${customer.value}`,
        icon: 'history'
      })
    }
  })

  // --- Payment Logic ---
  const processPayment = () => {
    $q.loading.show({ message: 'Finalizing Transaction...' })

    setTimeout(() => {
      $q.loading.hide()

      // Logic to save to permanent sales history
      const history = JSON.parse(localStorage.getItem('pos_sales_history') || '[]')
      history.unshift({
        id: Date.now(),
        total: total.value,
        items: cart.value.length,
        date: new Date().toLocaleString()
      })
      localStorage.setItem('pos_sales_history', JSON.stringify(history))

      $q.notify({ type: 'positive', message: 'Payment Successful! Receipt Printed.' })
      clearCart()
    }, 800)
  }
  </script>

  <style scoped>
  .window-height-minus-header { height: calc(100vh - 50px); }
  .border-bottom { border-bottom: 1px solid #e0e0e0; }
  .border-top { border-top: 1px solid #e0e0e0; }
  .hover-border:hover { border: 1px solid var(--q-primary); }
  .transition-half { transition: all 0.2s ease-in-out; }
  .bg-black-transparent { background: rgba(0,0,0,0.6); }
  </style>
