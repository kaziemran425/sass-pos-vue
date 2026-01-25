<template>
  <q-page class="q-pa-md bg-grey-2">

    <div class="screen-content"> <div class="row items-center q-mb-md">
        <div class="text-h5 text-weight-bold text-blue-grey-9">Sales History</div>
        <q-space />
        <div class="row q-gutter-sm">
          <q-btn flat icon="cloud_download" label="Export CSV" color="primary" />
          <q-input dense outlined v-model="filter" bg-color="white" placeholder="Search Order #">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
      </div>

      <q-card flat bordered class="shadow-1">
        <q-table
          :rows="orders"
          :columns="columns"
          row-key="id"
          :filter="filter"
          flat
          :pagination="{ rowsPerPage: 10 }"
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
              <div class="row items-center">
                <q-icon :name="getPaymentIcon(props.row.payment)" size="xs" class="q-mr-xs text-grey-7" />
                {{ props.row.payment }}
              </div>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" align="right">
              <q-btn flat round color="primary" icon="visibility" size="sm" @click="viewOrder(props.row)">
                <q-tooltip>View Details</q-tooltip>
              </q-btn>
              <q-btn flat round color="grey-8" icon="print" size="sm" @click="printReceipt(props.row)">
                <q-tooltip>Print Receipt</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-dialog v-model="detailsDialog">
      <q-card style="min-width: 600px">
        <q-card-section class="row items-center q-pb-none bg-grey-1">
          <div class="text-h6">Order Details</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <div class="row q-mb-md">
            <div class="col-6">
              <div class="text-caption text-grey">Order ID</div>
              <div class="text-subtitle1 text-weight-bold text-primary">{{ selectedOrder.id }}</div>
              <div class="text-caption text-grey q-mt-sm">Customer</div>
              <div class="text-weight-medium">{{ selectedOrder.customer }}</div>
            </div>
            <div class="col-6 text-right">
              <div class="text-caption text-grey">Date</div>
              <div class="text-weight-medium">{{ selectedOrder.date }}</div>
              <div class="text-caption text-grey q-mt-sm">Status</div>
              <div :class="`text-weight-bold text-${getStatusColor(selectedOrder.status)}`">{{ selectedOrder.status }}</div>
            </div>
          </div>

          <q-separator />

          <div class="q-py-md">
            <div class="row text-grey-7 q-mb-sm text-caption">
              <div class="col-6">ITEM</div>
              <div class="col-2 text-center">QTY</div>
              <div class="col-2 text-right">PRICE</div>
              <div class="col-2 text-right">TOTAL</div>
            </div>
            <div v-for="item in selectedOrder.items" :key="item.id" class="row items-center q-mb-sm">
              <div class="col-6 text-weight-medium">{{ item.name }}</div>
              <div class="col-2 text-center">{{ item.qty }}</div>
              <div class="col-2 text-right">${{ item.price }}</div>
              <div class="col-2 text-right text-weight-bold">${{ item.qty * item.price }}</div>
            </div>
          </div>

          <q-separator />

          <div class="row q-mt-md justify-end">
            <div class="col-6 col-sm-4">
              <div class="row justify-between q-mb-xs">
                <span class="text-grey">Subtotal</span>
                <span>${{ selectedOrder.total }}</span>
              </div>
              <div class="row justify-between text-h6 text-primary text-weight-bold q-mt-sm">
                <span>Total Paid</span>
                <span>${{ selectedOrder.total }}</span>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1">
          <q-btn flat label="Print" icon="print" color="primary" @click="printReceipt(selectedOrder)" />
          <q-btn unelevated label="Close" color="grey-8" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div id="print-area" class="print-only">
      <div class="receipt-container">

        <div class="text-center q-mb-lg">
          <div class="text-h4 text-weight-bolder">MY SHOP NAME</div>
          <div class="text-subtitle2">123 Business Street, City</div>
          <div class="text-caption">Phone: (555) 123-4567</div>
        </div>

        <div class="dashed-line"></div>

        <div class="row justify-between q-my-md">
          <div>
            <div><strong>Order:</strong> {{ selectedOrder.id }}</div>
            <div><strong>Date:</strong> {{ selectedOrder.date }}</div>
          </div>
          <div class="text-right">
             <div><strong>Cust:</strong> {{ selectedOrder.customer }}</div>
             <div><strong>Pay:</strong> {{ selectedOrder.payment }}</div>
          </div>
        </div>

        <div class="dashed-line"></div>

        <div class="row text-weight-bold q-my-sm">
          <div class="col-6">Item</div>
          <div class="col-2 text-center">Qty</div>
          <div class="col-4 text-right">Amt</div>
        </div>

        <div v-for="item in selectedOrder.items" :key="item.id" class="row q-mb-xs">
          <div class="col-6">{{ item.name }}</div>
          <div class="col-2 text-center">{{ item.qty }}</div>
          <div class="col-4 text-right">${{ (item.price * item.qty).toFixed(2) }}</div>
        </div>

        <div class="dashed-line q-my-md"></div>

        <div class="row justify-between text-weight-bold text-h6">
          <span>TOTAL</span>
          <span>${{ selectedOrder.total }}</span>
        </div>

        <div class="dashed-line q-my-md"></div>

        <div class="text-center q-mt-lg">
          <div class="text-weight-bold">THANK YOU!</div>
          <div class="text-caption">Please come again</div>
          <div class="q-mt-sm barcode-placeholder">||| || ||||| |||</div>
        </div>

      </div>
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- State ---
const filter = ref('')
const detailsDialog = ref(false)
const selectedOrder = ref({ items: [] }) // Initialize with empty items to prevent print errors
const orders = ref([])

// --- Table Configuration ---
const columns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left', sortable: true },
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'payment', label: 'Payment', field: 'payment', align: 'left' },
  { name: 'itemsCount', label: 'Items', field: row => row.items ? row.items.length : 0, align: 'center' },
  { name: 'total', label: 'Total', field: 'total', format: val => `$${val}`, sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

// --- Initialization ---
onMounted(() => {
  const stored = localStorage.getItem('tenant_orders')
  if (stored) {
    orders.value = JSON.parse(stored)
  } else {
    // Mock Data
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

// --- Helpers ---
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

// --- Actions ---
const viewOrder = (row) => {
  selectedOrder.value = row
  detailsDialog.value = true
}

// *** PRINT LOGIC ***
const printReceipt = (row) => {
  // 1. Set the data for the print template
  selectedOrder.value = row

  // 2. Notify user (optional)
  $q.notify({ message: 'Preparing PDF...', icon: 'print', timeout: 500 })

  // 3. Trigger Print after DOM updates
  setTimeout(() => {
    window.print()
  }, 500)
}
</script>

<style scoped>
/* ==========================================================================
   CSS FOR PRINTING (This hides the UI and shows only the Receipt)
   ==========================================================================
*/

/* 1. Hide the print area by default on the screen */
.print-only {
  display: none;
}

/* 2. When the browser opens Print Preview: */
@media print {
  /* Hide standard UI elements */
  .screen-content,
  .q-dialog,
  .q-notifications,
  header,
  aside,
  .q-drawer {
    display: none !important;
  }

  /* Show the print area */
  .print-only {
    display: block !important;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: white;
    z-index: 9999;
  }

  /* Reset page margins/padding for the printer */
  body, .q-page {
    background: white;
    margin: 0;
    padding: 0;
    overflow: visible;
  }

  /* Style the receipt specifically for paper */
  .receipt-container {
    width: 100%;
    max-width: 80mm; /* Standard Receipt Width */
    margin: 0 auto;
    padding: 20px;
    font-family: 'Courier New', Courier, monospace; /* Monospace looks like a receipt */
    color: black;
  }

  /* Helper for dashed lines */
  .dashed-line {
    border-bottom: 1px dashed black;
    width: 100%;
    margin: 10px 0;
  }
}
</style>
