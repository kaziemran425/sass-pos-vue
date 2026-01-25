<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold text-teal-6">Tax Rules</div>
      <q-space />
      <q-btn color="teal" no-caps icon="add" label="Add Tax Rule" dense @click="openDialog()" />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-table
            :rows="taxes"
            :columns="columns"
            row-key="id"
            flat
          >
            <template v-slot:body-cell-rate="props">
              <q-td :props="props" class="text-weight-bold">
                {{ props.row.rate }}%
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-toggle
                  v-model="props.row.status"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  @update:model-value="saveToStorage"
                />
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props" align="right">
                <q-btn flat round color="grey" icon="edit" size="sm" @click="openDialog(props.row)" />
                <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteTax(props.row.id)" />
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-blue-1">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold text-blue-9">
              <q-icon name="info" class="q-mr-sm"/> How Taxes Work
            </div>
            <p class="text-body2 text-blue-9 q-mt-sm">
              Enable the status toggle to apply a tax automatically to all sales.
            </p>
            <ul class="text-caption text-blue-8 q-pl-md">
              <li>Multiple taxes can be active (e.g., VAT + Service Charge).</li>
              <li>Taxes are calculated on the subtotal.</li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ isEdit ? 'Edit Tax Rule' : 'New Tax Rule' }}</div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="form.name" label="Tax Name (e.g. VAT)" />
          <q-input outlined v-model.number="form.rate" label="Rate Percentage (%)" type="number" suffix="%" />
          <q-toggle v-model="form.status" label="Active Immediately" />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Rule" @click="saveTax" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const dialog = ref(false)
const isEdit = ref(false)
const taxes = ref([])

const columns = [
  { name: 'name', label: 'Tax Name', field: 'name', align: 'left', sortable: true },
  { name: 'rate', label: 'Rate (%)', field: 'rate', align: 'left', sortable: true },
  { name: 'status', label: 'Active', field: 'status', align: 'center' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' },
]

const defaultForm = { id: null, name: '', rate: 0, status: true }
const form = reactive({ ...defaultForm })

onMounted(() => {
  const stored = localStorage.getItem('tenant_taxesPage')
  if (stored) {
    taxes.value = JSON.parse(stored)
  } else {
    // Initial Default
    taxes.value = [
      { id: 1, name: 'VAT', rate: 5, status: true },
      { id: 2, name: 'Service Charge', rate: 2, status: false }
    ]
    saveToStorage()
  }
})

const openDialog = (row = null) => {
  isEdit.value = !!row
  if (row) Object.assign(form, row)
  else Object.assign(form, { ...defaultForm, id: Date.now() })
  dialog.value = true
}

const saveTax = () => {
  if (isEdit.value) {
    const index = taxes.value.findIndex(t => t.id === form.id)
    taxes.value[index] = { ...form }
  } else {
    taxes.value.push({ ...form })
  }
  saveToStorage()
  $q.notify({ type: 'positive', message: 'Tax rule updated' })
}

const deleteTax = (id) => {
  taxes.value = taxes.value.filter(t => t.id !== id)
  saveToStorage()
}

const saveToStorage = () => {
  localStorage.setItem('tenant_taxesPage', JSON.stringify(taxes.value))
}
</script>
