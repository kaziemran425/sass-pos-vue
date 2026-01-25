<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold q-pa-md text-teal-5">
        Product Inventory
      </div>
      <q-space />
      <q-btn
        color="teal-5"
        icon="add"
        label="Add Product"
        dense
        @click="openDialog()"
      />
    </div>

    <q-card flat bordered>
      <q-table
        :rows="products"
        :columns="columns"
        row-key="id"
        :filter="filter"
        flat
      >
        <template v-slot:top-right>
          <q-input
            dense
            debounce="300"
            v-model="filter"
            :dense
            outlined
            placeholder="Search products"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>

        <template v-slot:body-cell-image="props">
          <q-td :props="props">
            <q-avatar rounded size="40px" color="grey-3">
              <img v-if="props.row.image" :src="props.row.image" />
              <q-icon v-else name="inventory_2" color="grey" />
            </q-avatar>
          </q-td>
        </template>

        <template v-slot:body-cell-stock="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.stock < 10 ? 'red-1' : 'green-1'"
              :text-color="props.row.stock < 10 ? 'red-8' : 'green-8'"
              size="sm"
            >
              {{ props.row.stock }} Units
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" align="right">
            <q-btn
              flat
              round
              color="grey"
              icon="edit"
              size="sm"
              @click="openDialog(props.row)"
            />
            <q-btn
              flat
              round
              color="negative"
              icon="delete"
              size="sm"
              @click="deleteProduct(props.row.id)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>

    <q-dialog v-model="dialog">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ isEdit ? "Edit Product" : "New Product" }}
          </div>
        </q-card-section>

        <q-card-section class="q-gutter-y-md">
          <q-input outlined v-model="form.name" label="Product Name" />
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input outlined v-model="form.sku" label="SKU / Barcode" />
            </div>
            <div class="col-6">
              <q-select
                outlined
                v-model="form.category"
                :options="['Electronics', 'Groceries', 'Clothing']"
                label="Category"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model.number="form.price"
                label="Selling Price"
                prefix="$"
                type="number"
              />
            </div>
            <div class="col-6">
              <q-input
                outlined
                v-model.number="form.cost"
                label="Cost Price"
                prefix="$"
                type="number"
              />
            </div>
          </div>
          <q-input
            outlined
            v-model.number="form.stock"
            label="Current Stock"
            type="number"
          />
        </q-card-section>

        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="Save Product" @click="saveProduct" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { useQuasar } from "quasar";

const $q = useQuasar();
const filter = ref("");
const dialog = ref(false);
const isEdit = ref(false);
const products = ref([]);

// Table Columns
const columns = [
  { name: "image", label: "", field: "image", align: "center" },
  {
    name: "name",
    label: "Product Name",
    field: "name",
    align: "left",
    sortable: true,
  },
  { name: "sku", label: "SKU", field: "sku", align: "left" },
  {
    name: "category",
    label: "Category",
    field: "category",
    align: "left",
    sortable: true,
  },
  {
    name: "price",
    label: "Price",
    field: "price",
    format: (val) => `$${val}`,
    sortable: true,
  },
  {
    name: "stock",
    label: "Stock",
    field: "stock",
    align: "center",
    sortable: true,
  },
  { name: "actions", label: "Actions", field: "actions", align: "right" },
];

// Form State
const defaultForm = {
  id: null,
  name: "",
  sku: "",
  category: "",
  price: 0,
  cost: 0,
  stock: 0,
  image: "",
};
const form = reactive({ ...defaultForm });

// Load Data
onMounted(() => {
  const stored = localStorage.getItem("tenant_products");
  if (stored) {
    products.value = JSON.parse(stored);
  } else {
    // Static Mock Data
    products.value = [
      {
        id: 1,
        name: "Wireless Mouse",
        sku: "WM-001",
        category: "Electronics",
        price: 25,
        cost: 15,
        stock: 45,
        image: "",
      },
      {
        id: 2,
        name: "Cotton T-Shirt",
        sku: "TS-BLK-M",
        category: "Clothing",
        price: 12,
        cost: 5,
        stock: 8,
        image: "",
      },
    ];
  }
});

// Actions
const openDialog = (row = null) => {
  isEdit.value = !!row;
  if (row) Object.assign(form, row);
  else Object.assign(form, { ...defaultForm, id: Date.now() }); // Generate ID
  dialog.value = true;
};

const saveProduct = () => {
  if (isEdit.value) {
    const index = products.value.findIndex((p) => p.id === form.id);
    products.value[index] = { ...form };
  } else {
    products.value.push({ ...form });
  }
  localStorage.setItem("tenant_products", JSON.stringify(products.value));
  $q.notify({ type: "positive", message: "Product saved successfully!" });
};

const deleteProduct = (id) => {
  $q.dialog({
    title: "Confirm",
    message: "Delete this product?",
    cancel: true,
  }).onOk(() => {
    products.value = products.value.filter((p) => p.id !== id);
    localStorage.setItem("tenant_products", JSON.stringify(products.value));
  });
};
</script>
