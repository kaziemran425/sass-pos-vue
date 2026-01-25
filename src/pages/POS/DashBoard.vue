<template>
  <q-page class="q-pa-md bg-grey-1">

    <div class="row items-center justify-between q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-blue-grey-9">Dashboard Overview</div>
        <div class="text-caption text-grey-7">Welcome back! Here is what's happening today.</div>
      </div>
      <div class="text-right">
        <div class="text-subtitle1 text-weight-bold text-primary">{{ currentDate }}</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-sm-6 col-md-3" v-for="stat in stats" :key="stat.label">
        <q-card flat bordered class="rounded-borders">
          <q-card-section class="row items-center q-pa-md">
            <q-avatar :color="stat.color + '-1'" :text-color="stat.color" size="lg" :icon="stat.icon" class="q-mr-md" />
            <div>
              <div class="text-h5 text-weight-bold">{{ stat.value }}</div>
              <div class="text-caption text-grey-7">{{ stat.label }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-h6 text-weight-bold">Recent Orders</div>
            <q-space />
            <q-btn flat dense color="primary" label="View All" to="/tenant/sales/history" />
          </q-card-section>

          <q-separator />

          <q-table
            :rows="recentOrders"
            :columns="orderColumns"
            row-key="id"
            flat
            hide-bottom
            :pagination="{ rowsPerPage: 5 }"
          >
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge :color="props.row.status === 'Completed' ? 'green' : 'orange'">
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-white q-mb-md">
          <q-card-section>
            <div class="text-subtitle1 text-weight-bold">Quick Actions</div>
          </q-card-section>
          <q-list separator>
            <q-item clickable v-ripple to="/pos" class="text-primary">
              <q-item-section avatar><q-icon name="point_of_sale" /></q-item-section>
              <q-item-section>Open POS Terminal</q-item-section>
              <q-item-section side><q-icon name="chevron_right" /></q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/tenant/inventory/products">
              <q-item-section avatar><q-icon name="add_box" /></q-item-section>
              <q-item-section>Add Product</q-item-section>
            </q-item>
            <q-item clickable v-ripple to="/tenant/hrm/attendance">
              <q-item-section avatar><q-icon name="schedule" /></q-item-section>
              <q-item-section>Staff Attendance</q-item-section>
            </q-item>
          </q-list>
        </q-card>

        <q-card flat bordered class="bg-red-1">
          <q-card-section>
            <div class="text-subtitle2 text-red-9 row items-center">
              <q-icon name="warning" class="q-mr-sm" /> Low Stock Alerts
            </div>
            <div class="q-mt-sm">
              <div v-for="item in lowStock" :key="item.name" class="row justify-between q-mb-xs">
                <span class="text-grey-8">{{ item.name }}</span>
                <span class="text-weight-bold text-red-8">{{ item.qty }} left</span>
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
import { date } from 'quasar'

const currentDate = date.formatDate(Date.now(), 'dddd, DD MMMM YYYY')

const stats = [
  { label: 'Total Sales', value: '$1,240', icon: 'payments', color: 'green' },
  { label: 'Orders', value: '34', icon: 'receipt', color: 'blue' },
  { label: 'Customers', value: '12', icon: 'group', color: 'orange' },
  { label: 'Products', value: '1,043', icon: 'inventory', color: 'purple' },
]

const recentOrders = [
  { id: '#1001', customer: 'Walk-in', amount: '$45.00', status: 'Completed' },
  { id: '#1002', customer: 'John Doe', amount: '$120.50', status: 'Pending' },
  { id: '#1003', customer: 'Sarah Smith', amount: '$15.00', status: 'Completed' },
]

const orderColumns = [
  { name: 'id', label: 'Order ID', field: 'id', align: 'left' },
  { name: 'customer', label: 'Customer', field: 'customer', align: 'left' },
  { name: 'amount', label: 'Amount', field: 'amount', align: 'right' },
  { name: 'status', label: 'Status', field: 'status', align: 'center' },
]

const lowStock = [
  { name: 'Wireless Mouse', qty: 2 },
  { name: 'USB Cable 3m', qty: 0 },
]
</script>
