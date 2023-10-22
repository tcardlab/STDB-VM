<script setup>
  import { TBox, TText } from '@temir/core'
  let props = defineProps(['isSelected'])
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
