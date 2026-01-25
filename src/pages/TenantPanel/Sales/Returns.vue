<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Returns & Refunds</div>
      <q-space />
      <q-btn color="negative" icon="undo" no-caps label="New Return" dense @click="openReturnDialog" />
    </div>

    <q-card flat bordered>
      <q-table
        title="Return Logs"
        :rows="returnsLog"
        :columns="logColumns"
        row-key="id"
        flat
      >
        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-negative text-weight-bold">
            -${{ props.row.amount }}
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="returnDialog" persistent>
      <q-card style="min-width: 600px">
        <q-card-section>
          <div class="text-h6">Process a Return</div>
        </q-card-section>

        <q-card-section>
          <div v-if="!orderFound" class="row q-col-gutter-sm">
            <div class="col-9">
              <q-input outlined v-model="searchId" label="Enter Order ID (e.g., ORD-1001)" dense autofocus @keyup.enter="findOrder" />
            </div>
            <div class="col-3">
              <q-btn color="primary" label="Find" class="full-width full-height" @click="findOrder" :loading="searching" />
            </div>
          </div>

          <div v-else>
            <div class="bg-grey-2 q-pa-sm rounded-borders q-mb-md">
              <div class="text-subtitle2">Order #{{ activeOrder.id }}</div>
              <div class="text-caption">Original Total: ${{ activeOrder.total }}</div>
            </div>

            <q-list separator bordered class="rounded-borders">
              <q-item v-for="item in activeOrder.items" :key="item.id">
                <q-item-section>
                  <q-item-label>{{ item.name }}</q-item-label>
                  <q-item-label caption>Sold at ${{ item.price }}</q-item-label>
                </q-item-section>

                <q-item-section side>
                   <div class="row items-center">
                    <q-btn round flat size="sm" icon="remove" @click="adjustReturnQty(item, -1)" />
                    <span class="q-px-md text-weight-bold">{{ item.returnQty || 0 }}</span>
                    <q-btn round flat size="sm" icon="add" @click="adjustReturnQty(item, 1)" :disable="(item.returnQty || 0) >= item.qty" />
                  </div>
                </q-item-section>

                <q-item-section side>
                  ${{ (item.returnQty || 0) * item.price }}
                </q-item-section>
              </q-item>
            </q-list>

            <div class="row justify-between items-center q-mt-md">
              <div class="text-subtitle1">Refund Amount:</div>
              <div class="text-h5 text-negative text-weight-bold">${{ refundTotal }}</div>
            </div>

            <q-input v-model="returnReason" label="Reason for Return" outlined dense class="q-mt-sm" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup @click="resetDialog" />
          <q-btn
            color="negative"
            label="Confirm Refund"
            v-if="orderFound"
            :disable="refundTotal <= 0"
            @click="processRefund"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const returnDialog = ref(false)
const returnsLog = ref([])

// Search Logic
const searchId = ref('')
const searching = ref(false)
const orderFound = ref(false)
const activeOrder = ref(null)
const returnReason = ref('')

// Columns for the Log Table
const logColumns = [
  { name: 'returnId', label: 'Return ID', field: 'returnId', align: 'left' },
  { name: 'orderId', label: 'Original Order', field: 'orderId', align: 'left' },
  { name: 'date', label: 'Date', field: 'date', align: 'left' },
  { name: 'reason', label: 'Reason', field: 'reason', align: 'left' },
  { name: 'amount', label: 'Refunded', field: 'amount', align: 'right' },
]

onMounted(() => {
  const stored = localStorage.getItem('tenant_returns')
  if (stored) returnsLog.value = JSON.parse(stored)
})

const openReturnDialog = () => {
  resetDialog()
  returnDialog.value = true
}

const resetDialog = () => {
  searchId.value = ''
  orderFound.value = false
  activeOrder.value = null
  returnReason.value = ''
}

const findOrder = () => {
  searching.value = true

  // Simulate API delay
  setTimeout(() => {
    const allOrders = JSON.parse(localStorage.getItem('tenant_orders') || '[]')
    const found = allOrders.find(o => o.id === searchId.value)

    if (found) {
      // Create a deep copy to manipulate return quantities without affecting original yet
      activeOrder.value = JSON.parse(JSON.stringify(found))
      // Initialize returnQty for UI
      activeOrder.value.items.forEach(i => i.returnQty = 0)
      orderFound.value = true
    } else {
      $q.notify({ type: 'warning', message: 'Order ID not found' })
    }
    searching.value = false
  }, 500)
}

const adjustReturnQty = (item, amount) => {
  if (!item.returnQty) item.returnQty = 0
  const newVal = item.returnQty + amount
  if (newVal >= 0 && newVal <= item.qty) {
    item.returnQty = newVal
  }
}

const refundTotal = computed(() => {
  if (!activeOrder.value) return 0
  return activeOrder.value.items.reduce((sum, item) => sum + ((item.returnQty || 0) * item.price), 0)
})

const processRefund = () => {
  // 1. Create Return Record
  const newReturn = {
    returnId: `RET-${Math.floor(Math.random() * 10000)}`,
    orderId: activeOrder.value.id,
    date: date.formatDate(Date.now(), 'YYYY-MM-DD HH:mm'),
    amount: refundTotal.value,
    reason: returnReason.value || 'No reason provided'
  }

  // 2. Save to Log
  returnsLog.value.unshift(newReturn)
  localStorage.setItem('tenant_returns', JSON.stringify(returnsLog.value))

  // 3. Optional: Update original order status to 'Refunded' or 'Partial Refund'
  const allOrders = JSON.parse(localStorage.getItem('tenant_orders') || '[]')
  const orderIndex = allOrders.findIndex(o => o.id === activeOrder.value.id)
  if (orderIndex !== -1) {
    allOrders[orderIndex].status = 'Refunded' // Simplified logic
    localStorage.setItem('tenant_orders', JSON.stringify(allOrders))
  }

  $q.notify({ type: 'positive', message: 'Refund processed successfully' })
  returnDialog.value = false
}
</script>
