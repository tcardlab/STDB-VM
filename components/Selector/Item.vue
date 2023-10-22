<script setup lang="ts">
  import { TBox, TText } from '@temir/core'
  export interface IndicatorProps {
    isSelected?: boolean
    label: string
  }

  let props = defineProps<IndicatorProps>()
</script>

<template>
  <TBox>
    <TText :color="props.isSelected ? 'blue' : undefined">
      {{ props.label }}
    </TText>
  </TBox>
</template>