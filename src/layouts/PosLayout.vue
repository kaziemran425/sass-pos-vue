<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-blue-grey-9 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>POS Super Admin</q-toolbar-title>
        <q-btn flat round dense icon="logout" to="/login" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list class="q-mt-md">
        <q-item-label header>ADMINISTRATION</q-item-label>

        <q-item clickable v-ripple to="/pos/dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pos/Terminal">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Terminal</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pos/held-orders">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Held Orders</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pos/shift">
          <q-item-section avatar><q-icon name="access_time" /></q-item-section>
          <q-item-section>Shift</q-item-section>
        </q-item>
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
