<script setup lang="ts">
import { ref } from "vue";

const logContent = ref<string>("");
async function showLogs() {
  console.log(await window.ipcRenderer.invoke("read-log"));
}
</script>

<template>
  <div>
    <button title="click me" @click="showLogs">click me to show log</button>
  </div>
</template>

<style>
.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}

.logo.electron:hover {
  filter: drop-shadow(0 0 2em #9feaf9);
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
