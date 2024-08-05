<script setup lang="ts">
import { LogRequest } from "./classes/logRequest";
import { computed, nextTick, onBeforeMount, ref, watch } from "vue";
import { ProjectConfig } from "./classes/ProjectConfig";
import { loadProjectConfigs } from "./invokes/InitProjectConfigsInvokes";
import { getMessage } from "./invokes/GetMessage";
import { saveProjectConfig } from "./invokes/SaveProjectConfigInvokes";
import UploadCsprojFile from "./UploadCsprojFile.vue";
import { ElMessage, ElTable } from "element-plus";
import ProjectStatusSection from "./ProjectStatusSection.vue";
import { multipleBuildAndRunProject } from "./invokes/BuildAndRunProject";
import ProjectConfigActionArea from "./ProjectConfigActionArea.vue";

const logs = ref<string>("");
const projectConfigs = ref<ProjectConfig[]>([]);
const tableRef = ref<InstanceType<typeof ElTable>>();
const isInitializing = ref<boolean>(true);
const isMultipleBuilding = ref<boolean>(false);

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
      JSON.stringify(newValue.values),
      JSON.stringify(await loadProjectConfigs()),
    );
  },
  {
    deep: true,
  },
);

const saveConfigs = async (): Promise<void> => {
  await saveProjectConfig(projectConfigs.value);
  ElMessage.success("Save Configs Successfully");
  isSaveBtnEnable.value = false;
};

const isRunBtnEnable = computed((): boolean => {
  console.log(projectConfigs.value);
  return projectConfigs.value.some((config) => config.isSelected);
});

const runAllProjects = async () => {
  if (isMultipleBuilding.value) {
    return;
  }

  try {
    isMultipleBuilding.value = true;
    await multipleBuildAndRunProject(
      projectConfigs.value.filter((config) => config.isSelected),
    );
  } finally {
    isMultipleBuilding.value = false;
  }
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
          :disabled="isMultipleBuilding || !isRunBtnEnable"
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
              :is-multiple-building="isMultipleBuilding"
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
