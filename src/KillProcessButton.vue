<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";
import { SendInvoke } from "./composables/SendInvoke";
import { InvokeEvent } from "./enums/InvokeEvent";

const props = defineProps<{
  project: ProjectConfig;
}>();
const killProcess = async (): Promise<void> => {
  await SendInvoke(InvokeEvent.KILL_PROCESS, props.project.projectName);
};
</script>
<template>
  <el-button type="danger" @click="killProcess()" plain>Kill</el-button>
</template>
