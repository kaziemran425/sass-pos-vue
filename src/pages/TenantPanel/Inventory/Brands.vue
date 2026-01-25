<template>
  <q-page class="q-pa-md bg-grey-2">

    <div class="row items-center q-mb-md">
      <div>
        <div class="text-h5 text-weight-bold text-teal-7">Brand Management</div>
        <div class="text-caption text-grey-7">Manage product brands and descriptions</div>
      </div>
      <q-space />
      <q-btn
        color="teal-7"
        icon="add"
        label="Add Brand"
        class="shadow-2"
        unelevated
        @click="openDialog()"
      />
    </div>

    <q-card flat bordered class="bg-white rounded-borders shadow-1">
      <q-table
        :rows="brands"
        :columns="columns"
        row-key="id"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn
              flat round dense
              color="primary"
              icon="edit"
              size="sm"
              class="q-mr-sm"
              @click="openDialog(props.row)"
            >
              <q-tooltip>Edit Brand</q-tooltip>
            </q-btn>
            <q-btn
              flat round dense
              color="negative"
              icon="delete"
              size="sm"
              @click="deleteBrand(props.row.id)"
            >
              <q-tooltip>Delete Brand</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-8 q-pa-md">
            <q-icon size="2em" name="sentiment_dissatisfied" />
            <span class="q-ml-sm">No brands found. Add one above!</span>
          </div>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="showDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card style="min-width: 400px">

        <q-card-section class="bg-teal-7 text-white row items-center">
          <div class="text-h6">{{ isEditMode ? 'Edit Brand' : 'New Brand' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-lg">
          <q-form @submit="saveBrand" class="q-gutter-md">

            <q-input
              filled
              v-model="form.name"
              label="Brand Name"
              :rules="[val => !!val || 'Name is required']"
              autofocus
              color="teal"
            />

            <q-input
              filled
              v-model="form.description"
              label="Description (Optional)"
              type="textarea"
              rows="3"
              color="teal"
            />

            <div class="row justify-end q-mt-md">
              <q-btn
                label="Cancel"
                color="grey-7"
                flat
                v-close-popup
                class="q-mr-sm"
              />
              <q-btn
                :label="isEditMode ? 'Update Brand' : 'Create Brand'"
                type="submit"
                color="teal-7"
                unelevated
              />
            </div>

          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

// --- State ---
const brands = ref([]);
const showDialog = ref(false);
const isEditMode = ref(false); // Helps us switch between Add and Edit logic

// The form object holds the data for the popup
const form = ref({
  id: null,
  name: "",
  description: ""
});

const columns = [
  { name: "name", label: "Brand Name", field: "name", align: "left", sortable: true },
  { name: "description", label: "Description", field: "description", align: "left" },
  { name: "actions", label: "Actions", field: "actions", align: "right" },
];

// --- Initialization ---
onMounted(() => {
  const stored = localStorage.getItem("tenant_brands");
  brands.value = stored
    ? JSON.parse(stored)
    : [
        { id: 1, name: "Nike", description: "Sportswear and shoes" },
        { id: 2, name: "Samsung", description: "Electronics and Smart devices" },
        { id: 3, name: "Nestle", description: "Food and Drink conglomerate" },
      ];
});

// --- Helper: Save to LocalStorage ---
const updateStorage = () => {
  localStorage.setItem("tenant_brands", JSON.stringify(brands.value));
};

// --- Action: Open Dialog ---
// If 'row' is passed, we are Editing. If null, we are Adding.
const openDialog = (row = null) => {
  if (row) {
    // Edit Mode: Copy data from the row into the form
    isEditMode.value = true;
    form.value = { ...row }; // Use spread operator (...) to create a copy, not a reference
  } else {
    // Add Mode: Reset the form
    isEditMode.value = false;
    form.value = { id: null, name: "", description: "" };
  }
  showDialog.value = true;
};

// --- Action: Save (Create or Update) ---
const saveBrand = () => {
  if (isEditMode.value) {
    // Logic for Updating
    const index = brands.value.findIndex(b => b.id === form.value.id);
    if (index !== -1) {
      brands.value[index] = { ...form.value }; // Update the item
      $q.notify({ type: "positive", message: "Brand updated successfully", icon: "update" });
    }
  } else {
    // Logic for Creating
    brands.value.push({
      id: Date.now(),
      name: form.value.name,
      description: form.value.description || "No description"
    });
    $q.notify({ type: "positive", message: "Brand created successfully", icon: "check_circle" });
  }

  updateStorage();
  showDialog.value = false; // Close popup
};

// --- Action: Delete ---
const deleteBrand = (id) => {
  $q.dialog({
    title: "Confirm Delete",
    message: "Are you sure you want to remove this brand?",
    cancel: true,
    persistent: true
  }).onOk(() => {
    brands.value = brands.value.filter((b) => b.id !== id);
    updateStorage();
    $q.notify({ type: "info", message: "Brand deleted" });
  });
};
</script>
