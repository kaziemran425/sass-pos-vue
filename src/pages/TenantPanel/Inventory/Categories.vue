<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Categories</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Add Category" unelevated @click="promptAdd" />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card flat bordered>
          <q-list separator>
            <q-item v-for="cat in categories" :key="cat.id" clickable v-ripple>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" icon="category" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ cat.name }}</q-item-label>
                <q-item-label caption>{{ cat.productsCount }} Products Linked</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round icon="delete" color="negative" @click="deleteCat(cat.id)" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const categories = ref([])

onMounted(() => {
  const stored = localStorage.getItem('tenant_categories')
  categories.value = stored ? JSON.parse(stored) : [
    { id: 1, name: 'Electronics', productsCount: 12 },
    { id: 2, name: 'Groceries', productsCount: 45 },
    { id: 3, name: 'Clothing', productsCount: 8 }
  ]
})

const promptAdd = () => {
  $q.dialog({
    title: 'New Category',
    message: 'Enter category name:',
    prompt: { model: '', type: 'text' },
    cancel: true
  }).onOk(data => {
    categories.value.push({ id: Date.now(), name: data, productsCount: 0 })
    localStorage.setItem('tenant_categories', JSON.stringify(categories.value))
  })
}

const deleteCat = (id) => {
  categories.value = categories.value.filter(c => c.id !== id)
  localStorage.setItem('tenant_categories', JSON.stringify(categories.value))
}
</script>
