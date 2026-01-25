<template>
  <q-page class="q-pa-md bg-grey-2">

    <div class="row items-center justify-between q-mb-lg">
      <div>
        <div class="text-h5 text-weight-bold text-teal-5">Attendance Tracker</div>
        <div class="text-caption text-grey-7">Manage daily check-ins and work hours</div>
      </div>

      <div class="row items-center bg-white shadow-1 rounded-borders q-pa-xs">
        <q-btn flat round dense icon="chevron_left" color="grey-7" @click="changeDay(-1)" />

        <div class="q-mx-md cursor-pointer row items-center text-weight-bold text-blue-grey-9">
          <q-icon name="event" class="q-mr-sm text-primary" />
          {{ formattedDateDisplay }}
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate" mask="YYYY-MM-DD" minimal @update:model-value="loadData" />
          </q-popup-proxy>
        </div>

        <q-btn flat round dense icon="chevron_right" color="grey-7" @click="changeDay(1)" />
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-teal-5 full-height">
          <q-card-section class="row items-center">
            <q-avatar color="green-1" text-color="green-7" icon="check_circle" size="md" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ stats.present }}</div>
              <div class="text-caption text-white">Present Today</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-grey-4 full-height">
          <q-card-section class="row items-center">
            <q-avatar color="orange-1" text-color="orange-8" icon="access_time" size="md" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ stats.late }}</div>
              <div class="text-caption text-black">Late Arrivals (> 09:00)</div>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-orange-5 full-height">
          <q-card-section class="row items-center">
            <q-avatar color="grey-2" text-color="grey-7" icon="person_off" size="md" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ stats.absent }}</div>
              <div class="text-caption text-white">Absent</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered class="bg-white shadow-1">
      <q-table
        :rows="attendanceRows"
        :columns="columns"
        row-key="employeeId"
        flat
        :pagination="{ rowsPerPage: 10 }"
      >
        <template v-slot:body-cell-employee="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-avatar color="blue-1" text-color="blue-8" size="sm" class="q-mr-sm">
                {{ props.row.name.charAt(0) }}
              </q-avatar>
              <div class="text-weight-medium">{{ props.row.name }}</div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-checkIn="props">
          <q-td :props="props" align="center">
            <div v-if="props.row.checkIn" class="cursor-pointer">
              <q-badge :color="isLate(props.row.checkIn) ? 'orange' : 'green'" class="q-py-xs q-px-sm">
                {{ props.row.checkIn }}
                <q-tooltip>Click to Edit</q-tooltip>
              </q-badge>
              <q-popup-edit v-model="props.row.checkIn" v-slot="scope" @save="val => updateTime(props.row, 'in', val)">
                <q-time v-model="scope.value" mask="HH:mm" format24h dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </div>

            <q-btn v-else flat size="sm" color="grey-6" icon="login" label="Mark In" @click="markNow(props.row, 'in')" />
          </q-td>
        </template>

        <template v-slot:body-cell-checkOut="props">
          <q-td :props="props" align="center">
             <div v-if="props.row.checkOut" class="cursor-pointer">
              <q-badge color="blue-grey" class="q-py-xs q-px-sm">
                {{ props.row.checkOut }}
                <q-tooltip>Click to Edit</q-tooltip>
              </q-badge>
              <q-popup-edit v-model="props.row.checkOut" v-slot="scope" @save="val => updateTime(props.row, 'out', val)">
                <q-time v-model="scope.value" mask="HH:mm" format24h dense autofocus @keyup.enter="scope.set" />
              </q-popup-edit>
            </div>

            <q-btn v-else-if="props.row.checkIn" flat size="sm" color="grey-6" icon="logout" label="Mark Out" @click="markNow(props.row, 'out')" />
            <span v-else class="text-grey-4">-</span>
          </q-td>
        </template>

        <template v-slot:body-cell-hours="props">
          <q-td :props="props" align="center" class="text-weight-bold text-grey-8">
            {{ calculateDuration(props.row.checkIn, props.row.checkOut) }}
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props" align="right">
            <q-chip
              dense
              size="sm"
              :color="getStatusColor(props.row)"
              text-color="white"
              :icon="getStatusIcon(props.row)"
            >
              {{ getStatusLabel(props.row) }}
            </q-chip>
          </q-td>
        </template>
      </q-table>
    </q-card>

  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date, useQuasar } from 'quasar'

const $q = useQuasar()

// --- CONFIG ---
const SHIFT_START = '09:00' // Used to calculate "Late" status

// --- 1. Service Layer (Mock API) ---
const AttendanceService = {
  getEmployees() {
    const stored = localStorage.getItem('tenant_employees')
    return stored ? JSON.parse(stored) : [
      { id: 1, name: 'Alice Johnson' },
      { id: 2, name: 'Bob Smith' },
      { id: 3, name: 'Charlie Brown' },
      { id: 4, name: 'Diana Prince' }
    ]
  },
  getLogs(dateStr) {
    const allLogs = JSON.parse(localStorage.getItem('tenant_attendance') || '{}')
    return allLogs[dateStr] || []
  },
  saveLog(dateStr, logs) {
    const allLogs = JSON.parse(localStorage.getItem('tenant_attendance') || '{}')
    allLogs[dateStr] = logs
    localStorage.setItem('tenant_attendance', JSON.stringify(allLogs))
  }
}

// --- 2. State ---
const selectedDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'))
const allEmployees = ref([])
const todaysLogs = ref([]) // Array of logs for selectedDate

const columns = [
  { name: 'employee', label: 'Employee', align: 'left', sortable: true },
  { name: 'checkIn', label: 'Check In', align: 'center' },
  { name: 'checkOut', label: 'Check Out', align: 'center' },
  { name: 'hours', label: 'Work Hours', align: 'center' },
  { name: 'status', label: 'Status', align: 'right' },
]

// --- 3. Computed Logic ---

// Merges Employee List + Attendance Data for the table
const attendanceRows = computed(() => {
  return allEmployees.value.map(emp => {
    const log = todaysLogs.value.find(l => l.empId === emp.id) || {}
    return {
      employeeId: emp.id,
      name: emp.name,
      checkIn: log.checkIn || null,
      checkOut: log.checkOut || null
    }
  })
})

const formattedDateDisplay = computed(() => {
  const d = date.extractDate(selectedDate.value, 'YYYY-MM-DD')
  return date.formatDate(d, 'ddd, MMM Do YYYY')
})

const stats = computed(() => {
  let present = 0, late = 0, absent = 0

  attendanceRows.value.forEach(row => {
    if (!row.checkIn) {
      absent++
    } else {
      present++
      if (row.checkIn > SHIFT_START) late++
    }
  })
  return { present, late, absent }
})

// --- 4. Helper Functions ---

// Returns true if time is after 09:00
const isLate = (timeStr) => {
  if (!timeStr) return false
  return timeStr > SHIFT_START
}

const calculateDuration = (inTime, outTime) => {
  if (!inTime || !outTime) return '--:--'
  const d1 = date.extractDate(inTime, 'HH:mm')
  const d2 = date.extractDate(outTime, 'HH:mm')
  const diff = date.getDateDiff(d2, d1, 'minutes')

  if (diff < 0) return 'Error' // Handle overnight or errors

  const h = Math.floor(diff / 60)
  const m = diff % 60
  return `${h}h ${m}m`
}

const getStatusLabel = (row) => {
  if (!row.checkIn) return 'Absent'
  if (isLate(row.checkIn)) return 'Late'
  return 'On Time'
}

const getStatusColor = (row) => {
  if (!row.checkIn) return 'grey-5'
  if (isLate(row.checkIn)) return 'orange-7'
  return 'green-7'
}

const getStatusIcon = (row) => {
  if (!row.checkIn) return 'person_off'
  if (isLate(row.checkIn)) return 'warning'
  return 'check'
}

// --- 5. Actions ---

const loadData = () => {
  allEmployees.value = AttendanceService.getEmployees()
  todaysLogs.value = AttendanceService.getLogs(selectedDate.value)
}

// Handles Previous/Next Day buttons
const changeDay = (days) => {
  const current = date.extractDate(selectedDate.value, 'YYYY-MM-DD')
  const newDate = date.addToDate(current, { days })
  selectedDate.value = date.formatDate(newDate, 'YYYY-MM-DD')
  loadData()
}

// "Mark In/Out" Button Click
const markNow = (row, type) => {
  const now = date.formatDate(Date.now(), 'HH:mm')
  updateTime(row, type, now)
}

// Saving logic (Used by both Buttons and Edit Popup)
const updateTime = (row, type, timeValue) => {
  // 1. Find or Create Log Entry
  let logEntry = todaysLogs.value.find(l => l.empId === row.employeeId)

  if (!logEntry) {
    logEntry = { empId: row.employeeId }
    todaysLogs.value.push(logEntry)
  }

  // 2. Update Value
  if (type === 'in') logEntry.checkIn = timeValue
  if (type === 'out') logEntry.checkOut = timeValue

  // 3. Persist
  AttendanceService.saveLog(selectedDate.value, todaysLogs.value)

  // 4. Force UI Refresh (Optional, handled by reactivity usually)
  // loadData()
  $q.notify({ type: 'positive', message: 'Attendance Updated', timeout: 500 })
}

onMounted(() => {
  loadData()
})
</script>
