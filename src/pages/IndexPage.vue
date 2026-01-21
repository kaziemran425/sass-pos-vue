<template>
  <q-page class="bg-white">

    <div class="hero-section bg-primary text-white q-pb-xl relative-position">
      <div class="container q-pa-md">
        <div class="row items-center q-col-gutter-xl reverse-wrap">

          <div class="col-12 col-md-6 text-center text-md-left">
            <q-badge color="orange" label="v2.0 Released" class="q-mb-md" />
            <h1 class="text-h2 text-weight-bolder q-mt-none q-mb-md leading-tight">
              The Ultimate SaaS <br> POS Solution
            </h1>
            <p class="text-h6 text-blue-2 q-mb-lg">
              Manage inventory, sales, and staff across multiple locations.
              Built for retail, restaurants, and pharmacy businesses.
            </p>
            <div class="row q-gutter-md justify-center justify-md-start">
              <q-btn
                to="/login"
                size="lg"
                color="white"
                text-color="primary"
                label="Get Started"
                icon-right="arrow_forward"
                unelevated
                no-caps
                class="text-weight-bold"
              />
              <q-btn
                to="/saas/dashboard"
                size="lg"
                outline
                color="white"
                label="Super Admin Demo"
                no-caps
              />
            </div>
          </div>

          <div class="col-12 col-md-6 text-center">
            <q-img
              src="https://cdn.quasar.dev/img/layout-gallery/youtube-sidebar.png"
              class="hero-image shadow-20 rounded-borders"
              style="border: 8px solid rgba(255,255,255,0.2);"
            />
          </div>
        </div>
      </div>

      <div class="custom-shape-divider-bottom-1678901234">
        <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
        </svg>
      </div>
    </div>

    <div class="container q-py-xl q-pa-md">
      <div class="text-center q-mb-xl">
        <div class="text-overline text-primary">POWERFUL FEATURES</div>
        <div class="text-h4 text-weight-bold">Everything you need to run your shop</div>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-sm-6 col-md-4" v-for="feature in features" :key="feature.title">
          <q-card flat bordered class="h-full hover-lift">
            <q-card-section>
              <q-avatar :color="feature.color + '-1'" :text-color="feature.color" size="lg" class="q-mb-md">
                <q-icon :name="feature.icon" />
              </q-avatar>
              <div class="text-h6 text-weight-bold">{{ feature.title }}</div>
              <div class="text-grey-7 q-mt-sm">{{ feature.desc }}</div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <div class="bg-grey-2 q-py-xl">
      <div class="container q-pa-md">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-5">
            <div class="text-h4 text-weight-bold q-mb-md">Setup in minutes, <br>not days.</div>
            <p class="text-body1 text-grey-8">Our POS is designed for simplicity. You don't need an IT team to get started.</p>

            <q-list class="q-mt-lg">
              <q-item v-for="(step, i) in steps" :key="i">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="sm">{{ i + 1 }}</q-avatar>
                </q-item-section>
                <q-item-section class="text-weight-medium">{{ step }}</q-item-section>
              </q-item>
            </q-list>
          </div>
          <div class="col-12 col-md-7">
             <q-card class="bg-dark text-white shadow-10">
               <q-card-section class="row items-center">
                 <div class="row q-gutter-sm">
                   <div class="bg-red rounded-circle" style="width:12px;height:12px;"></div>
                   <div class="bg-yellow rounded-circle" style="width:12px;height:12px;"></div>
                   <div class="bg-green rounded-circle" style="width:12px;height:12px;"></div>
                 </div>
                 <q-space />
                 <div class="text-caption text-grey">pos.dashboard.com</div>
               </q-card-section>
               <q-separator color="grey-8" />
               <div class="q-pa-xl text-center">
                 <q-icon name="speed" size="100px" color="primary" />
                 <div class="text-h5 q-mt-md">Real-time Analytics</div>
               </div>
             </q-card>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-dark text-white text-center q-py-xl">
      <div class="container q-pa-md">
        <div class="text-h4 text-weight-bold q-mb-md">Ready to grow your business?</div>
        <p class="text-grey-5 q-mb-xl text-h6">Start your 14-day free trial today. No credit card required.</p>
        <q-btn
          to="/login"
          color="primary"
          size="xl"
          label="Start Free Trial"
          no-caps
          unelevated
          class="q-px-xl"
        />
        <div class="q-mt-xl text-grey-7">
          &copy; 2026 SaaS POS System. All rights reserved.
        </div>
      </div>
    </div>

  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'IndexPage',
  setup() {
    return {
      features: ref([
        { title: 'Cloud Inventory', desc: 'Track stock in real-time across multiple warehouses.', icon: 'inventory_2', color: 'blue' },
        { title: 'Offline POS', desc: 'Keep selling even when the internet goes down.', icon: 'wifi_off', color: 'purple' },
        { title: 'Employee Mgmt', desc: 'Track attendance, shifts, and performance.', icon: 'badge', color: 'orange' },
        { title: 'Multi-Store', desc: 'Manage all your branches from one single dashboard.', icon: 'store', color: 'green' },
        { title: 'Detailed Reports', desc: 'Gain insights into sales, profit, and trends.', icon: 'insights', color: 'red' },
        { title: 'Customer CRM', desc: 'Build loyalty with customer profiles and history.', icon: 'groups', color: 'teal' },
      ]),
      steps: ref([
        'Register your account',
        'Add your products or import CSV',
        'Start selling instantly'
      ])
    }
  }
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-section {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.leading-tight {
  line-height: 1.1;
}

/* SVG Wave */
.custom-shape-divider-bottom-1678901234 {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-bottom-1678901234 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 60px;
}

.custom-shape-divider-bottom-1678901234 .shape-fill {
    fill: #FFFFFF;
}

/* Card Hover Effect */
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

/* Responsive adjustments */
@media (max-width: 1023px) {
  .reverse-wrap {
    flex-direction: column-reverse;
  }
}
</style>
