<script setup lang="ts">
import { LogRequest } from "./classes/logRequest";
import { computed, nextTick, onBeforeMount, ref, watch } from "vue";
import { ProjectConfig } from "./classes/ProjectConfig";
import { loadProjectConfigs } from "./invokes/InitProjectConfigsInvokes";
import { getMessage } from "./invokes/GetMessage";
import { saveProjectConfig } from "./invokes/SaveProjectConfigInvokes";
import UploadCsprojFile from "./UploadCsprojFile.vue";
import { ElTable } from "element-plus";
import ProjectStatusSection from "./ProjectStatusSection.vue";
import { multipleBuildAndRunProject } from "./invokes/BuildAndRunProject";
import ProjectConfigActionArea from "./ProjectConfigActionArea.vue";

const logs = ref<string>("");
const projectConfigs = ref<ProjectConfig[]>([]);
const tableRef = ref<InstanceType<typeof ElTable>>();
const isInitializing = ref<boolean>(true);
const isBuilding = ref<boolean>(false);

async function init() {
  setTimeout(async () => {
    projectConfigs.value = await loadProjectConfigs();

    await nextTick(() => {
      projectConfigs.value.forEach((config) => {
        tableRef.value!.toggleRowSelection(config, config.isSelected);
      });

      isInitializing.value = false;
    });
  }, 1000);
}

onBeforeMount(async () => {
  await init();
});

async function showLogs() {
  logs.value = await getMessage(
    new LogRequest("info", "C:/logs/log-error.txt"),
  );
}

const isSaveBtnEnable = ref<boolean>(false);
const handleSelectionChange = async (
  selectedProjects: ProjectConfig[],
): Promise<void> => {
  if (isInitializing.value) {
    return;
  }
  projectConfigs.value.forEach((config) => {
    config.isSelected = !!selectedProjects.find(
      (x) => x.projectName === config.projectName,
    );
  });
};

watch(
  projectConfigs,
  async (newValue, _) => {
    if (isInitializing.value) {
      return;
    }

    isSaveBtnEnable.value = !Object.is(
      JSON.stringify(newValue.value),
      JSON.stringify(await loadProjectConfigs()),
    );
  },
  {
    deep: true,
  },
);

const saveConfigs = async (): Promise<void> => {
  await saveProjectConfig(projectConfigs.value);
  isSaveBtnEnable.value = false;
};

const isRunBtnEnable = computed((): boolean => {
  return projectConfigs.value.some((config) => config.isSelected);
});

const runAllProjects = async () => {
  if (isBuilding.value) {
    return;
  }

  isBuilding.value = true;
  await multipleBuildAndRunProject(
    projectConfigs.value.filter((config) => config.isSelected),
  );
  isBuilding.value = false;
};
</script>

<template>
  <div>
    <div class="base-action-section">
      <div class="left-action">
        <UploadCsprojFile v-model:project-configs="projectConfigs" />
      </div>
      <div class="right-action">
        <el-button
          type="info"
          :disabled="isBuilding || !isRunBtnEnable"
          @click="runAllProjects"
          >Run Selected Projects</el-button
        >
        <el-button
          type="warning"
          @click="saveConfigs"
          :disabled="!isSaveBtnEnable"
          >Save Config</el-button
        >
      </div>
    </div>

    <div class="project-settings-container">
      <el-table
        ref="tableRef"
        :data="projectConfigs"
        style="width: 100%"
        max-height="85vh"
        stripe
        @selectionChange="handleSelectionChange"
      >
        <el-table-column type="selection" width="40" />

        <el-table-column
          fixed
          prop="projectName"
          label="Project Name"
          width="220"
        />

        <el-table-column label="Status" width="300">
          <template #default="{ row: project }">
            <ProjectStatusSection :project="project" />
          </template>
        </el-table-column>

        <el-table-column prop="address" align="right" min-width="250">
          <template #default="{ row: project }">
            <ProjectConfigActionArea
              v-model:project-configs="projectConfigs"
              v-model:is-building="isBuilding"
              :project="project"
            />
          </template>
        </el-table-column>
      </el-table>
    </div>

    <p v-if="logs" class="logs-section">Logs: <span v-html="logs"></span></p>
  </div>
</template>

<style lang="scss">
.base-action-section {
  display: flex;
  gap: 10px;
  justify-content: space-between;

  .right-action {
    display: flex;
    gap: 10px;
  }
}

.project-settings-container {
  margin-top: 24px;
}

.logs-section,
.build-logs-section {
  text-align: left;
}
</style>
