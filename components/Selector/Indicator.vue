<script setup lang="ts">
  import { TBox, TText } from '@temir/core'
  import figures from 'figures'
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
      {{ figures.pointer }}
    </TText>
    <TText v-else>{{' '}}</TText>
  </TBox>
</template>
