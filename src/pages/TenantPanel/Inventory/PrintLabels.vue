<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row q-col-gutter-md">

      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Label Configuration</div>
          </q-card-section>

          <q-card-section class="q-gutter-y-md">
            <q-select
              outlined
              v-model="selectedProduct"
              :options="products"
              option-label="name"
              label="Select Product"
            />

            <q-input outlined type="number" v-model.number="quantity" label="Quantity to Print" />

            <q-btn
              color="teal-5"
              label="Add to Queue"
              class="full-width"
              icon="playlist_add"
              :disable="!selectedProduct"
              @click="addToQueue"
            />
             <q-separator spaced />
             <q-btn
              color="dark"
              label="Print Now"
              class="full-width"
              icon="print"
              @click="printWindow"
              :disable="queue.length === 0"
            />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="bg-white">
          <q-card-section class="row items-center">
            <div class="text-h6">Print Preview (A4 Sheet)</div>
            <q-space />
            <q-btn flat round icon="clear_all" color="negative" @click="queue = []" />
          </q-card-section>

          <q-separator />

          <div class="q-pa-md print-area" id="print-area">
            <div class="row q-col-gutter-sm">
              <div
                class="col-3 q-mb-md"
                v-for="(item, index) in queue"
                :key="index"
              >
                <div class="barcode-card">
                  <div class="text-weight-bold text-caption ellipsis">{{ item.name }}</div>
                  <div class="barcode-lines q-my-xs"></div>
                  <div class="text-caption">{{ item.sku }}</div>
                  <div class="text-weight-bold">${{ item.price }}</div>
                </div>
              </div>
            </div>

            <div v-if="queue.length === 0" class="text-center text-grey q-pa-xl">
              <q-icon name="print_disabled" size="xl" />
              <div class="q-mt-sm">Add products to generate labels</div>
            </div>
          </div>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const products = ref([])
const selectedProduct = ref(null)
const quantity = ref(10)
const queue = ref([])

onMounted(() => {
  // Load products to populate the select dropdown
  const stored = localStorage.getItem('tenant_products')
  if (stored) products.value = JSON.parse(stored)
  else products.value = [
     { id: 1, name: 'Sample Product', sku: '12345678', price: 10 }
  ]
})

const addToQueue = () => {
  for(let i=0; i<quantity.value; i++) {
    queue.value.push(selectedProduct.value)
  }
}

const printWindow = () => {
  window.print()
}
</script>

<style scoped>
/* Simulated Barcode using CSS Gradients */
.barcode-card {
  border: 1px dashed #ccc;
  padding: 10px;
  text-align: center;
  background: white;
}

.barcode-lines {
  height: 30px;
  width: 100%;
  background: repeating-linear-gradient(
    90deg,
    #000 0px,
    #000 2px,
    #fff 2px,
    #fff 4px,
    #000 4px,
    #000 5px,
    #fff 5px,
    #fff 7px
  );
}

/* Print Specific Styles */
@media print {
  body * {
    visibility: hidden;
  }
  .print-area, .print-area * {
    visibility: visible;
  }
  .print-area {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  .q-card {
    border: none;
  }
}
</style>
