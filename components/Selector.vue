<script setup lang="ts">
  import { ref, computed } from '@vue/runtime-core'
  import {Component} from 'vue'
  import figures from 'figures'

  import { TBox, useInput, TText } from '@temir/core'
  import SelectInputItem from './Selector/Item.vue'
  import Indicator from './Selector/Indicator.vue'

  export interface TSelectInputProps {
    items?: Array<{value:any, label:string|number}>
    value?: number
    frame_size?: number
    wrap?: boolean
    indicatorComponent?: typeof Indicator
    itemComponent?: typeof SelectInputItem
    onSelect?: (item: any) => void
    onHighlight?: (item: any) => void
  }

  const props = withDefaults(defineProps<TSelectInputProps>(), {
    items: ()=>[],
    value: 0,
    indicatorComponent: Indicator,
    itemComponent: SelectInputItem,
    wrap:false
  })

  function wrapNormalize(index, len) {
    return (index % len + len) % len;
  }

  function onHandle(input, key) {
    let frameLen = frame.value.length
    let mapLen = mapped.value.length

    let atFrameStart = highlight.value === 0
    let atArrStart = selected.value === 0
    let atFrameEnd = highlight.value === (frameLen-1)
    let atArrEnd = selected.value === (mapLen-1)

    if (key.upArrow) {
      if (atFrameStart) {
        if (atArrStart && !props.wrap) return
        return offset.value = wrapNormalize(offset.value - 1, mapLen)
      }
      highlight.value = (((highlight.value-1) % frameLen) + frameLen) % frameLen
    }

    else if (key.downArrow) {
      if (atFrameEnd) { 
        if (atArrEnd && !props.wrap) return
        return offset.value = wrapNormalize(offset.value + 1, mapLen)
      }
      highlight.value = (highlight.value+1) % frame.value.length
    }

    else if (key.return) {
      emit('submit', props.items[selected.value], selected.value)
    }
  }

  useInput(onHandle)

  type Mapped = Array<{value:any, label:string|number, id:number}>
  const mapped = computed(()=>props.items.reduce((acc:Mapped, el, i)=>[
    ...acc, {id: i, label: el.label, value:el.value}
  ], []))

  const highlight = ref(0)
  const offset = ref(props.value) // init value is our initial index

  function circularSlice(arr, startIndex) {
    const len = arr.length;
    let endIndex = +startIndex + +(props.frame_size || len) - 1

    // Normalize start and end indices to be within the array bounds
    startIndex = wrapNormalize(startIndex, len)
    endIndex = wrapNormalize(endIndex, len)

    if (startIndex <= endIndex) {
      // If the slice doesn't wrap around the end of the array
      return arr.slice(startIndex, endIndex + 1);
    } else {
      // If the slice wraps around the end of the array
      return arr.slice(startIndex).concat(arr.slice(0, endIndex + 1));
    }
  }

  const frame = computed(()=>{
    if (!props.frame_size) return mapped.value // full arr
    return circularSlice(mapped.value, offset.value)
  })

  const selected = computed(()=>{
    return wrapNormalize(offset.value + highlight.value, mapped.value.length)
  })

  let atStart = computed(()=>selected.value === 0)
  let atEnd = computed(()=>selected.value === mapped.value.length-1)

  const emit = defineEmits(['submit'])
</script>

<template>
  <TBox flexDirection="column">
    <TText v-if="props.frame_size">{{ (atStart && !props.wrap) ? ' ' : figures.triangleUp }}</TText>

    <TBox v-for="item of frame">
      <!-- would be interesting to put the index/len here if formatted/ padded nicely -->
      <Component :is="props.indicatorComponent" :isSelected="item.id == selected"/>
      <Component :is="props.itemComponent" :isSelected="item.id == selected" :label="''+item.label"/>
    </TBox>
    
    <TText>{{ (!props.frame_size || (!props.wrap && atEnd)) ? ' ' : figures.triangleDown}}</TText>
    <TText color="green">{{ selected+1 }}/{{ mapped.length }}</TText>
  </TBox>
</template>
