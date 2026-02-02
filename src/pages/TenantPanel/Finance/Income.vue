<template>
  <div class="q-pa-md">
    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold">Income Records</div>
        <div class="text-subtitle2 text-grey-7">Track and manage your business revenue</div>
      </div>
      <q-btn color="primary" icon="add" label="Add Income" @click="addIncomeDialog = true" />
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-4">
        <q-card flat bordered class="bg-green-1 text-green-9">
          <q-card-section>
            <div class="text-overline">Total Income (Monthly)</div>
            <div class="text-h4 text-weight-bolder">$12,450.00</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        title="Recent Transactions"
        :rows="rows"
        :columns="columns"
        row-key="id"
        flat
      >
        <template v-slot:body-cell-amount="props">
          <q-td :props="props" class="text-weight-bold text-green-7">
            + ${{ props.row.amount }}
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

const addIncomeDialog = ref(false)

const columns = [
  { name: 'date', label: 'Date', field: 'date', align: 'left', sortable: true },
  { name: 'category', label: 'Category', field: 'category', align: 'left' },
  { name: 'source', label: 'Source/Customer', field: 'source', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
]

const rows = ref([
  { id: 1, date: '2023-10-24', category: 'Product Sales', source: 'Walk-in Customer', amount: '450.00' },
  { id: 2, date: '2023-10-23', category: 'Service', source: 'John Doe', amount: '1,200.00' },
  { id: 3, date: '2023-10-22', category: 'Wholesale', source: 'Retail Hub Inc', amount: '3,100.00' },
])
</script>

<style scoped>
/* Optional: specific styling for your finance dashboard */
</style>
