<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  src: string;
  alt?: string;
  fallback?: string;
  width?: number | string;
  height?: number | string;
  imgClass?: string;
}>();

const imageError = ref(false);
const fallbackSrc = props.fallback || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2UwZTBlMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7wn5CgPC90ZXh0Pjwvc3ZnPg==';

const handleError = () => {
  imageError.value = true;
};
</script>

<template>
  <img
    :src="imageError ? fallbackSrc : src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    :class="imgClass"
    @error="handleError"
  />
</template>

