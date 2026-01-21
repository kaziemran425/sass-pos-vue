<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Roles & Permissions</div>
      <q-space />
      <q-btn color="primary" icon="add" label="Create Role" unelevated @click="promptAdd" />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-6" v-for="role in roles" :key="role.id">
        <q-card flat bordered>
          <q-card-section class="row items-center">
            <div class="text-h6">{{ role.name }}</div>
            <q-space />
            <q-btn flat round icon="delete" color="grey" size="sm" @click="deleteRole(role.id)" v-if="role.name !== 'Admin'" />
          </q-card-section>

          <q-separator />

          <q-card-section>
            <div class="text-caption text-grey q-mb-sm">ACCESS PERMISSIONS</div>
            <div class="row">
              <div class="col-6" v-for="(val, key) in role.permissions" :key="key">
                <q-toggle
                  v-model="role.permissions[key]"
                  :label="formatLabel(key)"
                  dense
                  color="green"
                  @update:model-value="saveRoles"
                />
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const roles = ref([])

// Default permission set for new roles
const defaultPermissions = {
  pos_access: false,
  inventory_manage: false,
  view_reports: false,
  manage_staff: false,
  settings_access: false,
  process_refunds: false
}

onMounted(() => {
  const stored = localStorage.getItem('tenant_roles')
  if (stored) {
    roles.value = JSON.parse(stored)
  } else {
    // Static Initial Data
    roles.value = [
      {
        id: 1,
        name: 'Manager',
        permissions: { pos_access: true, inventory_manage: true, view_reports: true, manage_staff: true, settings_access: false, process_refunds: true }
      },
      {
        id: 2,
        name: 'Cashier',
        permissions: { pos_access: true, inventory_manage: false, view_reports: false, manage_staff: false, settings_access: false, process_refunds: false }
      }
    ]
  }
})

const saveRoles = () => {
  localStorage.setItem('tenant_roles', JSON.stringify(roles.value))
}

const formatLabel = (key) => {
  return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const promptAdd = () => {
  $q.dialog({
    title: 'New Role',
    message: 'Role Name (e.g., Shift Lead):',
    prompt: { model: '', type: 'text' },
    cancel: true
  }).onOk(name => {
    roles.value.push({
      id: Date.now(),
      name: name,
      permissions: { ...defaultPermissions }
    })
    saveRoles()
  })
}

const deleteRole = (id) => {
  roles.value = roles.value.filter(r => r.id !== id)
  saveRoles()
}
</script>
