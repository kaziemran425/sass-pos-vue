<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Customer Database</div>
      <q-space />
      <q-btn color="primary" icon="person_add" label="Add Customer" unelevated @click="openDialog()" />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="customers"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search customers">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="32px" :color="getAvatarColor(props.row.id)" text-color="white">
                {{ props.row.name.charAt(0) }}
              </q-avatar>
              <div class="q-ml-sm">
                <div class="text-weight-bold">{{ props.row.name }}</div>
                <div class="text-caption text-grey">Since {{ props.row.joinedDate }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-totalSpent="props">
          <q-td :props="props" align="right">
            <div class="text-weight-bold">${{ props.row.totalSpent }}</div>
            <q-badge v-if="props.row.totalSpent > 500" color="gold" text-color="black" label="VIP" transparent />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="primary" icon="history" size="sm" @click="viewHistory(props.row)">
              <q-tooltip>View Sales History</q-tooltip>
            </q-btn>
            <q-btn flat round color="grey" icon="edit" size="sm" @click="openDialog(props.row)" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteCustomer(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Profile' : 'New Customer' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="form.name" label="Full Name" :rules="[val => !!val || 'Name is required']" />
          <div class="row q-col-gutter-sm">
            <div class="col-6"><q-input outlined v-model="form.phone" label="Phone Number" mask="(###) ### - ####" /></div>
            <div class="col-6"><q-input outlined v-model="form.email" label="Email Address" type="email" /></div>
          </div>
          <q-input outlined v-model="form.address" label="Billing Address" type="textarea" rows="2" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Customer" @click="saveCustomer" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const filter = ref('')
const dialog = ref(false)
const isEdit = ref(false)
const customers = ref([])

const columns = [
  { name: 'name', label: 'Customer Name', field: 'name', align: 'left', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'email', label: 'Email', field: 'email', align: 'left' },
  { name: 'totalSpent', label: 'Lifetime Spend', field: 'totalSpent', align: 'right', sortable: true },
  { name: 'lastVisit', label: 'Last Visit', field: 'lastVisit', align: 'center', sortable: true },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const defaultForm = { id: null, name: '', phone: '', email: '', address: '', totalSpent: 0, joinedDate: '', lastVisit: 'Never' }
const form = reactive({ ...defaultForm })

onMounted(() => {
  const stored = localStorage.getItem('tenant_customers')
  if (stored) {
    customers.value = JSON.parse(stored)
  } else {
    // Mock Initial Data
    customers.value = [
      { id: 1, name: 'Kazi Emran', phone: '(017) 111 - 2222', email: 'emran@test.com', address: 'Dhaka, BD', totalSpent: 1200, joinedDate: '2023-01-15', lastVisit: '2023-10-20' },
      { id: 2, name: 'Rahim Uddin', phone: '(018) 333 - 4444', email: 'rahim@test.com', address: 'Chittagong, BD', totalSpent: 50, joinedDate: '2023-09-01', lastVisit: '2023-09-05' },
    ]
    saveToStorage()
  }
})

const getAvatarColor = (id) => {
  const colors = ['primary', 'teal', 'orange', 'purple', 'brown']
  return colors[id % colors.length]
}

const openDialog = (row = null) => {
  isEdit.value = !!row
  if (row) Object.assign(form, row)
  else Object.assign(form, { ...defaultForm, id: Date.now(), joinedDate: date.formatDate(Date.now(), 'YYYY-MM-DD') })
  dialog.value = true
}

const saveCustomer = () => {
  if (isEdit.value) {
    const index = customers.value.findIndex(c => c.id === form.id)
    customers.value[index] = { ...form }
  } else {
    customers.value.unshift({ ...form })
  }
  saveToStorage()
  $q.notify({ type: 'positive', message: 'Customer saved successfully' })
}

const deleteCustomer = (id) => {
  $q.dialog({ title: 'Confirm', message: 'Delete this customer? Data cannot be recovered.', cancel: true }).onOk(() => {
    customers.value = customers.value.filter(c => c.id !== id)
    saveToStorage()
  })
}

const saveToStorage = () => localStorage.setItem('tenant_customers', JSON.stringify(customers.value))

const viewHistory = (row) => {
  $q.notify({ message: `Viewing history for ${row.name}`, icon: 'history' })
  // In a real app, route to sales history filtered by customer ID
}
</script>
