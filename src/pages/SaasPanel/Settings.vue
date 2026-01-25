<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h5 text-weight-bold q-mb-md text-teal">Global Settings</div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6">
        <q-card  bordered>
          <q-card-section>
            <div class="text-h6">General Configuration</div>
          </q-card-section>
          <q-card-section class="q-gutter-y-md">
            <q-input outlined v-model="config.appName" label="Application Name" />
            <q-select outlined v-model="config.currency" :options="['USD ($)', 'BDT (৳)', 'EUR (€)']" label="Default Currency" />
            <q-toggle v-model="config.maintenanceMode" label="Maintenance Mode (Close all access)" color="red" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-6">
        <q-card  bordered>
          <q-card-section>
            <div class="text-h6">Payment Gateways</div>
          </q-card-section>
          <q-card-section class="q-gutter-y-md">
            <q-input outlined v-model="config.stripeKey" label="Stripe Public Key" type="password" />
            <q-input outlined v-model="config.stripeSecret" label="Stripe Secret Key" type="password" />
            <q-separator />
            <q-input outlined v-model="config.paypalClient" label="PayPal Client ID" />
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row justify-end q-mt-lg">
      <q-btn color="teal" icon="save" no-caps dense label="Save Changes" size="lg" @click="saveSettings" />
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Default State
const config = ref({
  appName: 'MySaaS POS',
  currency: 'BDT (৳)',
  maintenanceMode: false,
  stripeKey: '',
  stripeSecret: '',
  paypalClient: ''
})

// Load from LocalStorage on mount
onMounted(() => {
  const savedConfig = localStorage.getItem('saas_config')
  if (savedConfig) {
    config.value = JSON.parse(savedConfig)
  }
})

// Save to LocalStorage
const saveSettings = () => {
  localStorage.setItem('saas_config', JSON.stringify(config.value))

  $q.notify({
    type: 'positive',
    message: 'Settings saved successfully!',
    position: 'top-right'
  })
}
</script>
