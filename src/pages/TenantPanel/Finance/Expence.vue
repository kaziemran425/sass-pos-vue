<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Expense Records</div>
        <div class="text-subtitle2 text-grey-7">Track and manage your business outflows</div>
      </div>
      <q-btn color="negative" icon="add" label="Add Expense" @click="addExpenseDialog = true" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="bg-red-1 text-red-9">
          <q-card-section>
            <div class="text-overline">Total Expenses (Monthly)</div>
            <div class="text-h4 text-weight-bolder">$4,120.50</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        title="Recent Expenses"
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-weight-bold text-red-7">
            - ${{ props.row.amount }}
          </q-td>
        </template>

        <template v-slot:body-cell-method="props">
          <q-td :props="props">
            <q-badge outline color="blue-grey">
              {{ props.row.method }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round color="grey" icon="edit" size="sm" />
            <q-btn flat round color="negative" icon="delete" size="sm" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const addExpenseDialog = ref(false)

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'vendor', label: 'Vendor/Payee', field: 'vendor', align: 'left' },
  { name: 'method', label: 'Payment Method', field: 'method', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const rows = ref([
  {
    id: 1,
    date: '2023-10-24',
    category: 'Inventory',
    vendor: 'Main Wholesale Ltd',
    method: 'Bank Transfer',
    amount: '2,500.00'
  },
  {
    id: 2,
    date: '2023-10-23',
    category: 'Utilities',
    vendor: 'City Power & Water',
    method: 'Cash',
    amount: '450.00'
  },
  {
    id: 3,
    date: '2023-10-22',
    category: 'Rent',
    vendor: 'Property Management Co.',
    method: 'Check',
    amount: '1,170.50'
  }
])
</script>
