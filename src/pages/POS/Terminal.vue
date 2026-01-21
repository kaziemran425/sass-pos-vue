<template>
  <q-layout view="hHh lpR fFf" class="bg-grey-2">

    <q-header elevated class="bg-white text-dark">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" />
        <q-toolbar-title class="text-weight-bold text-primary">POS Terminal</q-toolbar-title>

        <q-space />

        <q-chip
          :color="isShiftOpen ? 'green-1' : 'red-1'"
          :text-color="isShiftOpen ? 'green-9' : 'red-9'"
          clickable
          @click="shiftDialog = true"
        >
          <q-avatar :icon="isShiftOpen ? 'lock_open' : 'lock'" :color="isShiftOpen ? 'green' : 'red'" text-color="white" />
          {{ isShiftOpen ? 'Shift Open' : 'Shift Closed' }}
        </q-chip>

        <q-btn flat round icon="fullscreen" @click="$q.fullscreen.toggle()" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="row items-stretch window-height-minus-header">

        <div class="col-12 col-md-4 bg-white column border-right">

          <div class="q-pa-md border-bottom row q-col-gutter-sm">
             <div class="col-12">
               <q-select outlined dense v-model="selectedCustomer" :options="customers" label="Walk-in Customer" bg-color="grey-1">
                 <template v-slot:prepend><q-icon name="person" /></template>
               </q-select>
             </div>
          </div>

          <q-scroll-area class="col q-pa-md">
            <div v-if="cart.length === 0" class="column items-center justify-center full-height text-grey-5">
              <q-icon name="shopping_cart" size="60px" />
              <div class="q-mt-sm">Cart is empty</div>
            </div>

            <q-list separator v-else>
              <q-item v-for="(item, index) in cart" :key="index" class="q-px-none">
                <q-item-section>
                  <div class="text-weight-bold">{{ item.name }}</div>
                  <div class="text-caption text-grey">${{ item.price }} x {{ item.qty }}</div>
                </q-item-section>

                <q-item-section side>
                  <div class="row items-center bg-grey-2 rounded-borders">
                    <q-btn flat dense round icon="remove" size="sm" @click="updateQty(index, -1)" />
                    <div class="q-px-md text-weight-bold">{{ item.qty }}</div>
                    <q-btn flat dense round icon="add" size="sm" @click="updateQty(index, 1)" />
                  </div>
                </q-item-section>

                <q-item-section side>
                   <div class="text-weight-bold">${{ (item.price * item.qty).toFixed(2) }}</div>
                   <q-btn flat dense round icon="close" color="red" size="xs" @click="removeFromCart(index)" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>

          <div class="q-pa-md bg-grey-1 border-top">
            <div class="row justify-between q-mb-xs">
              <div class="text-caption">Subtotal</div>
              <div class="text-weight-bold">${{ cartTotal }}</div>
            </div>
            <div class="row justify-between q-mb-sm">
              <div class="text-caption">Tax (5%)</div>
              <div class="text-weight-bold">${{ cartTax }}</div>
            </div>
            <div class="row justify-between q-mb-md">
              <div class="text-h5 text-weight-bolder text-primary">Total</div>
              <div class="text-h5 text-weight-bolder text-primary">${{ grandTotal }}</div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-4">
                <q-btn outline color="orange" label="Hold" class="full-width" icon="pause" @click="holdDialog = true" />
              </div>
              <div class="col-8">
                <q-btn
                  color="green-7"
                  label="PAY NOW"
                  class="full-width text-weight-bold"
                  size="lg"
                  icon="payments"
                  :disable="cart.length === 0"
                  @click="processPayment"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-8 bg-grey-2 column">

          <div class="q-pa-md">
            <div class="row q-col-gutter-sm">
              <div class="col">
                <q-input outlined dense bg-color="white" v-model="search" placeholder="Search Product / SKU / Barcode" autofocus>
                  <template v-slot:prepend><q-icon name="search" /></template>
                </q-input>
              </div>
              <div class="col-auto">
                <q-btn-dropdown outline color="primary" label="Category" class="bg-white">
                  <q-list>
                    <q-item clickable v-close-popup @click="filterCategory = ''">
                      <q-item-section>All Categories</q-item-section>
                    </q-item>
                    <q-item v-for="cat in categories" :key="cat" clickable v-close-popup @click="filterCategory = cat">
                      <q-item-section>{{ cat }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-btn-dropdown>
              </div>
            </div>
          </div>

          <q-scroll-area class="col q-px-md">
            <div class="row q-col-gutter-md">
              <div class="col-6 col-md-4 col-lg-3" v-for="product in filteredProducts" :key="product.id">
                <q-card
                  class="cursor-pointer hover-effect full-height column"
                  v-ripple
                  @click="addToCart(product)"
                >
                  <q-img :src="product.image || 'https://cdn.quasar.dev/img/ecommerce.png'" height="120px" class="col-auto">
                    <div class="absolute-bottom text-subtitle2 text-center bg-transparent-black">
                      ${{ product.price }}
                    </div>
                  </q-img>
                  <q-card-section class="col q-pa-sm text-center">
                    <div class="text-weight-bold ellipsis-2-lines">{{ product.name }}</div>
                    <div class="text-caption text-grey">{{ product.stock }} in stock</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-scroll-area>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="shiftDialog" persistent>
      <OpenCloseShift @close="shiftDialog = false" @status-change="checkShiftStatus" />
    </q-dialog>

    <q-dialog v-model="holdDialog">
      <HeldOrders @restore="restoreOrder" />
    </q-dialog>

  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import OpenCloseShift from './OpenCloseShift.vue'
import HeldOrders from './HeldOrders.vue'

const $q = useQuasar()

// State
const search = ref('')
const filterCategory = ref('')
const cart = ref([])
const products = ref([])
const categories = ref([])
const customers = ['Walk-in Customer', 'Kazi Emran', 'VIP Client']
const selectedCustomer = ref('Walk-in Customer')
const shiftDialog = ref(false)
const holdDialog = ref(false)
const isShiftOpen = ref(false)

// Computed
const filteredProducts = computed(() => {
  return products.value.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase()) || p.sku.includes(search.value)
    const matchesCat = filterCategory.value ? p.category === filterCategory.value : true
    return matchesSearch && matchesCat
  })
})

const cartTotal = computed(() => cart.value.reduce((sum, item) => sum + (item.price * item.qty), 0).toFixed(2))
const cartTax = computed(() => (cartTotal.value * 0.05).toFixed(2)) // 5% Tax Hardcoded
const grandTotal = computed(() => (parseFloat(cartTotal.value) + parseFloat(cartTax.value)).toFixed(2))

// Lifecycle
onMounted(() => {
  // Load Products
  const stored = localStorage.getItem('tenant_products')
  if (stored) {
    products.value = JSON.parse(stored)
    // Extract unique categories
    categories.value = [...new Set(products.value.map(p => p.category))]
  } else {
    // Fallback Mock
    products.value = [
      { id: 1, name: 'Burger', sku: '101', price: 5.00, category: 'Food', stock: 100 },
      { id: 2, name: 'Coke', sku: '102', price: 1.50, category: 'Drinks', stock: 50 },
      { id: 3, name: 'Fries', sku: '103', price: 2.50, category: 'Food', stock: 80 }
    ]
    categories.value = ['Food', 'Drinks']
  }

  checkShiftStatus()
})

// Methods
const checkShiftStatus = () => {
  const shift = localStorage.getItem('pos_current_shift')
  isShiftOpen.value = !!shift
}

const addToCart = (product) => {
  if (!isShiftOpen.value) {
    $q.notify({ type: 'warning', message: 'Please open a shift first!' })
    shiftDialog.value = true
    return
  }

  const existing = cart.value.find(i => i.id === product.id)
  if (existing) {
    existing.qty++
  } else {
    cart.value.push({ ...product, qty: 1 })
  }
}

const updateQty = (index, amount) => {
  cart.value[index].qty += amount
  if (cart.value[index].qty <= 0) removeFromCart(index)
}

const removeFromCart = (index) => {
  cart.value.splice(index, 1)
}

const restoreOrder = (items) => {
  cart.value = items
  holdDialog.value = false
  $q.notify({ type: 'positive', message: 'Order Restored!' })
}

const processPayment = () => {
  $q.loading.show({ message: 'Processing Transaction...' })

  setTimeout(() => {
    // Save Order to History
    const order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      items: [...cart.value],
      total: grandTotal.value,
      payment: 'Cash',
      status: 'Completed'
    }

    const history = JSON.parse(localStorage.getItem('tenant_orders') || '[]')
    history.unshift(order)
    localStorage.setItem('tenant_orders', JSON.stringify(history))

    // Clear Cart
    cart.value = []
    $q.loading.hide()
    $q.notify({ type: 'positive', message: 'Payment Successful!', icon: 'check_circle' })
  }, 1000)
}
</script>

<style scoped>
.window-height-minus-header {
  height: calc(100vh - 50px);
}
.border-right { border-right: 1px solid #e0e0e0; }
.border-bottom { border-bottom: 1px solid #e0e0e0; }
.border-top { border-top: 1px solid #e0e0e0; }
.bg-transparent-black {
  background: rgba(0,0,0,0.6);
  color: white;
  width: 100%;
  padding: 4px;
}
.hover-effect:hover {
  border: 1px solid var(--q-primary);
  transform: translateY(-2px);
  transition: all 0.2s;
}
</style>
