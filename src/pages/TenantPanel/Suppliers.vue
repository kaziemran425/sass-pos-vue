<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Suppliers & Vendors</div>
      <q-space />
      <q-btn color="secondary" icon="local_shipping" label="Add Supplier" unelevated @click="openDialog()" />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="suppliers"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
      >
        <template v-slot:top-right>
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search suppliers">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-company="props">
          <q-td :props="props">
            <div class="text-weight-bold">{{ props.row.company }}</div>
            <div class="text-caption text-grey">Contact: {{ props.row.contactPerson }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-products="props">
          <q-td :props="props" style="max-width: 250px; white-space: normal;">
            <q-chip
              v-for="prod in props.row.products"
              :key="prod"
              size="xs"
              color="blue-1"
              text-color="blue-9"
            >
              {{ prod }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-contact="props">
          <q-td :props="props">
            <q-btn round flat color="green" icon="phone" size="sm" type="a" :href="'tel:' + props.row.phone" />
            <q-btn round flat color="orange" icon="email" size="sm" type="a" :href="'mailto:' + props.row.email" />
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="grey" icon="edit" size="sm" @click="openDialog(props.row)" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteSupplier(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Supplier' : 'New Supplier' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="form.company" label="Company Name" />
          <q-input outlined v-model="form.contactPerson" label="Contact Person Name" />

          <div class="row q-col-gutter-sm">
            <div class="col-6"><q-input outlined v-model="form.phone" label="Phone" mask="(###) ### - ####" /></div>
            <div class="col-6"><q-input outlined v-model="form.email" label="Email" type="email" /></div>
          </div>

          <q-input
            outlined
            v-model="rawProducts"
            label="Products Supplied (comma separated)"
            hint="E.g. Electronics, Keyboards, Mice"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Supplier" @click="saveSupplier" v-close-popup />
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
const suppliers = ref([])
const rawProducts = ref('') // Temporary string for input

const columns = [
  { name: 'company', label: 'Company / Contact', field: 'company', align: 'left', sortable: true },
  { name: 'phone', label: 'Phone', field: 'phone', align: 'left' },
  { name: 'products', label: 'Goods Supplied', field: 'products', align: 'left' },
  { name: 'contact', label: 'Quick Contact', align: 'center' },
  { name: 'actions', label: 'Actions', align: 'right' },
]

const defaultForm = { id: null, company: '', contactPerson: '', phone: '', email: '', products: [] }
const form = reactive({ ...defaultForm })

onMounted(() => {
  const stored = localStorage.getItem('tenant_suppliers')
  if (stored) {
    suppliers.value = JSON.parse(stored)
  } else {
    // Mock Data
    suppliers.value = [
      { id: 1, company: 'Global Tech Distribution', contactPerson: 'Mr. John', phone: '(555) 000-1111', email: 'sales@gtech.com', products: ['Laptops', 'Monitors'] },
      { id: 2, company: 'Fresh Foods Ltd', contactPerson: 'Ms. Sarah', phone: '(555) 222-3333', email: 'orders@freshfoods.com', products: ['Vegetables', 'Fruits', 'Dairy'] },
    ]
    saveToStorage()
  }
})

const openDialog = (row = null) => {
  isEdit.value = !!row
  if (row) {
    Object.assign(form, row)
    rawProducts.value = row.products.join(', ')
  } else {
    Object.assign(form, { ...defaultForm, id: Date.now() })
    rawProducts.value = ''
  }
  dialog.value = true
}

const saveSupplier = () => {
  // Convert CSV string to array for chips
  form.products = rawProducts.value.split(',').map(s => s.trim()).filter(s => s)

  if (isEdit.value) {
    const index = suppliers.value.findIndex(s => s.id === form.id)
    suppliers.value[index] = { ...form }
  } else {
    suppliers.value.unshift({ ...form })
  }
  saveToStorage()
  $q.notify({ type: 'positive', message: 'Supplier info updated' })
}

const deleteSupplier = (id) => {
  $q.dialog({ title: 'Confirm', message: 'Remove this supplier?', cancel: true }).onOk(() => {
    suppliers.value = suppliers.value.filter(s => s.id !== id)
    saveToStorage()
  })
}

const saveToStorage = () => localStorage.setItem('tenant_suppliers', JSON.stringify(suppliers.value))
</script>
