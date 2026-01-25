<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-teal-9">
          Category Management
        </div>
        <div class="text-caption text-grey-7">
          Organize your product hierarchy
        </div>
      </div>
      <q-space />
      <q-btn
        color="teal-7"
        icon="add"
        label="Add Category"
        class="shadow-2"
        dense
        no-caps
        @click="openDialog()"
      />
    </div>

    <div class="row q-col-gutter-md">
      <div class="col-12 col-md-8 offset-md-2">
        <q-card flat bordered class="bg-white rounded-borders shadow-1">
          <q-list separator>
            <q-expansion-item
              v-for="cat in categories"
              :key="cat.id"
              group="categories"
              header-class="text-weight-bold text-grey-9 hover-effect"
              expand-icon-class="text-teal-7"
            >
              <template v-slot:header>
                <q-item-section avatar>
                  <q-avatar
                    color="teal-1"
                    text-color="teal-8"
                    icon="folder"
                    size="md"
                    font-size="22px"
                  />
                </q-item-section>
                <q-item-section>
                  <q-item-label>{{ cat.name }}</q-item-label>
                  <q-item-label caption
                    >{{
                      cat.subCategories?.length || 0
                    }}
                    Sub-categories</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-btn
                    flat
                    round
                    dense
                    icon="edit"
                    color="grey-6"
                    @click.stop="openDialog(cat)"
                  />
                </q-item-section>
              </template>

              <q-card class="bg-grey-1 sub-cat-container">
                <q-card-section class="q-pa-none">
                  <q-list dense padding>
                    <q-item
                      v-for="sub in cat.subCategories"
                      :key="sub.id"
                      class="q-pl-xl"
                    >
                      <q-item-section avatar style="min-width: 40px">
                        <q-icon
                          name="subdirectory_arrow_right"
                          color="grey-5"
                        />
                      </q-item-section>
                      <q-item-section>{{ sub.name }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </q-list>
        </q-card>
      </div>
    </div>

    <q-dialog v-model="showDialog">
      <q-card style="min-width: 400px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">
            {{ isEditMode ? "Edit Category" : "Add New Category" }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <q-form @submit="saveCategory" class="q-gutter-md">
            <q-input
              filled
              v-model="form.name"
              label="Category Name"
              :rules="[(val) => !!val || 'Name is required']"
              autofocus
            />

            <q-select
              filled
              v-model="form.parentId"
              :options="parentOptions"
              label="Parent Category (Optional)"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              clearable
              hint="Leave empty to create a Main Category"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section avatar>
                    <q-icon name="folder" color="teal" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>

            <div class="row justify-end q-mt-lg">
              <q-btn
                label="Cancel"
                color="grey-7"
                flat
                v-close-popup
                class="q-mr-sm"
              />
              <q-btn
                :label="isEditMode ? 'Update' : 'Create'"
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
import { ref, computed, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();

// --- State ---
const categories = ref([]);
const showDialog = ref(false);
const isEditMode = ref(false);

// Form State
const form = ref({
  id: null,
  name: "",
  parentId: null,
});

// --- Computed Options for Dropdown ---
// We map existing main categories to be selectable parents
const parentOptions = computed(() => {
  return categories.value.map((c) => ({ id: c.id, name: c.name }));
});

// --- Actions ---

const openDialog = (categoryToEdit = null) => {
  if (categoryToEdit) {
    // Edit Mode (Not fully implemented in this snippet, but structure is here)
    isEditMode.value = true;
    form.value = { ...categoryToEdit, parentId: null };
  } else {
    // Add Mode
    isEditMode.value = false;
    form.value = { id: null, name: "", parentId: null };
  }
  showDialog.value = true;
};

const saveCategory = () => {
  if (!form.value.name) return;

  if (form.value.parentId) {
    // === LOGIC A: Add as SUB-CATEGORY ===
    const parent = categories.value.find((c) => c.id === form.value.parentId);

    if (parent) {
      if (!parent.subCategories) parent.subCategories = [];

      parent.subCategories.push({
        id: Date.now(),
        name: form.value.name,
      });

      $q.notify({
        type: "positive",
        message: `Added to ${parent.name}`,
        icon: "subdirectory_arrow_right",
      });
    }
  } else {
    // === LOGIC B: Add as MAIN CATEGORY ===
    categories.value.push({
      id: Date.now(),
      name: form.value.name,
      subCategories: [],
    });

    $q.notify({
      type: "positive",
      message: "Main Category Created",
      icon: "check",
    });
  }

  // Save & Close
  localStorage.setItem(
    "tenant_categories_v2",
    JSON.stringify(categories.value),
  );
  showDialog.value = false;
};

// --- Init Data ---
onMounted(() => {
  const stored = localStorage.getItem("tenant_categories_v2");
  if (stored) categories.value = JSON.parse(stored);
  else
    categories.value = [
      { id: 1, name: "Electronics", subCategories: [] },
      { id: 2, name: "Groceries", subCategories: [] },
    ];
});
</script>

<style scoped>
.hover-effect:hover {
  background-color: #f0fdfa;
}
.sub-cat-container {
  border-top: 1px solid #e0e0e0;
  box-shadow: inset 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}
</style>
