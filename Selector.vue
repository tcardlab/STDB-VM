<script lang="ts" setup>
  import { computed, defineComponent, defineAsyncComponent, h, ref, Component } from '@vue/runtime-core'
  import TSelectInput from './components/Selector.vue'

  const items = [
    {
      label: '1',
      value: 'Vue',
    },
    {
      label: '2',
      value: 'Vite',
    },
    {
      label: '3',
      value: 'Temir',
    },
    {
      label: '4',
      value: 'Vue',
    },
    {
      label: '5',
      value: 'Vite',
    },
    {
      label: '6',
      value: 'Temir',
    },
    {
      label: '7',
      value: 'Vue',
    },
    {
      label: '8',
      value: 'Vite',
    },
    {
      label: '9',
      value: 'Temir',
    },
    {
      label: '10',
      value: 'Vue',
    },
    {
      label: '11',
      value: 'Vite',
    },
    {
      label: '12',
      value: 'Temir',
    },
  ]
  function onSelect(value) {
    console.log('selected', value)
  }

</script>

<template>
  <TSelectInput :items="items" @submit="onSelect"></TSelectInput>
  <!-- <Component :is="TSelectInput" :items="items" :on-select="onSelect"></Component> -->
</template>