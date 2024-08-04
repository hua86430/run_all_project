<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";
import { SendInvoke } from "./composables/SendInvoke";
import { ElMessage } from "element-plus";
import { InvokeEvent } from "./enums/InvokeEvent";

const props = defineProps<{
  project: ProjectConfig;
}>();
const killProcess = async (): Promise<void> => {
  const killProcessResponse = await SendInvoke(
    InvokeEvent.KILL_PROCESS,
    props.project.projectName,
  );

  ElMessage({
    message: `Kill process success: ${killProcessResponse}`,
  });
};
</script>
<template>
  <el-button type="danger" @click="killProcess()" plain
    >kill process
  </el-button>
</template>
