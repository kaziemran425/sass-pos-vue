<template>
  <q-layout>
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-lg shadow-2" style="width: 360px; max-width: 90vw;">

          <q-card-section class="text-center q-pb-none">
            <q-avatar size="56px" class="q-mb-sm bg-primary text-white">
              <q-icon name="point_of_sale" />
            </q-avatar>
            <div class="text-h5 text-weight-bold text-primary">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</div>
            <div class="text-caption text-grey">
              {{ isLogin ? 'Sign in to access your dashboard' : 'Register to manage your shop' }}
            </div>
          </q-card-section>

          <q-card-section class="q-gutter-y-md">

            <q-slide-transition>
              <div v-show="!isLogin">
                <q-input
                  outlined
                  v-model="form.name"
                  label="Full Name"
                  dense
                  lazy-rules
                  :rules="[val => val && val.length > 0 || 'Please enter your name']"
                >
                  <template v-slot:prepend><q-icon name="person" /></template>
                </q-input>
              </div>
            </q-slide-transition>

            <q-input
              outlined
              v-model="form.email"
              label="Email Address"
              type="email"
              dense
              lazy-rules
              :rules="[val => !!val || 'Email is required', isValidEmail]"
            >
              <template v-slot:prepend><q-icon name="email" /></template>
            </q-input>

            <q-input
              outlined
              v-model="form.password"
              label="Password"
              :type="showPassword ? 'text' : 'password'"
              dense
              lazy-rules
              :rules="[val => val && val.length >= 6 || 'Min 6 characters']"
            >
              <template v-slot:prepend><q-icon name="lock" /></template>
              <template v-slot:append>
                <q-icon
                  :name="showPassword ? 'visibility' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPassword = !showPassword"
                />
              </template>
            </q-input>

            <q-slide-transition>
              <div v-show="!isLogin">
                 <q-option-group
                  v-model="form.role"
                  :options="[
                    { label: 'Shop Owner', value: 'tenant' },
                    { label: 'Super Admin', value: 'admin' }
                  ]"
                  color="primary"
                  inline
                  dense
                />
              </div>
            </q-slide-transition>

          </q-card-section>

          <q-card-actions vertical class="q-pt-none">
            <q-btn
              unelevated
              color="primary"
              size="lg"
              class="full-width"
              :label="isLogin ? 'Login' : 'Register'"
              :loading="loading"
             to="/routing"

            />

            <div class="row justify-between items-center q-mt-md full-width">
              <q-btn flat dense no-caps label="Forgot Password?" color="grey-7" v-if="isLogin" size="sm" />
              <q-space />
              <div class="text-caption text-grey cursor-pointer hover-underline" @click="toggleAuthMode">
                {{ isLogin ? "New here? Create account" : "Already have an account? Login" }}
              </div>
            </div>
          </q-card-actions>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()

// State
const isLogin = ref(true)
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  name: '',
  email: '',
  password: '',
  role: 'tenant' // Default role
})

// Validation Helper
const isValidEmail = (val) => {
  const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(val) || 'Invalid email format';
}

// Toggle between Login and Register
const toggleAuthMode = () => {
  isLogin.value = !isLogin.value
  form.password = ''
  form.name = ''
}

// Handle Form Submission
const submitForm = () => {
  // Basic Validation Check
  if (!form.email || !form.password || (!isLogin.value && !form.name)) {
    $q.notify({ type: 'warning', message: 'Please fill in all required fields.' })
    return
  }

  loading.value = true

  // Simulate API Delay
  setTimeout(() => {
    loading.value = false

    if (isLogin.value) {
      handleLogin()
    } else {
      handleRegister()
    }
  }, 1000)
}

// Login Logic
const handleLogin = () => {
  const users = JSON.parse(localStorage.getItem('saas_users') || '[]')
  const user = users.find(u => u.email === form.email && u.password === form.password)

  if (user) {
    localStorage.setItem('active_user', JSON.stringify(user))
    $q.notify({ type: 'positive', message: `Welcome back, ${user.name}!` })

    if (user.role === 'admin') {
      router.push('/saas/dashboard')
    } else {
      router.push('/tenant/dashboard')
    }
  } else {
    $q.notify({ type: 'negative', message: 'Invalid email or password' })
  }
}

// Registration Logic
const handleRegister = () => {
  const users = JSON.parse(localStorage.getItem('saas_users') || '[]')

  if (users.find(u => u.email === form.email)) {
    $q.notify({ type: 'negative', message: 'Email already registered' })
    return
  }

  const newUser = {
    id: Date.now(),
    name: form.name,
    email: form.email,
    password: form.password,
    role: form.role,
    joined: new Date().toISOString()
  }

  users.push(newUser)
  localStorage.setItem('saas_users', JSON.stringify(users))
  localStorage.setItem('active_user', JSON.stringify(newUser))

  $q.notify({ type: 'positive', message: 'Account created successfully!' })

  if (newUser.role === 'admin') {
    router.push('/saas/dashboard')
  } else {
    router.push('/tenant/dashboard')
  }
}
</script>

<style scoped>
.hover-underline:hover {
  text-decoration: underline;
  color: var(--q-primary);
}
</style>
