<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navigation -->
    <nav class="bg-white shadow-sm" aria-label="Main Navigation">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-gray-800">
                Dashboard financiero
              </h1>
            </div>
          </div>
          <div class="flex items-center">
            <button
              @click="logoutUser"
              class="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Dashboard -->

    <div class="py-10">
      <main>
        <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
          <!-- User Profile -->
          <UserProfile :balance="currentBalance" />

          <!-- Movements Table -->
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
              <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">
                  Mis movimientos
                </h1>
                <p class="mt-2 text-sm text-gray-700">
                  Una lista de todos los movimientos financieras, incluidos los
                  gastos y los ingresos.
                </p>
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  @click="toggleModal"
                  type="button"
                  class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Agregar movimiento
                </button>
              </div>
            </div>
            <div class="mt-8 flex flex-col">
              <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div
                  class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8"
                >
                  <div
                    class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg"
                  >
                    <table class="min-w-full divide-y divide-gray-300">
                      <thead class="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                          >
                            Fecha
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Descripción
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Monto
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Tipo
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                          v-for="movement in paginatedMovements"
                          :key="movement.id"
                        >
                          <td
                            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                          >
                            {{
                              moment(movement.date).format(
                                'YYYY-MM-DD HH:mm:ss'
                              )
                            }}
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {{ movement.description }}
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            €{{ movement.amount.toFixed(2) }}
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            <span
                              :class="
                                movement.type === 'income'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              "
                            >
                              {{
                                movement.type === 'income' ? 'Ingreso' : 'Gasto'
                              }}
                            </span>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            <button
                              @click="editMovement(movement)"
                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Editar
                            </button>
                            <button
                              @click="deleteMovement(movement._id)"
                              class="text-red-600 hover:text-red-900"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <!-- Pagination -->
            <div
              class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-4"
            >
              <div
                class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between"
              >
                <div class="flex items-center text-sm text-gray-700">
                  Mostrando
                  <span class="font-medium mx-1">
                    {{
                      movements.length > 0
                        ? (currentPageNumber - 1) * itemsPerPage + 1
                        : 0
                    }}
                  </span>

                  a
                  <span class="font-medium mx-1">{{
                    movements.length > 0
                      ? Math.min(
                          currentPageNumber * itemsPerPage,
                          movements.length
                        )
                      : 0
                  }}</span>
                  de
                  <div v-if="movements.length > 0">
                    <span class="font-medium mx-1">
                      {{ movements.length }}
                    </span>
                  </div>
                  resultados
                </div>
                <div>
                  <nav
                    class="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <button
                      @click="changePage('prev')"
                      :disabled="currentPageNumber === 1"
                      class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span class="sr-only">Previous</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                    <button
                      v-for="page in totalPages"
                      :key="page"
                      @click="changePage('goTo', page)"
                      :class="[
                        page === currentPageNumber
                          ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                          : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0',
                        'relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20',
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="changePage('next')"
                      :disabled="currentPageNumber === totalPages"
                      class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                    >
                      <span class="sr-only">Next</span>
                      <svg
                        class="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Add/Edit Movement Modal -->
    <dialog
      ref="modalMovement"
      class="rounded-lg bg-white shadow-xl overflow-hidden sm:max-w-lg w-full p-6 transform transition-all sm:my-8 sm:align-middle"
      aria-labelledby="modal-title"
      aria-modal="true"
    >
      <h3
        id="modal-title"
        class="text-center text-lg font-medium text-gray-900 mb-4"
      >
        {{ idMovement ? 'Editar' : 'Añadir' }} Movimiento
      </h3>
      <Form @submit="handleSubmit" class="space-y-6">
        <div class="flex justify-center mb-4">
          <button
            type="button"
            @click="selectType('income')"
            :class="{
              'bg-green-200': movementType === 'income',
              'bg-white': movementType !== 'income',
            }"
            class="mr-2 px-4 py-2 rounded-md border border-gray-300 text-gray-700"
          >
            Ingreso
          </button>
          <button
            type="button"
            @click="selectType('expense')"
            :class="{
              'bg-red-200': movementType === 'expense',
              'bg-white': movementType !== 'expense',
            }"
            class="px-4 py-2 rounded-md border border-gray-300 text-gray-700"
          >
            Egreso
          </button>
          <ErrorMessage name="type" class="mt-2 text-sm text-red-600" />
        </div>
        <div>
          <label
            for="amount"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Valor del movimiento
          </label>
          <Field
            type="number"
            name="amount"
            v-model="movementAmount"
            required
            class="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ingresa el valor del movimiento"
            :rules="movementAmountRules"
          />
          <ErrorMessage name="amount" class="text-red-500 text-sm mt-1 block" />
        </div>
        <div>
          <label
            for="description"
            class="block text-sm font-medium text-gray-700 mb-1"
          >
            Descripción
          </label>
          <Field
            type="text"
            name="description"
            v-model="movementDescription"
            class="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Ingresa una descripción"
            :rules="movementDescriptionRules"
          />
          <ErrorMessage
            name="description"
            class="text-red-500 text-sm mt-1 block"
          />
        </div>
        <div class="flex space-x-4">
          <button
            type="submit"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm font-medium"
          >
            {{ idMovement ? 'Actualizar' : 'Crear' }} Movimiento
          </button>
          <button
            type="button"
            @click="toggleModal"
            class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
      </Form>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const { logout } = useSanctumAuth()
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'

const idMovement = ref(null)
const itemsPerPage = 5
const currentPageNumber = ref(1)

const modalMovement = ref(null)
const movementType = ref('income')
const movementAmount = ref(0)
const movementDescription = ref('')

const movementAmountRules = ref([(v) => !!v || 'El monto es obligatorio'])
const movementDescriptionRules = ref([
  (v) => !!v || 'La descripción es obligatoria',
])

const movements = ref([])

onMounted(() => {
  allMovements()
})

const currentBalance = computed(() => {
  return movements.value.reduce((total, movement) => {
    return movement.type === 'income'
      ? total + movement.amount
      : total - movement.amount
  }, 0)
})

const totalPages = computed(() =>
  Math.ceil(movements.value.length / itemsPerPage)
)

const paginatedMovements = computed(() => {
  const start = (currentPageNumber.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return movements.value.slice(start, end)
})

const logoutUser = () => {
  logout()
}

const toggleModal = () => {
  if (modalMovement.value.open) {
    resetForm()
    modalMovement.value.close()
    idMovement.value = null
  } else {
    modalMovement.value.showModal()
  }
}

const editMovement = (movement) => {
  idMovement.value = movement._id
  movementType.value = movement.type
  movementAmount.value = movement.amount
  movementDescription.value = movement.description
  toggleModal()
}

const changePage = (action, page) => {
  if (action === 'prev' && currentPageNumber.value > 1) {
    currentPageNumber.value--
  } else if (action === 'next' && currentPageNumber.value < totalPages.value) {
    currentPageNumber.value++
  } else if (action === 'goTo' && page !== null) {
    currentPageNumber.value = page
  }
}

const selectType = (type) => {
  movementType.value = type
}

const resetForm = () => {
  movementType.value = 'income'
  movementAmount.value = 0
  movementDescription.value = ''
}

const allMovements = () => {
  try {
    const api = useAxios()
    api.get('/movements').then((response) => {
      movements.value = response.data
    })
  } catch (error) {
    console.log(error)
  }
}

const handleSubmit = async () => {
  if (idMovement.value) {
    updateMovement()
  } else {
    addMovement()
  }
}

const addMovement = () => {
  try {
    const api = useAxios()
    api
      .post('/movements', {
        description: movementDescription.value,
        amount: parseFloat(movementAmount.value),
        type: movementType.value,
      })
      .then((response) => {
        ElNotification({
          title: '¡Exito!',
          message: 'El movimiento ha sido creado.',
          type: 'success',
        })
        movements.value.push(response.data)
      })
  } catch (error) {
    console.log(error)
    ElNotification({
      title: 'error',
      message: 'Error al crear el movimiento',
      type: 'error',
    })
  } finally {
    resetForm()
    toggleModal()
  }
}

const updateMovement = () => {
  try {
    const api = useAxios()
    api
      .put(`/movements/${idMovement.value}`, {
        description: movementDescription.value,
        amount: parseFloat(movementAmount.value),
        type: movementType.value,
      })
      .then((response) => {
        ElNotification({
          title: '¡Exito!',
          message: 'El movimiento ha sido actualizado.',
          type: 'success',
        })
        allMovements()
      })
  } catch (error) {
    console.log(error)
    ElNotification({
      title: 'error',
      message: 'Error al actualizar el movimiento',
      type: 'error',
    })
  } finally {
    resetForm()
    toggleModal()
  }
}

const deleteMovement = (id) => {
  ElMessageBox.confirm(
    '¿Estás seguro de que quieres eliminar este movimiento?',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      center: true,
    }
  )
    .then(() => {
      try {
        const api = useAxios()
        api.delete(`/movements/${id}`).then(() => {
          ElMessage({
            type: 'success',
            message: 'Movimiento eliminado exitosamente',
          })
          allMovements()
        })
      } catch (error) {
        ElMessage({
          type: 'info',
          mssage: 'No se pudo eliminar el movimiento',
        })
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Movimiento no eliminado',
      })
    })
}
</script>
