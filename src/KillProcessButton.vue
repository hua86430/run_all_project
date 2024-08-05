<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";
import { SendInvoke } from "./composables/SendInvoke";
import { InvokeEvent } from "./enums/InvokeEvent";

const props = defineProps<{
  project: ProjectConfig;
}>();

const isKillingModelValue = defineModel<boolean>("isKilling");

const killProcess = async (): Promise<void> => {
  try {
    isKillingModelValue.value = true;
    await SendInvoke(InvokeEvent.KILL_PROCESS, props.project.projectName);
  } finally {
    isKillingModelValue.value = false;
  }
};
</script>
<template>
  <el-button
    type="danger"
    @click="killProcess()"
    plain
    :disabled="isKillingModelValue"
    >Kill</el-button
  >
</template>
