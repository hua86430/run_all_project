<template>
  <el-button type="danger" @click="killProcess()">kill process </el-button>
</template>
<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";
import { SendInvoke } from "./composables/SendInvoke";

const props = defineProps<{
  project: ProjectConfig;
}>();
const killProcess = async (): Promise<void> => {
  const killProcessResponse = await SendInvoke(
    "kill-process",
    props.project.projectName,
  );

  console.log(killProcessResponse);
};
</script>
