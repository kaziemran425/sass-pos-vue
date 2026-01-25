<template>
  <q-page class="q-pa-md bg-grey-2">

    <div class="row items-center q-mb-md justify-between">
      <div>
        <div class="text-h5 text-weight-bold text-teal-9">Sales Report</div>
        <div class="text-caption text-grey-7">Analyze transaction history and performance</div>
      </div>
      <q-btn
        outline
        color="teal-7"
        icon="file_download"
        label="Export CSV"
        @click="exportReport"
      />
    </div>

    <q-card flat bordered class="q-mb-md bg-white">
      <q-card-section>
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-sm-4 col-md-3">
            <q-input outlined dense v-model="filters.start" type="date" label="Start Date" />
          </div>
          <div class="col-12 col-sm-4 col-md-3">
            <q-input outlined dense v-model="filters.end" type="date" label="End Date" />
          </div>
          <div class="col-12 col-sm-4 col-md-2">
            <q-btn
              color="teal-7"
              label="Apply Filter"
              class="full-width"
              unelevated
              icon="filter_alt"
              @click="loadData"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="bg-teal-1">
          <q-card-section>
            <div class="text-overline text-teal-9">Total Revenue</div>
            <div class="text-h4 text-weight-bold text-teal-8">${{ formatCurrency(metrics.total) }}</div>
            <div class="text-caption text-teal-7">Based on filtered range</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered class="bg-blue-1">
          <q-card-section>
            <div class="text-overline text-blue-9">Total Orders</div>
            <div class="text-h4 text-weight-bold text-blue-8">{{ metrics.count }}</div>
            <div class="text-caption text-blue-7">Transactions processed</div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-sm-4">
        <q-card flat bordered class="bg-orange-1">
          <q-card-section>
            <div class="text-overline text-orange-9">Avg. Order Value</div>
            <div class="text-h4 text-weight-bold text-orange-8">${{ formatCurrency(metrics.average) }}</div>
            <div class="text-caption text-orange-7">Revenue / Orders</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="bg-white shadow-1">
      <q-table
        :rows="filteredSales"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
        :loading="loading"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)">
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-weight-bold">
            ${{ formatCurrency(props.row.amount) }}
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-7 q-pa-lg">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span class="q-ml-sm">No sales found for this date range.</span>
          </div>
        </template>
      </q-table>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()

// --- 1. Service Layer (Integration Ready) ---
// This separates logic from UI. Replace contents of these functions to connect to API.
const SalesService = {
  KEY: 'tenant_sales_history',

  // Initialize mock data if localstorage is empty
  initMockData() {
    if (!localStorage.getItem(this.KEY)) {
      const mock = []
      const today = new Date()
      // Generate 20 random records
      for (let i = 0; i < 20; i++) {
        const d = date.subtractFromDate(today, { days: i })
        mock.push({
          id: `ORD-${1000 + i}`,
          customer: `Customer ${i + 1}`,
          date: date.formatDate(d, 'YYYY-MM-DD'),
          amount: Math.floor(Math.random() * 200) + 20, // Random $20-$220
          status: Math.random() > 0.2 ? 'Completed' : 'Refunded'
        })
      }
      localStorage.setItem(this.KEY, JSON.stringify(mock))
    }
  },

  getAll() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]')
  }
}

// --- 2. State Management ---
const allSales = ref([])
const filteredSales = ref([])
const loading = ref(false)

const filters = ref({
  start: date.formatDate(date.subtractFromDate(new Date(), { days: 30 }), 'YYYY-MM-DD'), // Default last 30 days
  end: date.formatDate(new Date(), 'YYYY-MM-DD')
})

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'amount', label: 'Total ($)', field: 'amount', align: 'right', sortable: true },
]

// --- 3. Computed Metrics (Smart Design) ---
// Automatically recalculates when filteredSales changes
const metrics = computed(() => {
  const data = filteredSales.value
  const total = data.reduce((acc, row) => row.status === 'Completed' ? acc + row.amount : acc, 0)
  const count = data.length

  return {
    total: total,
    count: count,
    average: count > 0 ? (total / count) : 0
  }
})

// --- 4. Logic & Actions ---

const loadData = () => {
  loading.value = true

  // Simulate API delay for realism
  setTimeout(() => {
    const raw = SalesService.getAll()

    // Client-side filtering
    filteredSales.value = raw.filter(item => {
      return item.date >= filters.value.start && item.date <= filters.value.end
    })

    loading.value = false
  }, 400)
}

const exportReport = () => {
  $q.notify({
    type: 'info',
    message: 'Downloading CSV...',
    icon: 'cloud_download'
  })
  // Actual CSV generation logic would go here
}

// Helper: Color coding for status
const getStatusColor = (status) => {
  switch(status) {
    case 'Completed': return 'green'
    case 'Pending': return 'orange'
    case 'Refunded': return 'red'
    default: return 'grey'
  }
}

// Helper: Currency format
const formatCurrency = (val) => {
  return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// --- 5. Lifecycle ---
onMounted(() => {
  SalesService.initMockData() // Ensure data exists
  allSales.value = SalesService.getAll()
  loadData() // Initial Load
})
</script>
