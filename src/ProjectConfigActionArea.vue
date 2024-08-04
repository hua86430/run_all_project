<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig";
import BuildAndRunProjectButton from "./BuildAndRunProjectButton.vue";
import KillProcessButton from "./KillProcessButton.vue";
import DeleteProjectConfigButton from "./DeleteProjectConfigButton.vue";

const props = defineProps<{
  project: ProjectConfig;
  projectConfigs: ProjectConfig[];
}>();

const isBuildingModelValue = defineModel<boolean>("isBuilding");
const projectConfigsModelValue = defineModel<ProjectConfig[]>("projectConfigs");
</script>
<template>
  <BuildAndRunProjectButton
    :project="project"
    v-model:is-building="isBuildingModelValue"
  />
  <KillProcessButton :project="project" />
  <DeleteProjectConfigButton
    :project="project"
    v-model:project-configs="projectConfigsModelValue"
  />
</template>
