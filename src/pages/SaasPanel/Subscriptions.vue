<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="text-h5 text-weight-bold q-mb-lg">Subscription Plans</div>

    <div class="row q-col-gutter-lg">
      <div class="col-12 col-md-4" v-for="(plan, index) in plans" :key="index">
        <q-card class="text-center rounded-borders column full-height" :class="plan.popular ? 'bg-primary text-white' : ''">
          <q-card-section>
            <div class="text-overline q-mt-md">{{ plan.name }}</div>
            <div class="text-h3 text-weight-bolder">
              ${{ plan.price }}<span class="text-caption text-weight-regular">/mo</span>
            </div>
          </q-card-section>

          <q-card-section>
            <q-list dense>
              <q-item v-for="feature in plan.features" :key="feature" class="justify-center">
                <q-icon name="check" size="xs" :color="plan.popular ? 'white' : 'green'" class="q-mr-sm" />
                {{ feature }}
              </q-item>
            </q-list>
          </q-card-section>

          <q-space />

          <q-card-actions align="center" class="q-pb-lg">
            <q-btn
              :color="plan.popular ? 'white' : 'primary'"
              :text-color="plan.popular ? 'primary' : 'white'"
              label="Edit Plan"
              unelevated
              rounded
              class="q-px-xl"
              @click="editPlan(plan)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="editDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Edit {{ selectedPlan.name }}</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <q-input dense v-model="selectedPlan.price" label="Price ($)" type="number" autofocus />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const editDialog = ref(false)
const selectedPlan = ref({})

const plans = ref([
  {
    name: 'BASIC',
    price: 0,
    features: ['1 Shop', '1 User Account', '500 Products', 'Community Support'],
    popular: false
  },
  {
    name: 'PRO',
    price: 29,
    features: ['3 Shops', '5 User Accounts', 'Unlimited Products', 'Email Support', 'Advanced Analytics'],
    popular: true
  },
  {
    name: 'ENTERPRISE',
    price: 99,
    features: ['Unlimited Shops', 'Unlimited Users', 'API Access', '24/7 Phone Support', 'Dedicated Manager'],
    popular: false
  }
])

const editPlan = (plan) => {
  selectedPlan.value = plan // Direct reference for simplicity
  editDialog.value = true
}
</script>
