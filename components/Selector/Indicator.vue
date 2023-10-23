<script setup lang="ts">
  import { TBox, TText } from '@temir/core'
  export interface IndicatorProps {
    isSelected?: boolean
  }

  let props = defineProps<{isSelected?: Boolean}>()
</script>

<template>
  <TBox :marginRight="1">
    <TText 
      v-if="props.isSelected" color="blue"
    > 
      {{ '❯' }}
    </TText>
    <TText v-else>{{' '}}</TText>
  </TBox>
</template>
