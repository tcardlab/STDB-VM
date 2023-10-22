<script setup>
  import { TBox, TText } from '@temir/core'
  let props = defineProps(['isSelected', 'label'])
</script>

<template>
  <TBox>
    <TText :color="props.isSelected ? 'blue' : undefined">
      {{ props.label }}
    </TText>
  </TBox>
</template>