<script setup lang="ts">
import { ProjectConfig } from "./classes/ProjectConfig";
import { listenBuildProjectMessage } from "./listeners/ListenBuildProjectMessage";
import { listenRunProjectMessage } from "./listeners/ListenRunProjectMessage";
import { buildAndRunProject } from "./invokes/BuildAndRunProject";
import { ref } from "vue";

const props = defineProps<{
  project: ProjectConfig;
}>();
const buildMessage = ref<string>("");
const runMessage = ref<string>("");

async function buildAndRun() {
  if (!props.project.csprojPath.includes(".csproj")) {
    alert("Please upload a .csproj file");
    return;
  }
  listenBuildProjectMessage(buildMessage, props.project.projectName);
  listenRunProjectMessage(runMessage, props.project.projectName);
  await buildAndRunProject(props.project);
}
</script>
<template>
  <el-button type="info" @click="buildAndRun" plain>build and run </el-button>

  <p v-if="buildMessage" class="build-logs-section">
    Build Message:
    <span v-html="buildMessage"></span>
  </p>
  <p v-if="runMessage" class="run-logs-section">
    Run Message:
    <span v-html="runMessage"></span>
  </p>
</template>
