<template>
  <q-page class="q-pa-md bg-grey-2">
    <div class="row items-center q-mb-md">
      <div class="text-h5 text-weight-bold">Daily Attendance</div>
      <q-space />
      <div class="row items-center q-gutter-sm bg-white rounded-borders q-px-sm">
        <q-icon name="event" color="primary" />
        <div class="cursor-pointer">
          {{ selectedDate }}
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="selectedDate" mask="YYYY-MM-DD" @update:model-value="loadAttendance">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-4">
        <q-card flat bordered class="bg-green-1">
          <q-card-section>
            <div class="text-h4 text-green-9 text-weight-bold">{{ presentCount }}</div>
            <div class="text-caption text-green-9">Present Today</div>
          </q-card-section>
        </q-card>
      </div>
      <div class="col-12 col-md-4">
         <q-card flat bordered class="bg-red-1">
          <q-card-section>
            <div class="text-h4 text-red-9 text-weight-bold">{{ absentCount }}</div>
            <div class="text-caption text-red-9">Absent / Late</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-card flat bordered>
      <q-table
        :rows="attendanceRows"
        :columns="columns"
        row-key="employeeId"
        flat
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="employee" :props="props">
              <div class="text-weight-bold">{{ props.row.name }}</div>
            </q-td>

            <q-td key="checkIn" :props="props">
              <q-badge color="green" v-if="props.row.checkIn">
                {{ props.row.checkIn }}
              </q-badge>
              <q-btn v-else size="sm" flat color="grey" label="Mark In" @click="markTime(props.row, 'in')" />
            </q-td>

            <q-td key="checkOut" :props="props">
               <q-badge color="orange" v-if="props.row.checkOut">
                {{ props.row.checkOut }}
              </q-badge>
              <q-btn v-else-if="props.row.checkIn" size="sm" flat color="grey" label="Mark Out" @click="markTime(props.row, 'out')" />
              <span v-else class="text-grey">-</span>
            </q-td>

            <q-td key="hours" :props="props" class="text-weight-bold">
              {{ calculateHours(props.row.checkIn, props.row.checkOut) }}
            </q-td>

            <q-td key="status" :props="props">
               <q-chip size="sm" :color="props.row.checkIn ? 'green-1' : 'grey-3'">
                 {{ props.row.checkIn ? 'Present' : 'Absent' }}
               </q-chip>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { date } from 'quasar'

// Default to today formatted as YYYY-MM-DD
const selectedDate = ref(date.formatDate(Date.now(), 'YYYY-MM-DD'))
const allEmployees = ref([])
const attendanceData = ref({}) // Structure: { '2023-10-25': [ { empId: 1, checkIn: '09:00', checkOut: '17:00' } ] }

const columns = [
  { name: 'employee', label: 'Employee', align: 'left' },
  { name: 'checkIn', label: 'Check In', align: 'center' },
  { name: 'checkOut', label: 'Check Out', align: 'center' },
  { name: 'hours', label: 'Total Hours', align: 'center' },
  { name: 'status', label: 'Status', align: 'right' },
]

// Computed: Merge Employee List with Today's Attendance Data
const attendanceRows = computed(() => {
  const todaysLog = attendanceData.value[selectedDate.value] || []

  return allEmployees.value.map(emp => {
    const log = todaysLog.find(l => l.empId === emp.id) || {}
    return {
      employeeId: emp.id,
      name: emp.name,
      checkIn: log.checkIn || null,
      checkOut: log.checkOut || null
    }
  })
})

const presentCount = computed(() => attendanceRows.value.filter(r => r.checkIn).length)
const absentCount = computed(() => attendanceRows.value.length - presentCount.value)

onMounted(() => {
  // Load Employees
  const empStored = localStorage.getItem('tenant_employees')
  if (empStored) allEmployees.value = JSON.parse(empStored)
  else allEmployees.value = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }]

  // Load Attendance
  const attStored = localStorage.getItem('tenant_attendance')
  if (attStored) attendanceData.value = JSON.parse(attStored)
})

const saveAttendance = () => {
  localStorage.setItem('tenant_attendance', JSON.stringify(attendanceData.value))
}

const markTime = (row, type) => {
  if (!attendanceData.value[selectedDate.value]) {
    attendanceData.value[selectedDate.value] = []
  }

  let log = attendanceData.value[selectedDate.value].find(l => l.empId === row.employeeId)
  const nowTime = date.formatDate(Date.now(), 'HH:mm')

  if (!log) {
    log = { empId: row.employeeId }
    attendanceData.value[selectedDate.value].push(log)
  }

  if (type === 'in') log.checkIn = nowTime
  if (type === 'out') log.checkOut = nowTime

  saveAttendance()
}

const calculateHours = (inTime, outTime) => {
  if (!inTime || !outTime) return '-'

  // Simple calculation assuming same day
  const d1 = date.extractDate(inTime, 'HH:mm')
  const d2 = date.extractDate(outTime, 'HH:mm')
  const diff = date.getDateDiff(d2, d1, 'minutes')
  const hours = Math.floor(diff / 60)
  const mins = diff % 60
  return `${hours}h ${mins}m`
}
</script>
