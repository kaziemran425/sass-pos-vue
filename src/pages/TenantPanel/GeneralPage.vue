<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold text-red-7">General Settings</div>
    </div>

    <div class="row q-col-gutter-md">

      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Store Information</div>
            <div class="text-caption text-grey">This information will appear on receipts.</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="q-gutter-y-md">
            <q-input outlined v-model="form.storeName" label="Store Name" />

            <div class="row q-col-gutter-sm">
              <div class="col-6"><q-input outlined v-model="form.phone" label="Store Phone" /></div>
              <div class="col-6"><q-input outlined v-model="form.email" label="Store Email" /></div>
            </div>

            <q-input outlined v-model="form.address" label="Address / Location" type="textarea" rows="3" />

            <q-input outlined v-model="form.footerText" label="Receipt Footer Text" hint="e.g. 'Thank you for shopping with us!'" />
          </q-card-section>
        </q-card>

        <q-card flat bordered class="q-mt-md">
          <q-card-section>
            <div class="text-h6">Localization</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-md">
            <div class="col-6">
              <q-select outlined v-model="form.currency" :options="currencyOptions" label="Currency" />
            </div>
            <div class="col-6">
              <q-select outlined v-model="form.timezone" :options="timezoneOptions" label="Timezone" />
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6 text-teal-9">Store Logo</div>
          </q-card-section>

          <q-separator />

          <q-card-section class="column items-center q-py-xl">
            <q-avatar size="120px" font-size="50px" color="grey-3" text-color="grey-7" class="q-mb-md">
              <img v-if="form.logo" :src="form.logo" style="object-fit: cover" />
              <q-icon v-else name="store" />
            </q-avatar>

            <q-file
              outlined
              dense
              v-model="logoFile"
              label="Upload Logo"
              accept="image/*"
              class="full-width"
              @update:model-value="handleFileUpload"
            >
              <template v-slot:prepend>
                <q-icon name="cloud_upload" />
              </template>
            </q-file>

            <div class="text-caption text-grey q-mt-sm text-center">
              Recommended: 300x300 px<br>PNG or JPG
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="save" dense no-caps color="teal-7" label="Save Changes" @click="saveSettings" />
    </q-page-sticky>

  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const logoFile = ref(null)

const currencyOptions = ['USD ($)', 'BDT (৳)', 'EUR (€)', 'GBP (£)']
const timezoneOptions = ['UTC +06:00 (Dhaka)', 'UTC +00:00 (GMT)', 'UTC -05:00 (New York)']

const defaultForm = {
  storeName: '',
  phone: '',
  email: '',
  address: '',
  footerText: '',
  currency: 'BDT (৳)',
  timezone: 'UTC +06:00 (Dhaka)',
  logo: null // Stores Base64 string for demo purposes
}

const form = reactive({ ...defaultForm })

onMounted(() => {
  const stored = localStorage.getItem('tenant_generalPage_settings')
  if (stored) {
    Object.assign(form, JSON.parse(stored))
  } else {
    // Default Mock Data
    form.storeName = 'My Awesome Store'
    form.footerText = 'Thank you! Visit again.'
  }
})

const handleFileUpload = (file) => {
  if (file) {
    // Create a fake URL for preview (In real app, upload to server here)
    form.logo = URL.createObjectURL(file)
  }
}

const saveSettings = () => {
  // In a real app, form.logo should be the URL returned from the server
  localStorage.setItem('tenant_generalPage_settings', JSON.stringify(form))

  $q.notify({
    type: 'positive',
    message: 'Settings saved successfully!',
    icon: 'check_circle'
  })
}
</script>
