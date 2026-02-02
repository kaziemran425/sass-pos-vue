<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>Shop Manager</q-toolbar-title>
        <q-space />
        <q-btn flat icon="point_of_sale" label="POS Terminal" to="/pos" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white">
      <q-list class="q-mt-sm">
        <q-item clickable v-ripple to="/tenant/dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-expansion-item icon="inventory_2" label="Inventory">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/inventory/products"><q-item-section>Products</q-item-section></q-item>
            <q-item clickable to="/tenant/inventory/categories"><q-item-section>Categories</q-item-section></q-item>
            <q-item clickable to="/tenant/inventory/brands"><q-item-section>Brands</q-item-section></q-item>
            <q-item clickable to="/tenant/inventory/labels"><q-item-section>BarCode Management</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="badge" label="HRM">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/hrm/employees"><q-item-section>Employees</q-item-section></q-item>
            <q-item clickable to="/tenant/hrm/roles"><q-item-section>Roles</q-item-section></q-item>
            <q-item clickable to="/tenant/hrm/attendance"><q-item-section>Attendance</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="receipt" label="Sales">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/sales/history"><q-item-section>History</q-item-section></q-item>
            <q-item clickable to="/tenant/sales/returns"><q-item-section>Returns</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="groups" label="People">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/customers"><q-item-section>Customers</q-item-section></q-item>
            <q-item clickable to="/tenant/suppliers"><q-item-section>Suppliers</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

          <q-expansion-item icon="report" label="Reports">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/report/profit"><q-item-section>Profit_Lose</q-item-section></q-item>
            <q-item clickable to="/tenant/report/sales"><q-item-section>Sales_Report</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

              <q-expansion-item icon="report" label="Finance">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/income"><q-item-section>Income</q-item-section></q-item>
            <q-item clickable to="/tenant/expenses"><q-item-section>Expenses</q-item-section></q-item>
          </q-list>
        </q-expansion-item>

        <q-expansion-item icon="settings" label="Settings">
          <q-list class="q-pl-md">
            <q-item clickable to="/tenant/settings/general"><q-item-section>General</q-item-section></q-item>
            <q-item clickable to="/tenant/settings/taxes"><q-item-section>Taxes</q-item-section></q-item>
          </q-list>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
