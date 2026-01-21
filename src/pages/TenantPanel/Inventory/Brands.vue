<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Brands</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Add Brand" unelevated @click="promptAdd" />
    </div>

    <q-card flat bordered>
      <q-table :rows="brands" :columns="columns" row-key="id" flat hide-bottom>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn flat round color="grey" icon="edit" size="sm" />
            <q-btn flat round color="negative" icon="delete" size="sm" @click="deleteBrand(props.row.id)" />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const brands = ref([])
const columns = [
  { name: 'name', label: 'Brand Name', field: 'name', align: 'left', sortable: true },
  { name: 'description', label: 'Description', field: 'description', align: 'left' },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'right' }
]

onMounted(() => {
  const stored = localStorage.getItem('tenant_brands')
  brands.value = stored ? JSON.parse(stored) : [
    { id: 1, name: 'Nike', description: 'Sportswear and shoes' },
    { id: 2, name: 'Samsung', description: 'Electronics' },
    { id: 3, name: 'Nestle', description: 'Food and Drink' }
  ]
})

const promptAdd = () => {
  $q.dialog({
    title: 'New Brand',
    message: 'Brand Name:',
    prompt: { model: '', type: 'text' },
    cancel: true
  }).onOk(data => {
    brands.value.push({ id: Date.now(), name: data, description: 'No description' })
    localStorage.setItem('tenant_brands', JSON.stringify(brands.value))
  })
}

const deleteBrand = (id) => {
  brands.value = brands.value.filter(b => b.id !== id)
  localStorage.setItem('tenant_brands', JSON.stringify(brands.value))
}
</script>
