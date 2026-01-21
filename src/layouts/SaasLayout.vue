<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-blue-grey-9 text-white">
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>SaaS Super Admin</q-toolbar-title>
        <q-btn flat round dense icon="logout" to="/login" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <q-list class="q-mt-md">
        <q-item-label header>ADMINISTRATION</q-item-label>

        <q-item clickable v-ripple to="/saas/dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/saas/tenants">
          <q-item-section avatar><q-icon name="store" /></q-item-section>
          <q-item-section>Tenants</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/saas/subscriptions">
          <q-item-section avatar><q-icon name="card_membership" /></q-item-section>
          <q-item-section>Subscriptions</q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/saas/settings">
          <q-item-section avatar><q-icon name="settings" /></q-item-section>
          <q-item-section>Settings</q-item-section>
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
