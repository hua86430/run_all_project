<script setup lang="ts">
import { ref } from "vue";
import { getMessage } from "./composables/GetMessage";
import { LogRequest } from "./classes/logRequest";

async function showLogs() {
  console.log(
    await getMessage(new LogRequest("info", "C:/logs/log-error.txt")),
  );
}
</script>

<template>
  <div>
    <button title="click me" @click="showLogs">click me to show log</button>
  </div>
</template>

<style></style>
