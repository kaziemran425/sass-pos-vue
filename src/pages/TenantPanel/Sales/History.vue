<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Sales History</div>
      <q-space />
      <div class="row q-gutter-sm">
        <q-btn flat icon="cloud_download" label="Export CSV" color="primary" />
        <q-input dense outlined v-model="filter" placeholder="Search Order #">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        :rows="orders"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              size="sm"
              class="text-weight-bold"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-payment="props">
          <q-td :props="props">
            <q-icon :name="getPaymentIcon(props.row.payment)" size="xs" class="q-mr-xs" />
            {{ props.row.payment }}
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="primary" icon="visibility" size="sm" @click="viewOrder(props.row)" />
            <q-btn flat round color="grey" icon="print" size="sm" @click="printReceipt(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="detailsDialog">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Order #{{ selectedOrder.id }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <div class="row q-mb-md">
            <div class="col-6">
              <div class="text-caption text-grey">Customer</div>
              <div class="text-weight-bold">{{ selectedOrder.customer }}</div>
            </div>
            <div class="col-6 text-right">
              <div class="text-caption text-grey">Date</div>
              <div class="text-weight-bold">{{ selectedOrder.date }}</div>
            </div>
          </div>

          <q-separator class="q-mb-md" />

          <div v-for="item in selectedOrder.items" :key="item.id" class="row items-center q-mb-sm">
            <div class="col-8">
              <div>{{ item.name }}</div>
              <div class="text-caption text-grey">Qty: {{ item.qty }} x ${{ item.price }}</div>
            </div>
            <div class="col-4 text-right text-weight-bold">
              ${{ item.qty * item.price }}
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row text-h6">
            <div class="col">Total</div>
            <div class="col text-right text-primary">${{ selectedOrder.total }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const filter = ref('')
const detailsDialog = ref(false)
const selectedOrder = ref({})
const orders = ref([])

const columns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left', sortable: true },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'payment', label: 'Payment', field: 'payment', align: 'left' },
  { name: 'itemsCount', label: 'Items', field: row => row.items.length, align: 'center' },
  { name: 'total', label: 'Total', field: 'total', format: val => `$${val}`, sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

onMounted(() => {
  const stored = localStorage.getItem('tenant_orders')
  if (stored) {
    orders.value = JSON.parse(stored)
  } else {
    // Mock Data if empty
    orders.value = [
      {
        id: 'ORD-1001', date: '2023-10-24', customer: 'Walk-in Customer', payment: 'Cash', total: 45, status: 'Completed',
        items: [ { id: 1, name: 'Wireless Mouse', qty: 1, price: 25 }, { id: 2, name: 'USB Cable', qty: 2, price: 10 } ]
      },
      {
        id: 'ORD-1002', date: '2023-10-25', customer: 'Mr. Rahim', payment: 'Card', total: 120, status: 'Refunded',
        items: [ { id: 3, name: 'Mechanical Keyboard', qty: 1, price: 120 } ]
      }
    ]
    localStorage.setItem('tenant_orders', JSON.stringify(orders.value))
  }
})

const getStatusColor = (status) => {
  if (status === 'Completed') return 'green'
  if (status === 'Refunded') return 'orange'
  return 'grey'
}

const getPaymentIcon = (method) => {
  if (method === 'Card') return 'credit_card'
  if (method === 'Cash') return 'payments'
  return 'attach_money'
}

const viewOrder = (row) => {
  selectedOrder.value = row
  detailsDialog.value = true
}

const printReceipt = (row) => {
  $q.notify({ message: `Printing receipt for ${row.id}...`, icon: 'print' })
}
</script>
