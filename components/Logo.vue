<template>
  <img
    :src="$config.public.logoUrl"
    alt="Logo"
    class="mx-auto h-12 w-auto"
    style="height: 100px; width: 100px"
  />
</template>
<script setup>
const { $config } = useNuxtApp()
</script>
