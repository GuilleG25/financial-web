# Nuxt Finacial Dashboard

## Configuración

Instalar dependecias

```bash
yarn install
```

Variables de entorno

```bash
cp .env.example .env
#example:
PORT={puerto del servidor}
NUXT_PUBLIC_SANCTUM_BASE_URL={url de la api}
```

## Servidor de desarrollo

Iniciar el servidor de desarrollo en `http://localhost:4000`:

```bash
yarn dev
```

## Producción

Build the application for production:

```bash
yarn build
```

Ver la versión de producción localmente:

```bash
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
