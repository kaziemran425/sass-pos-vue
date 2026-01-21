<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">SaaS Overview</div>
      <q-space />
      <div class="text-caption text-grey">Last updated: Just now</div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-3" v-for="stat in stats" :key="stat.title">
        <q-card flat bordered class="rounded-borders">
          <q-card-section>
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-subtitle2 text-grey-7">{{ stat.title }}</div>
                <div class="text-h4 text-weight-bolder q-mt-sm">{{ stat.value }}</div>
              </div>
              <div class="col-auto">
                <q-avatar :color="stat.color" text-color="white" :icon="stat.icon" size="lg" />
              </div>
            </div>
            <div class="q-mt-md text-caption">
              <q-icon :name="stat.trendIcon" :color="stat.trendColor" />
              <span :class="'text-' + stat.trendColor">{{ stat.trend }}</span>
              vs last month
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-h6">Recent Tenant Signups</div>
            <q-space />
            <q-btn flat round icon="more_vert" />
          </q-card-section>
          <q-separator />
          <q-list separator>
            <q-item v-for="tenant in recentTenants" :key="tenant.id">
              <q-item-section avatar>
                <q-avatar rounded color="primary" text-color="white">{{ tenant.name.charAt(0) }}</q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-bold">{{ tenant.name }}</q-item-label>
                <q-item-label caption>{{ tenant.email }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-chip size="sm" :color="tenant.plan === 'Pro' ? 'orange' : 'blue'" text-color="white">
                  {{ tenant.plan }}
                </q-chip>
              </q-item-section>
              <q-item-section side>
                <div class="text-caption">{{ tenant.date }}</div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-primary text-white">
          <q-card-section>
            <div class="text-h6">System Status</div>
            <div class="text-subtitle2 q-mt-sm">All systems operational</div>
          </q-card-section>
          <q-card-section>
            <div class="row q-col-gutter-sm">
              <div class="col-6">
                <div class="text-h5">99.9%</div>
                <div class="text-caption">Uptime</div>
              </div>
              <div class="col-6">
                <div class="text-h5">24ms</div>
                <div class="text-caption">Latency</div>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref([
  { title: 'Total Revenue', value: '$45,200', icon: 'attach_money', color: 'green-5', trend: '+12%', trendIcon: 'trending_up', trendColor: 'green' },
  { title: 'Active Shops', value: '124', icon: 'store', color: 'blue-5', trend: '+5', trendIcon: 'trending_up', trendColor: 'green' },
  { title: 'Pending Requests', value: '8', icon: 'pending', color: 'orange-5', trend: '-2', trendIcon: 'trending_down', trendColor: 'orange' },
  { title: 'Total Users', value: '1,204', icon: 'group', color: 'purple-5', trend: '+18%', trendIcon: 'trending_up', trendColor: 'green' }
])

const recentTenants = ref([
  { id: 1, name: 'Burger King Bashundhara', email: 'manager@bkbd.com', plan: 'Pro', date: '2 mins ago' },
  { id: 2, name: 'Fashion House', email: 'admin@fhouse.com', plan: 'Basic', date: '1 hour ago' },
  { id: 3, name: 'Dhaka Pharmacy', email: 'contact@dpharma.com', plan: 'Pro', date: '4 hours ago' },
  { id: 4, name: 'Cafe Rio', email: 'owner@caferio.com', plan: 'Basic', date: '1 day ago' },
])
</script>
