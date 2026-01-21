<template>
  <q-card style="min-width: 400px">
    <q-card-section class="bg-primary text-white">
      <div class="text-h6">{{ hasActiveShift ? 'Close Shift' : 'Open New Shift' }}</div>
    </q-card-section>

    <q-card-section class="q-pt-lg">

      <div v-if="!hasActiveShift">
        <div class="text-body1 q-mb-md">Starting a new day? Enter float amount.</div>
        <q-input outlined v-model.number="amount" label="Opening Cash Float ($)" type="number" autofocus />
      </div>

      <div v-else>
        <div class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders q-mb-md">
          <span>Shift Started:</span>
          <span class="text-weight-bold">{{ currentShift.startTime }}</span>
        </div>
        <div class="row items-center justify-between bg-grey-2 q-pa-sm rounded-borders q-mb-lg">
          <span>Opening Float:</span>
          <span class="text-weight-bold">${{ currentShift.startAmount }}</span>
        </div>

        <q-input outlined v-model.number="amount" label="Closing Cash Count ($)" type="number" :rules="[val => val !== null || 'Required']" />

        <div class="q-mt-sm text-caption text-grey" v-if="amount">
          Expected Cash: ${{ currentShift.startAmount }} + Sales
          <br>
          Difference: {{ (amount - currentShift.startAmount).toFixed(2) }}
        </div>
      </div>

    </q-card-section>

    <q-card-actions align="right" class="text-primary">
      <q-btn flat label="Cancel" v-close-popup />
      <q-btn
        :color="hasActiveShift ? 'red' : 'green'"
        :label="hasActiveShift ? 'End Shift' : 'Start Shift'"
        unelevated
        @click="handleAction"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar, date } from 'quasar'

const $q = useQuasar()
const emit = defineEmits(['close', 'status-change'])

const amount = ref(0)
const hasActiveShift = ref(false)
const currentShift = ref({})

onMounted(() => {
  const stored = localStorage.getItem('pos_current_shift')
  if (stored) {
    hasActiveShift.value = true
    currentShift.value = JSON.parse(stored)
  }
})

const handleAction = () => {
  if (!hasActiveShift.value) {
    // OPEN SHIFT
    const shiftData = {
      id: Date.now(),
      startTime: date.formatDate(Date.now(), 'HH:mm'),
      startAmount: amount.value
    }
    localStorage.setItem('pos_current_shift', JSON.stringify(shiftData))

    $q.notify({ type: 'positive', message: 'Shift Opened Successfully' })
    emit('status-change')
    emit('close')
  } else {
    // CLOSE SHIFT
    localStorage.removeItem('pos_current_shift')

    // In a real app, save this report to a 'shift_reports' table
    $q.notify({ type: 'warning', message: 'Shift Closed. X-Report generated.' })
    emit('status-change')
    emit('close')
  }
}
</script>
