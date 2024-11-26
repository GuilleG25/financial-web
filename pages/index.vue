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

          <!-- Transactions Table -->
          <div class="px-4 sm:px-6 lg:px-8">
            <div class="sm:flex sm:items-center">
              <div class="sm:flex-auto">
                <h1 class="text-xl font-semibold text-gray-900">
                  Transactions
                </h1>
                <p class="mt-2 text-sm text-gray-700">
                  A list of all financial transactions including expenses and
                  income.
                </p>
              </div>
              <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <button
                  @click="openModal"
                  type="button"
                  class="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
                >
                  Add transaction
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
                            Date
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Description
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Amount
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Type
                          </th>
                          <th
                            scope="col"
                            class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                          >
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody class="divide-y divide-gray-200 bg-white">
                        <tr
                          v-for="transaction in paginatedTransactions"
                          :key="transaction.id"
                        >
                          <td
                            class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                          >
                            {{ transaction.date }}
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            {{ transaction.description }}
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            ${{ transaction.amount.toFixed(2) }}
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            <span
                              :class="
                                transaction.type === 'income'
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              "
                            >
                              {{ transaction.type }}
                            </span>
                          </td>
                          <td
                            class="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                          >
                            <button
                              @click="editTransaction(transaction)"
                              class="text-indigo-600 hover:text-indigo-900 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              @click="deleteTransaction(transaction.id)"
                              class="text-red-600 hover:text-red-900"
                            >
                              Delete
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
                  Showing
                  <span class="font-medium mx-1">{{
                    (currentPageNumber - 1) * itemsPerPage + 1
                  }}</span>
                  to
                  <span class="font-medium mx-1">{{
                    transactions.length > 0
                      ? Math.min(
                          currentPageNumber * itemsPerPage,
                          transactions.length
                        )
                      : 0
                  }}</span>
                  of
                  <div v-if="transactions.length > 0">
                    <span class="font-medium mx-1">
                      {{ transactions.length }}
                    </span>
                  </div>
                  results
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

    <!-- Add/Edit Transaction Modal -->
    <dialog
      ref="modal"
      class="rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6"
      @close="closeModal"
    >
      <div class="mt-3 text-center sm:mt-5">
        <h3
          class="text-lg leading-6 font-medium text-gray-900"
          id="modal-title"
        >
          {{ editingTransaction ? 'Edit Transaction' : 'Add New Transaction' }}
        </h3>
        <div class="mt-2">
          <form
            @submit.prevent="
              editingTransaction ? updateTransaction() : addTransaction()
            "
          >
            <div class="mb-4">
              <label
                for="description"
                class="block text-sm font-medium text-gray-700"
                >Description</label
              >
              <input
                type="text"
                name="description"
                id="description"
                v-model="newTransaction.description"
                required
                class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div class="mb-4">
              <label
                for="amount"
                class="block text-sm font-medium text-gray-700"
                >Amount</label
              >
              <input
                type="number"
                name="amount"
                id="amount"
                v-model="newTransaction.amount"
                required
                class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div class="mb-4">
              <label for="type" class="block text-sm font-medium text-gray-700"
                >Type</label
              >
              <select
                id="type"
                name="type"
                v-model="newTransaction.type"
                required
                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div
              class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense"
            >
              <button
                type="submit"
                class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
              >
                {{ editingTransaction ? 'Update' : 'Add' }}
              </button>
              <button
                @click="closeModal"
                type="button"
                class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
const { user, logout } = useSanctumAuth()
const token = useCookie('sanctum.token.cookie')

const modal = ref(null)
const newTransaction = ref({
  description: '',
  amount: 0,
  type: 'expense',
})
const editingTransaction = ref(null)

const itemsPerPage = 5
const currentPageNumber = ref(1)

const transactions = ref([
  {
    id: 1,
    date: '2023-06-01',
    description: 'Salary',
    amount: 5000,
    type: 'income',
  },
  {
    id: 2,
    date: '2023-06-02',
    description: 'Rent',
    amount: 1500,
    type: 'expense',
  },
  {
    id: 3,
    date: '2023-06-03',
    description: 'Groceries',
    amount: 200,
    type: 'expense',
  },
  {
    id: 4,
    date: '2023-06-04',
    description: 'Freelance work',
    amount: 1000,
    type: 'income',
  },
  {
    id: 5,
    date: '2023-06-05',
    description: 'Utilities',
    amount: 150,
    type: 'expense',
  },
  {
    id: 6,
    date: '2023-06-06',
    description: 'Online course',
    amount: 50,
    type: 'expense',
  },
  {
    id: 7,
    date: '2023-06-07',
    description: 'Dividend',
    amount: 200,
    type: 'income',
  },
])

onMounted(() => {
  console.log(user.value)
  console.log(token.value)
})

const currentBalance = computed(() => {
  return transactions.value.reduce((total, transaction) => {
    return transaction.type === 'income'
      ? total + transaction.amount
      : total - transaction.amount
  }, 0)
})

const totalPages = computed(() =>
  Math.ceil(transactions.value.length / itemsPerPage)
)

const paginatedTransactions = computed(() => {
  const start = (currentPageNumber.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return transactions.value.slice(start, end)
})

const logoutUser = () => {
  logout()
}

const openModal = () => {
  modal.value.showModal()
}

const closeModal = () => {
  modal.value.close()
  newTransaction.value = { description: '', amount: 0, type: 'expense' }
  editingTransaction.value = null
}

const addTransaction = () => {
  const transaction = {
    id: transactions.value.length + 1,
    date: new Date().toISOString().split('T')[0],
    ...newTransaction.value,
    amount: parseFloat(newTransaction.value.amount),
  }
  transactions.value.push(transaction)
  closeModal()
}

const editTransaction = (transaction) => {
  editingTransaction.value = transaction
  newTransaction.value = { ...transaction }
  openModal()
}

const updateTransaction = () => {
  const index = transactions.value.findIndex(
    (t) => t.id === editingTransaction.value.id
  )
  if (index !== -1) {
    transactions.value[index] = {
      ...editingTransaction.value,
      ...newTransaction.value,
      amount: parseFloat(newTransaction.value.amount),
    }
  }
  closeModal()
}

const deleteTransaction = (id) => {
  transactions.value = transactions.value.filter((t) => t.id !== id)
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
</script>
