<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig.js";
import { onBeforeMount, onMounted, ref } from "vue";
import { ListenerEvent } from "./enums/ListenerEvent";

const props = defineProps<{
  project: ProjectConfig;
}>();

const status = ref<string>("");
onBeforeMount(() => {
  const listener = (event: any, message: string) => {
    console.log(message);
  };
  window.ipcRenderer.on(
    `${props.project.projectName}-${ListenerEvent.PROCESS_STATUS}`,
    listener,
  );
});
</script>
<template>
  <el-tag type="success">Running</el-tag>
  <!--  <el-tag v-else type="danger">Stopped</el-tag>-->
</template>
