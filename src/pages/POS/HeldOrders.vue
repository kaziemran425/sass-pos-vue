<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn icon="arrow_back" flat round to="/pos" />
      <div class="text-h5 q-ml-sm">Held Orders</div>
    </div>

    <div v-if="orders.length === 0" class="text-center text-grey q-mt-xl">
      <q-icon name="remove_shopping_cart" size="60px" />
      <div class="text-h6">No held orders found</div>
    </div>

    <div class="row q-col-gutter-md" v-else>
      <div class="col-12 col-sm-6 col-md-4" v-for="(order, i) in orders" :key="i">
        <q-card bordered>
          <q-card-section class="bg-orange-1 row items-center justify-between">
            <div class="text-weight-bold">Order #{{ order.id }}</div>
            <div class="text-caption">{{ order.time }}</div>
          </q-card-section>

          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">${{ order.total }}</div>
            <div class="text-caption text-grey">{{ order.items }} Items</div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn flat color="red" label="Delete" />
            <q-btn flat color="green" label="Restore to Cart" to="/pos" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const orders = ref([
  { id: 101, time: '10:30 AM', total: '15.50', items: 3 },
  { id: 105, time: '11:15 AM', total: '45.00', items: 5 },
])
</script>
