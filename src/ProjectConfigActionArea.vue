<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";
import BuildAndRunProjectButton from "./BuildAndRunProjectButton.vue";
import KillProcessButton from "./KillProcessButton.vue";
import DeleteProjectConfigButton from "./DeleteProjectConfigButton.vue";
import { ref } from "vue";

const props = defineProps<{
  project: ProjectConfig;
  projectConfigs: ProjectConfig[];
  isMultipleBuilding: boolean;
}>();

const isKilling = ref<boolean>(false);

const projectConfigsModelValue = defineModel<ProjectConfig[]>("projectConfigs");
</script>
<template>
  <BuildAndRunProjectButton
    :project="project"
    :is-multiple-building="isMultipleBuilding"
  />
  <KillProcessButton :project="project" v-model:is-killing="isKilling" />
  <DeleteProjectConfigButton
    :project="project"
    v-model:project-configs="projectConfigsModelValue"
  />
</template>
