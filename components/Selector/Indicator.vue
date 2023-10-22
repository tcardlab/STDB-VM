<script setup>
  import { TBox, TText } from '@temir/core'
  import figures from 'figures'

  let props = defineProps(['isSelected'])
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
