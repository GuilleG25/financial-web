<template>
  <div class="bg-white shadow rounded-lg p-6 mb-6">
    <div class="flex items-center space-x-6">
      <div class="relative">
        <img
          :src="user?.avatar || 'https://placeholder.pics/svg/200'"
          alt="User avatar"
          class="w-24 h-24 rounded-full object-cover"
        />
        <button
          aria-label="Cerrar"
          @click="toggleEditModal"
          class="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <PencilIcon class="h-4 w-4" />
        </button>
      </div>
      <div>
        <h2 class="text-2xl font-bold text-gray-900">
          {{ user.username }}
        </h2>
        <span class="flex items-center space-x-2">
          <p class="font-bold">Email:</p>
          <span>{{ user.email }}</span>
        </span>

        <p class="text-gray-700">Capital Actual: €{{ balance.toFixed(2) }}</p>
      </div>
    </div>
  </div>

  <!-- Edit Profile Modal -->
  <dialog
    ref="modalUser"
    class="rounded-lg bg-white shadow-xl overflow-hidden sm:max-w-lg w-full p-6 transform transition-all sm:my-8 sm:align-middle"
    aria-labelledby="modal-title"
    aria-modal="true"
    @close="closeEditModal"
  >
    <h3
      id="modal-title"
      class="text-center text-lg font-medium text-gray-900 mb-4"
    >
      Editar perfil
    </h3>
    <Form @submit="updateProfile" class="space-y-6">
      <div>
        <label
          for="username"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Nombre de usuario
        </label>
        <Field
          type="text"
          name="username"
          :rules="usernameRules"
          v-model="username"
          required
          class="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Ingresa tu nombre de usuario"
        />
        <ErrorMessage name="username" class="text-red-500 text-sm mt-1 block" />
      </div>
      <div>
        <label
          for="avatar"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Avatar
        </label>
        <input
          type="file"
          id="avatar"
          @change="handleAvatarChange"
          accept="image/*"
          class="appearance-none rounded-md block w-full px-3 py-2 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div class="flex space-x-4">
        <button
          type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm font-medium"
        >
          Guardar cambios
        </button>
        <button
          type="button"
          @click="toggleEditModal"
          class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm font-medium"
        >
          Cancelar
        </button>
      </div>
    </Form>
  </dialog>
</template>

<script setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { Form, Field, ErrorMessage } from 'vee-validate'
const { user } = useSanctumAuth()
import { PencilIcon } from 'lucide-vue-next'

const props = defineProps({
  balance: Number,
})

const username = ref(user.value?.username || 'No definido')
const newAvatar = ref(null)

const usernameRules = ref([(v) => !!v || 'El nombre de usuario es obligatorio'])

const modalUser = ref(null)

const toggleEditModal = () => {
  if (modalUser.value.open) {
    modalUser.value.close()
  } else {
    modalUser.value.showModal()
  }
}

const updateProfile = async () => {
  const api = useAxios()

  const payload = {
    username: username.value,
  }

  if (newAvatar.value) {
    payload.avatar = newAvatar.value
  }

  try {
    const resp = await api.put(`/user/update`, payload)
    user.value.username = resp.data.username
    user.value.avatar = resp.data.avatar || 'https://placeholder.pics/svg/200'
    ElNotification({
      title: '¡Datos actualizados!',
      message: 'Tu perfil ha sido actualizado correctamente.',
      type: 'success',
    })
  } catch (error) {
    console.error('Error al actualizar los datos:', error)
    ElNotification({
      title: 'Error',
      message: 'No se pudo actualizar los datos. Inténtalo nuevamente.',
      type: 'error',
    })
  } finally {
    toggleEditModal()
  }
}

const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target.result
      newAvatar.value = base64String
    }
    reader.readAsDataURL(file)
  } else {
    console.log('No se seleccionó ningún archivo')
  }
}
</script>
