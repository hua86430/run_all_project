<script setup lang="ts">
import { ProjectConfig } from "./classes/ProjectConfig";
import { listenBuildProjectMessage } from "./listeners/ListenBuildProjectMessage";
import { listenRunProjectMessage } from "./listeners/ListenRunProjectMessage";
import { buildAndRunProject } from "./invokes/BuildAndRunProject";
import { ref, onMounted, computed } from "vue";

const props = defineProps<{
  project: ProjectConfig;
  isMultipleBuilding: boolean;
}>();

const isBuilding = ref(false);
const buildMessage = ref<string>("");
const runMessage = ref<string>("");

async function buildAndRun() {
  if (props.isMultipleBuilding) {
    return;
  }

  if (!props.project.csprojPath.includes(".csproj")) {
    alert("Please upload a .csproj file");
    return;
  }

  try {
    isBuilding.value = true;

    await buildAndRunProject(props.project);
  } finally {
    isBuilding.value = false;
  }
}

const isBtnDisabled = computed(() => {
  return props.isMultipleBuilding || isBuilding.value;
});

onMounted(() => {
  listenBuildProjectMessage(props.project.projectName, (message: string) => {
    buildMessage.value = message.replace(/\r?\n/g, "<br>") + "<br>";
  });
  listenRunProjectMessage(props.project.projectName, (message: string) => {
    runMessage.value = message.replace(/\r?\n/g, "<br>") + "<br>";
  });
});
</script>
<template>
  <el-button type="info" @click="buildAndRun" plain :disabled="isBtnDisabled"
    >Build And Run
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
