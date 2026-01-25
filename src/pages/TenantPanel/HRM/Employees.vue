<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold text-teal-5">Staff Directory</div>
      <q-space />
      <q-btn color="teal-5" icon="person_add" label="New Employee" dense no-caps @click="openDialog()" />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="employees"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
      >
        <template v-slot:top-right>
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search staff">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-name="props">
          <q-td :props="props">
            <div class="row items-center no-wrap">
              <q-avatar size="32px" color="primary" text-color="white">
                {{ props.row.name.charAt(0) }}
              </q-avatar>
              <div class="q-ml-sm">
                <div class="text-weight-bold">{{ props.row.name }}</div>
                <div class="text-caption text-grey">{{ props.row.email }}</div>
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.status === 'Active' ? 'green-1' : 'red-1'"
              :text-color="props.row.status === 'Active' ? 'green-8' : 'red-8'"
              size="sm"
            >
              {{ props.row.status }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="grey" icon="edit" size="sm" @click="openDialog(props.row)" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteEmployee(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Employee' : 'New Employee' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="form.name" label="Full Name" :rules="[val => !!val || 'Field is required']" />
          <q-input outlined v-model="form.email" label="Email Address" type="email" />
          <q-input outlined v-model="form.phone" label="Phone Number" mask="(###) ### - ####" />

          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-select outlined v-model="form.role" :options="roleOptions" label="Role" />
            </div>
            <div class="col-6">
              <q-select outlined v-model="form.status" :options="['Active', 'On Leave', 'Terminated']" label="Status" />
            </div>
          </div>

          <q-input outlined v-model="form.salary" label="Monthly Salary" prefix="$" type="number" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Staff" @click="saveEmployee" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const filter = ref('')
const dialog = ref(false)
const isEdit = ref(false)
const employees = ref([])
const roleOptions = ref(['Manager', 'Cashier', 'Inventory Clerk'])

// Table Columns
const columns = [
  { name: 'name', label: 'Employee', field: 'name', align: 'left', sortable: true },
  { name: 'role', label: 'Role', field: 'role', align: 'left', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'salary', label: 'Salary', field: 'salary', format: val => `$${val}`, sortable: true },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

// Form State
const defaultForm = { id: null, name: '', email: '', phone: '', role: 'Cashier', status: 'Active', salary: 0 }
const form = reactive({ ...defaultForm })

onMounted(() => {
  const stored = localStorage.getItem('tenant_employees')
  if (stored) {
    employees.value = JSON.parse(stored)
  } else {
    // Static Mock Data
    employees.value = [
      { id: 1, name: 'John Doe', email: 'john@pos.com', phone: '(555) 123 - 4567', role: 'Manager', status: 'Active', salary: 3000 },
      { id: 2, name: 'Jane Smith', email: 'jane@pos.com', phone: '(555) 987 - 6543', role: 'Cashier', status: 'Active', salary: 2000 },
    ]
  }
})

const openDialog = (row = null) => {
  isEdit.value = !!row
  if (row) Object.assign(form, row)
  else Object.assign(form, { ...defaultForm, id: Date.now() })
  dialog.value = true
}

const saveEmployee = () => {
  if (isEdit.value) {
    const index = employees.value.findIndex(e => e.id === form.id)
    employees.value[index] = { ...form }
  } else {
    employees.value.push({ ...form })
  }
  localStorage.setItem('tenant_employees', JSON.stringify(employees.value))
  $q.notify({ type: 'positive', message: 'Employee record saved!' })
}

const deleteEmployee = (id) => {
  $q.dialog({ title: 'Confirm', message: 'Delete this employee?', cancel: true }).onOk(() => {
    employees.value = employees.value.filter(e => e.id !== id)
    localStorage.setItem('tenant_employees', JSON.stringify(employees.value))
  })
}
</script>
