<script setup lang="ts">
import { ProjectConfig } from "./classes/ProjectConfig";
import { listenBuildProjectMessage } from "./listeners/ListenBuildProjectMessage";
import { listenRunProjectMessage } from "./listeners/ListenRunProjectMessage";
import { buildAndRunProject } from "./invokes/BuildAndRunProject";
import { ref } from "vue";

const props = defineProps<{
  project: ProjectConfig;
}>();

const isBuildingModelValue = defineModel<boolean>("isBuilding");
const buildMessage = ref<string>("");
const runMessage = ref<string>("");

async function buildAndRun() {
  if (isBuildingModelValue.value) {
    return;
  }

  if (!props.project.csprojPath.includes(".csproj")) {
    alert("Please upload a .csproj file");
    return;
  }
  isBuildingModelValue.value = true;
  listenBuildProjectMessage(buildMessage, props.project.projectName);
  listenRunProjectMessage(runMessage, props.project.projectName);
  await buildAndRunProject(props.project);
  isBuildingModelValue.value = false;
}
</script>
<template>
  <el-button
    type="info"
    @click="buildAndRun"
    plain
    :disabled="isBuildingModelValue"
    >build and run
  </el-button>

  <!--  <p v-if="buildMessage" class="build-logs-section">-->
  <!--    Build Message:-->
  <!--    <span v-html="buildMessage"></span>-->
  <!--  </p>-->
  <!--  <p v-if="runMessage" class="run-logs-section">-->
  <!--    Run Message:-->
  <!--    <span v-html="runMessage"></span>-->
  <!--  </p>-->
</template>
