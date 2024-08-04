<script lang="ts" setup>
import { Delete } from "@element-plus/icons-vue";
import { ProjectConfig } from "./classes/ProjectConfig";
import { PropType } from "@vue/runtime-core";
const props = defineProps<{
  project: ProjectConfig;
}>();

const projectConfigsModelValue = defineModel<ProjectConfig[]>(
  "projectConfigs",
  {
    required: true,
  },
);

const deleteConfig = () => {
  const index = projectConfigsModelValue.value.findIndex(
    (x) => x.projectName === props.project.projectName,
  );
  projectConfigsModelValue.value.splice(index, 1);
};
</script>
<template>
  <el-button type="danger" :icon="Delete" circle plain @click="deleteConfig" />
</template>
