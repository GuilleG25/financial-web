<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <Logo />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Inicia sesión en tu cuenta
        </h2>
      </div>
      <Form @submit="handleLogin" class="mt-8 space-y-4">
        <input type="hidden" name="remember" value="true" />
        <div class="rounded-md shadow-sm space-y-2">
          <div>
            <label for="email-address" class="sr-only"
              >Dirección de correo electrónico</label
            >
            <Field
              id="email-address"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Correo electrónico"
              :rules="emailRules"
              v-model="email"
            />
            <ErrorMessage
              name="email"
              class="text-red-500 text-sm mt-1 block"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Contraseña</label>
            <Field
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              :rules="passwordRules"
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Contraseña"
              v-model="password"
            />
            <ErrorMessage
              name="password"
              class="text-red-500 text-sm mt-1 block"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="bg-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-white font-medium rounded-md w-full flex justify-center py-2 px-4 items-center"
            :disabled="statusSubmit"
          >
            <span v-if="!statusSubmit">Iniciar sesión</span>
            <span v-else>Espere...</span>
          </button>
        </div>
      </Form>

      <div class="text-center">
        <button
          @click="changeToRegister"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          ¿No tienes una cuenta? Regístrate
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useRouter } from 'vue-router'

const router = useRouter()
const { login } = useSanctumAuth()

const statusSubmit = ref(false)
const email = ref('')
const password = ref('')

const passwordRules = ref([(v) => !!v || 'Se requiere contraseña'])
const emailRules = ref([
  (v) => !!v || 'Se requiere correo electrónico',
  (v) => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido',
])

const handleLogin = async () => {
  try {
    statusSubmit.value = true
    const userCredentials = {
      email: email.value,
      password: password.value,
    }
    await login(userCredentials)
  } catch (err) {
    console.log(err)
    statusSubmit.value = false
    ElNotification({
      title: 'Ha ocurrido un error',
      message: err.response._data.message,
      type: 'error',
    })
  } finally {
    statusSubmit.value = false
  }
}

const changeToRegister = async () => {
  router.push({ path: '/register' })
}
</script>
