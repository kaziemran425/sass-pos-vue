<template>
  <q-page class="q-pa-md bg-grey-2">

    <div class="row items-center q-mb-md justify-between">
      <div>
        <div class="text-h5 text-weight-bold text-teal-5">Financial Overview</div>
        <div class="text-caption text-grey-7">Track your revenue, expenses, and net profit</div>
      </div>

      <q-btn-dropdown outline color="grey-7" label="This Year" icon="calendar_today" class="bg-white">
        <q-list>
          <q-item clickable v-close-popup><q-item-section>This Month</q-item-section></q-item>
          <q-item clickable v-close-popup><q-item-section>Last Quarter</q-item-section></q-item>
          <q-item clickable v-close-popup><q-item-section>This Year</q-item-section></q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">

      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height bg-white">
          <q-card-section>
            <div class="text-overline text-grey-7">Total Revenue</div>
            <div class="row items-center">
              <div class="text-h4 text-weight-bold text-teal-7">${{ formatNumber(totals.income) }}</div>
              <q-space />
              <q-icon name="trending_up" color="teal" size="lg" />
            </div>
            <div class="q-mt-sm text-caption text-teal">
              <q-icon name="arrow_upward" /> 12% vs last period
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height bg-white">
          <q-card-section>
            <div class="text-overline text-grey-7">Total Expenses</div>
            <div class="row items-center">
              <div class="text-h4 text-weight-bold text-red-7">${{ formatNumber(totals.expense) }}</div>
              <q-space />
              <q-icon name="trending_down" color="red" size="lg" />
            </div>
            <div class="q-mt-sm text-caption text-red">
              <q-icon name="warning" /> High utility costs this month
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height" :class="totals.net >= 0 ? 'bg-teal-1' : 'bg-red-1'">
          <q-card-section>
            <div class="text-overline text-grey-8">Net Profit / Loss</div>
            <div class="row items-center">
              <div class="text-h4 text-weight-bold" :class="totals.net >= 0 ? 'text-teal-9' : 'text-red-9'">
                {{ totals.net >= 0 ? '+' : '' }}${{ formatNumber(totals.net) }}
              </div>
              <q-space />
              <q-icon name="account_balance_wallet" :color="totals.net >= 0 ? 'teal-9' : 'red-9'" size="lg" />
            </div>
            <div class="q-mt-sm text-caption text-grey-8">
              Profit Margin: <strong>{{ totals.margin }}%</strong>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">

      <div class="col-12 col-md-8">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center border-bottom">
            <div class="text-h6">Monthly Breakdown</div>
            <q-space />
            <q-btn icon="add" label="Add Record" color="primary" flat dense @click="openDialog" />
          </q-card-section>

          <q-markup-table flat>
            <thead>
              <tr class="text-left text-grey-7">
                <th>Month</th>
                <th>Revenue</th>
                <th>Expenses</th>
                <th>Net Status</th>
                <th class="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in financialData" :key="record.id">
                <td class="text-weight-bold">{{ record.month }}</td>
                <td class="text-teal">+ ${{ formatNumber(record.income) }}</td>
                <td class="text-red">- ${{ formatNumber(record.expense) }}</td>
                <td>
                  <q-badge :color="record.income >= record.expense ? 'green-1 text-green-9' : 'red-1 text-red-9'">
                    {{ record.income >= record.expense ? 'PROFIT' : 'LOSS' }}
                  </q-badge>
                </td>
                <td class="text-right">
                  <q-btn flat round icon="delete" color="grey" size="sm" @click="deleteRecord(record.id)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>

          <div v-if="financialData.length === 0" class="q-pa-xl text-center text-grey">
            No data available. Add a record to start.
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white full-height">
          <q-card-section>
            <div class="text-h6 q-mb-md">Expense Ratio</div>

            <div v-for="record in financialData.slice(0, 5)" :key="record.id" class="q-mb-md">
              <div class="row justify-between text-caption q-mb-xs">
                <span>{{ record.month }}</span>
                <span>{{ Math.round((record.expense / record.income) * 100) }}% Spent</span>
              </div>
              <q-linear-progress
                rounded
                size="10px"
                :value="record.expense / record.income"
                :color="record.expense / record.income > 0.8 ? 'red' : 'teal'"
                track-color="grey-3"
              />
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Add Monthly Data</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input outlined v-model="form.month" label="Month Name (e.g., April)" />
          <q-input outlined type="number" v-model.number="form.income" label="Total Income" prefix="$" />
          <q-input outlined type="number" v-model.number="form.expense" label="Total Expenses" prefix="$" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn flat label="Save" color="primary" @click="saveRecord" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- 1. Service Layer (Integration Ready) ---
// To integrate real API: replace localStorage calls with axios.get/post here
const FinanceService = {
  KEY: 'tenant_profit_loss',
  getData() {
    return JSON.parse(localStorage.getItem(this.KEY) || '[]')
  },
  saveData(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data))
  }
}

// --- 2. State & Data ---
const financialData = ref([])
const showDialog = ref(false)
const form = ref({ month: '', income: 0, expense: 0 })

// --- 3. Computed Statistics (Smart Logic) ---
const totals = computed(() => {
  const inc = financialData.value.reduce((acc, curr) => acc + curr.income, 0)
  const exp = financialData.value.reduce((acc, curr) => acc + curr.expense, 0)
  const net = inc - exp
  // Avoid division by zero
  const margin = inc > 0 ? ((net / inc) * 100).toFixed(1) : 0

  return { income: inc, expense: exp, net: net, margin: margin }
})

// --- 4. Actions ---
const openDialog = () => {
  form.value = { month: '', income: 0, expense: 0 }
  showDialog.value = true
}

const saveRecord = () => {
  if (!form.value.month) {
    $q.notify({ type: 'warning', message: 'Please enter a month name' })
    return
  }

  financialData.value.push({
    id: Date.now(),
    ...form.value
  })

  FinanceService.saveData(financialData.value)
  showDialog.value = false
  $q.notify({ type: 'positive', message: 'Record Added' })
}

const deleteRecord = (id) => {
  financialData.value = financialData.value.filter(item => item.id !== id)
  FinanceService.saveData(financialData.value)
}

// Utility: Format numbers (e.g. 1000 -> 1,000)
const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// --- 5. Lifecycle ---
onMounted(() => {
  const loaded = FinanceService.getData()
  if (loaded.length > 0) {
    financialData.value = loaded
  } else {
    // Mock Data for Smart Design Showcase
    financialData.value = [
      { id: 1, month: 'January', income: 15000, expense: 8000 },
      { id: 2, month: 'February', income: 18000, expense: 12000 },
      { id: 3, month: 'March', income: 22000, expense: 9500 }
    ]
    FinanceService.saveData(financialData.value)
  }
})
</script>

<style scoped>
.border-bottom {
  border-bottom: 1px solid #f0f0f0;
}
</style>
