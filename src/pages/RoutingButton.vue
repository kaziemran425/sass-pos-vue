<template>
  <div class="q-pa-md">
    <q-card class="my-card q-py-md " style="max-width: 400px; margin: 0 auto">

      <div class="q-pa-md text-center column q-gutter-y-md">

        <q-btn
          label="Tenant Dashboard"
          color="primary"
          to="/tenant/dashboard"
          unelevated
        />

        <q-btn
          label="POS Terminal"
          color="secondary"
          to="/pos/"
          unelevated
        />

        <q-btn
          label="Super Admin Dashboard"
          color="dark"
          to="/saas/dashboard"
          unelevated
        />

      </div>
    </q-card>
  </div>
</template>

<script setup>
</script>
