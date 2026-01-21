<template>
  <q-card style="min-width: 500px">
    <q-card-section class="row items-center">
      <div class="text-h6">Held / Parked Orders</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pa-none">
      <div v-if="heldOrders.length === 0" class="text-center q-pa-xl text-grey">
        <q-icon name="remove_shopping_cart" size="50px" />
        <div class="q-mt-md">No orders currently on hold.</div>
      </div>

      <q-list separator v-else>
        <q-item v-for="(order, index) in heldOrders" :key="index">
          <q-item-section avatar>
            <q-avatar color="orange-1" text-color="orange" icon="pause" />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-bold">Order #{{ order.id }}</q-item-label>
            <q-item-label caption>
              {{ order.items.length }} Items • Held at {{ order.time }}
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="text-weight-bold text-black">${{ order.total }}</div>
          </q-item-section>

          <q-item-section side>
            <q-btn flat round color="green" icon="play_arrow" @click="restore(index)">
              <q-tooltip>Restore to Cart</q-tooltip>
            </q-btn>
            <q-btn flat round color="red" icon="delete" size="sm" @click="discard(index)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['restore'])
const heldOrders = ref([])

onMounted(() => {
  // Load Mock Held Orders if empty
  const stored = localStorage.getItem('pos_held_orders')
  if (stored) {
    heldOrders.value = JSON.parse(stored)
  } else {
    // Fake data for demo
    heldOrders.value = [
      { id: '101', time: '10:30 AM', total: '15.50', items: [{ id: 1, name: 'Burger', price: 5, qty: 3 }] }
    ]
  }
})

const restore = (index) => {
  const order = heldOrders.value[index]
  emit('restore', order.items) // Send items back to Terminal

  // Remove from held list
  heldOrders.value.splice(index, 1)
  save()
}

const discard = (index) => {
  heldOrders.value.splice(index, 1)
  save()
}

const save = () => {
  localStorage.setItem('pos_held_orders', JSON.stringify(heldOrders.value))
}
</script>
