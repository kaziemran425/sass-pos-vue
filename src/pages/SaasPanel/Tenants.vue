<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold text-teal  ">Tenant Management</div>
      <q-space />
      <q-btn color="teal-5" no-caps icon="add" label="Add New Shop" unelevated />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="rows"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search tenants">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.status === 'Active' ? 'green-1' : 'red-1'"
              :text-color="props.row.status === 'Active' ? 'green-8' : 'red-8'"
              size="sm"
              class="text-weight-bold"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="grey" icon="edit" size="sm" />
            <q-btn flat round color="negative" icon="block" size="sm" @click="banTenant(props.row)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const filter = ref('')

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'name', label: 'Shop Name', field: 'name', align: 'left', sortable: true },
  { name: 'owner', label: 'Owner Name', field: 'owner', align: 'left' },
  { name: 'plan', label: 'Current Plan', field: 'plan', align: 'center', sortable: true },
  { name: 'revenue', label: 'LTV Revenue', field: 'revenue', sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

// Static mock data
const rows = ref([
  { id: 101, name: 'Super Shop BD', owner: 'Kazi Emran', plan: 'Enterprise', revenue: '$1,200', status: 'Active' },
  { id: 102, name: 'Gulshan Grocers', owner: 'Rahim Uddin', plan: 'Basic', revenue: '$150', status: 'Active' },
  { id: 103, name: 'Tech World', owner: 'Sujon Ahmed', plan: 'Pro', revenue: '$450', status: 'Banned' },
  { id: 104, name: 'Daily Bazar', owner: 'Karim Mia', plan: 'Basic', revenue: '$80', status: 'Active' },
])

const banTenant = (row) => {
  $q.dialog({
    title: 'Confirm',
    message: `Are you sure you want to ban ${row.name}?`,
    cancel: true,
    persistent: true
  }).onOk(() => {
    row.status = 'Banned'
    $q.notify({ type: 'negative', message: `${row.name} has been banned.` })
  })
}
</script>
