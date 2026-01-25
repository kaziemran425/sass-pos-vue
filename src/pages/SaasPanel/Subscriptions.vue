<template>
  <q-page class="q-pa-md bg-grey-1">

    <div class="text-center q-mb-xl q-pt-md">
      <div class="text-h4 text-weight-bolder text-blue-grey-9">Choose Your Plan</div>
      <div class="text-subtitle1 text-grey-7 q-mt-sm">
        Flexible pricing for teams of any size. No hidden fees.
      </div>
    </div>

    <div class="row q-col-gutter-lg justify-center items-center">

      <div
        v-for="plan in plans"
        :key="plan.id"
        class="col-12 col-md-4 col-lg-3 transition-generic"
        :class="{ 'scale-up': plan.isPopular }"
      >
        <q-card
          class="column full-height rounded-borders"
          :class="plan.isPopular ? 'bg-indigo-7 text-white shadow-15' : 'bg-white text-grey-9 shadow-2'"
        >
          <div v-if="plan.isPopular" class="absolute-top-right q-pa-sm">
            <q-badge color="orange" text-color="black" label="MOST POPULAR" class="text-weight-bold shadow-2" />
          </div>

          <q-card-section class="text-center q-pt-lg">
            <div class="text-overline text-weight-bold opacity-80">{{ plan.name }}</div>
            <div class="text-h2 text-weight-bolder q-mt-sm">
              <span class="text-h5" style="vertical-align: top; position: relative; top: 10px">$</span>
              {{ plan.price }}
              <span class="text-body1 text-weight-medium opacity-70">/mo</span>
            </div>
            <div class="text-caption q-mt-sm opacity-70">Billed monthly</div>
          </q-card-section>

          <q-separator :dark="plan.isPopular" inset />

          <q-card-section class="col q-py-md q-px-lg">
            <q-list dense>
              <q-item v-for="(feature, i) in plan.features" :key="i" class="q-py-sm">
                <q-item-section avatar style="min-width: 30px">
                  <q-icon name="check_circle" :color="plan.isPopular ? 'orange' : 'green-6'" size="sm" />
                </q-item-section>
                <q-item-section class="text-weight-medium">
                  {{ feature }}
                </q-item-section>
              </q-item>
            </q-list>
          </q-card-section>

          <q-card-actions align="center" class="q-pb-lg q-px-lg">
            <q-btn
              :color="plan.isPopular ? 'white' : 'indigo-7'"
              :text-color="plan.isPopular ? 'indigo-9' : 'white'"
              :outline="!plan.isPopular"
              label="Edit Plan Details"
              class="full-width text-weight-bold"
              rounded
              padding="10px 0"
              unelevated
              @click="openEditDialog(plan)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-indigo-7 text-white row items-center">
          <div class="text-h6">Edit {{ form.name }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md q-gutter-md">
          <q-input
            filled
            v-model.number="form.price"
            label="Monthly Price"
            prefix="$"
            type="number"
            color="indigo"
          />

          <q-input
            filled
            v-model="form.name"
            label="Plan Name"
            color="indigo"
          />

          <div class="bg-grey-2 q-pa-sm rounded-borders">
            <q-toggle
              v-model="form.isPopular"
              label="Mark as 'Most Popular' Plan"
              color="orange"
              left-label
            />
          </div>

          <div class="text-caption text-grey-6">
            * Note: Features editing is disabled in this demo.
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-primary bg-grey-1">
          <q-btn flat label="Cancel" color="grey" v-close-popup />
          <q-btn label="Save Changes" color="indigo" unelevated @click="savePlan" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// --- State ---
const plans = ref([])
const showDialog = ref(false)
const form = ref({}) // Holds the temporary data being edited

// --- Service Layer (Mock API / LocalStorage) ---
const PlanService = {
  KEY: 'tenant_pricing_plans',
  getAll() {
    const stored = localStorage.getItem(this.KEY)
    if (stored) return JSON.parse(stored)
    // Default Data
    return [
      {
        id: 1,
        name: 'Starter',
        price: 0,
        features: ['1 Shop Integration', '500 Products', 'Community Support', 'Basic Analytics'],
        isPopular: false
      },
      {
        id: 2,
        name: 'Professional',
        price: 49,
        features: ['5 Shops Integration', 'Unlimited Products', 'Priority Email Support', 'Advanced Analytics', 'Team Access (3 Users)'],
        isPopular: true
      },
      {
        id: 3,
        name: 'Enterprise',
        price: 199,
        features: ['Unlimited Shops', 'Unlimited Products', '24/7 Phone Support', 'Dedicated Manager', 'Custom API Access'],
        isPopular: false
      }
    ]
  },
  save(data) {
    localStorage.setItem(this.KEY, JSON.stringify(data))
  }
}

// --- Initialization ---
onMounted(() => {
  plans.value = PlanService.getAll()
})

// --- Actions ---

const openEditDialog = (plan) => {
  // Create a Shallow Copy:
  // This prevents the UI card from updating while typing in the popup.
  // Updates only happen on "Save".
  form.value = { ...plan }
  showDialog.value = true
}

const savePlan = () => {
  // 1. Find index of plan being edited
  const index = plans.value.findIndex(p => p.id === form.value.id)

  if (index !== -1) {
    // 2. Logic: Ensure only one plan is marked 'Popular' if the user checked it
    if (form.value.isPopular) {
      plans.value.forEach(p => p.isPopular = false)
    }

    // 3. Update the plan
    plans.value[index] = { ...form.value }

    // 4. Save to Storage
    PlanService.save(plans.value)

    $q.notify({ type: 'positive', message: 'Plan updated successfully' })
    showDialog.value = false
  }
}
</script>

<style scoped>
/* Smooth Transition for hover effects */
.transition-generic {
  transition: all 0.3s ease-in-out;
}

/* Scaling Effect for the Popular Plan */
.scale-up {
  transform: scale(1.08);
  z-index: 10;
}

/* Adjust scale on smaller screens so it doesn't break layout */
@media (max-width: 1023px) {
  .scale-up {
    transform: scale(1);
    margin-bottom: 20px;
  }
}

.opacity-80 { opacity: 0.8; }
.opacity-70 { opacity: 0.7; }
.shadow-15 { box-shadow: 0 4px 25px 0 rgba(0,0,0,0.15); }
</style>
