<template>
  <q-page class="flex flex-center bg-grey-2">
    <q-card style="width: 400px; max-width: 90vw">
      <q-card-section class="bg-primary text-white row items-center">
        <div class="text-h6">Shift Management</div>
        <q-space />
        <q-btn icon="close" flat round dense to="/pos" />
      </q-card-section>

      <q-card-section class="q-pt-lg">
        <div v-if="!isActive">
          <div class="text-subtitle1 q-mb-sm">Start New Shift</div>
          <q-input outlined v-model="amount" label="Opening Cash Amount" prefix="$" type="number" autofocus />
        </div>

        <div v-else>
          <div class="row justify-between q-mb-md">
            <span>Shift Started:</span>
            <span class="text-weight-bold">08:00 AM</span>
          </div>
          <div class="row justify-between q-mb-lg">
            <span>Opening Float:</span>
            <span class="text-weight-bold">$200.00</span>
          </div>

          <div class="text-subtitle1 q-mb-sm">Close Shift</div>
          <q-input outlined v-model="amount" label="Closing Cash Count" prefix="$" type="number" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat label="Cancel" to="/pos" />
        <q-btn
          unelevated
          :color="isActive ? 'red' : 'green'"
          :label="isActive ? 'End Shift' : 'Start Shift'"
          @click="toggleShift"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const isActive = ref(false)
const amount = ref('')

const toggleShift = () => {
  if (!amount.value) return

  isActive.value = !isActive.value
  $q.notify({
    type: isActive.value ? 'positive' : 'warning',
    message: isActive.value ? 'Shift Started' : 'Shift Closed'
  })
  router.push('/pos')
}
</script>
