<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8">
      <div>
        <Logo />
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Crea tu cuenta
        </h2>
      </div>
      <Form class="mt-8 space-y-4" @submit="register">
        <input type="hidden" name="remember" value="true" />
        <div>
          <label for="register-username" class="sr-only"
            >Nombre de usuario</label
          >
          <Field
            id="register-username"
            name="username"
            type="text"
            required
            :rules="usernameRules"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Nombre de usuario"
            v-model="username"
          />
          <ErrorMessage
            name="username"
            class="text-red-500 text-sm mt-1 block"
          />
        </div>
        <div>
          <label for="register-email" class="sr-only">Correo electrónico</label>
          <Field
            id="register-email"
            name="email"
            type="email"
            autocomplete="email"
            required
            :rules="emailRules"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Correo electrónico"
            v-model="email"
          />
          <ErrorMessage name="email" class="text-red-500 text-sm mt-1 block" />
        </div>
        <div>
          <label for="register-password" class="sr-only">Contraseña</label>
          <Field
            id="register-password"
            name="password"
            type="password"
            autocomplete="new-password"
            required
            :rules="passwordRules"
            class="appearance-none block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Contraseña"
            v-model="password"
          />
          <ErrorMessage
            name="password"
            class="text-red-500 text-sm mt-1 block"
          />
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Registrar
          </button>
        </div>
      </Form>

      <div class="text-center">
        <button
          @click="changeToLogin"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          ¿Ya tienes una cuenta? Iniciar sesión
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
definePageMeta({
  sanctum: {
    guestOnly: true,
  },
})

import { ElNotification } from 'element-plus'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')

const usernameRules = ref([(v) => !!v || 'El nombre de usuario es obligatorio'])

const passwordRules = ref([
  (v) => !!v || 'Se requiere contraseña',
  (v) =>
    (v && v.length <= 10) || 'La contraseña debe tener menos de 10 caracteres',
])
const emailRules = ref([
  (v) => !!v || 'Se requiere correo electrónico',
  (v) => /.+@.+\..+/.test(v) || 'El correo electrónico debe ser válido',
])

const register = async () => {
  const api = useAxios()
  await api
    .post(`/auth/register`, {
      username: username.value,
      email: email.value,
      password: password.value,
    })
    .then((resp) => {
      console.log(resp)
      ElNotification({
        title: '¡Registro completado!',
        message: 'Bienvenido/a. Ya puedes iniciar sesión',
        type: 'success',
      })
      router.push({ path: '/login' })
    })
}

const changeToLogin = async () => {
  router.push({ path: '/login' })
}
</script>
