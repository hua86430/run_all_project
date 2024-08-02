<template>
  <el-button type="danger" @click="killProcess()">kill process </el-button>
</template>
<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";

const props = defineProps<{
  project: ProjectConfig;
}>();
const killProcess = (): void => {
  console.log(props.project);
};
</script>
