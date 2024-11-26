import axios from 'axios'
import qs from 'qs'
import { ElNotification } from 'element-plus'

export default function useAxios() {
  const token = useCookie('sanctum.token.cookie')
  const { $config } = useNuxtApp()
  const endpointApi = $config.public.endpointApi
  const api = axios.create({
    baseURL: endpointApi,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...(token.value && { Authorization: `Bearer ${token.value}` }),
    },
    transformRequest: [
      function (payload) {
        return qs.stringify(payload)
      },
    ],
  })

  api.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response.data.statusCode) {
        ElNotification({
          title: 'Error',
          message: errorCodes[error.response.data.statusCode]
            ? errorCodes[error.response.data.statusCode].value
            : response.data.message,
          type: 'error',
        })
        return Promise.reject(error)
      }
    }
  )
  return api
}

const errorCodes = {
  409: {
    code: 409,
    lang: 'es',
    value: 'Valor duplicado',
  },
  400: {
    code: 400,
    lang: 'es',
    value: 'La validación falló',
  },
}
