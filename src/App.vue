<script setup lang="ts">
import { LogRequest } from "./classes/logRequest";
import { nextTick, onMounted, ref } from "vue";
import { ProjectConfig } from "./classes/ProjectConfig";
import { loadProjectConfigs } from "./invokes/InitProjectConfigsInvokes";
import { getMessage } from "./invokes/GetMessage";
import { saveProjectConfig } from "./invokes/SaveProjectConfigInvokes";
import UploadCsprojFile from "./UploadCsprojFile.vue";
import KillProcessButton from "./KillProcessButton.vue";
import BuildAndRunProjectButton from "./BuildAndRunProjectButton.vue";
import { ElTable } from "element-plus";
import DeleteProjectConfigButton from "./DeleteProjectConfigButton.vue";

const logs = ref<string>("");
const projectConfigs = ref<ProjectConfig[]>([]);
const tableRef = ref<InstanceType<typeof ElTable>>();
const isInitializing = ref<boolean>(true);

async function init() {
  projectConfigs.value = await loadProjectConfigs();

  await nextTick(() => {
    projectConfigs.value.forEach((config) => {
      tableRef.value!.toggleRowSelection(config, config.isSelected);
    });

    isInitializing.value = false;
  });
}

onMounted(async () => {
  await init();
});

async function showLogs() {
  logs.value = await getMessage(
    new LogRequest("info", "C:/logs/log-error.txt"),
  );
}

const handleSelectionChange = (selectedProjects: ProjectConfig[]): void => {
  if (isInitializing.value) {
    return;
  }
  projectConfigs.value.forEach((config) => {
    config.isSelected = !!selectedProjects.find(
      (x) => x.projectName === config.projectName,
    );
  });
};
</script>

<template>
  <div>
    <div class="base-action-section">
      <UploadCsprojFile v-model:project-configs="projectConfigs" />
      <el-button type="warning" @click="saveProjectConfig(projectConfigs)"
        >Save</el-button
      >
    </div>

    <div class="project-settings">
      <el-table
        ref="tableRef"
        :data="projectConfigs"
        style="width: 100%"
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
        <el-table-column
          prop="address"
          label="Action"
          align="right"
          min-width="300"
        >
          <template #default="{ row: project }">
            <BuildAndRunProjectButton :project="project" />
            <KillProcessButton :project="project" />
            <DeleteProjectConfigButton
              :project="project"
              v-model:project-configs="projectConfigs"
            />
          </template>
        </el-table-column>
      </el-table>
      <div
        v-for="(project, index) in projectConfigs"
        :key="project.projectName"
      >
        <!--      <el-button type="primary" @click="showLogs"-->
        <!--        >click me to show log</el-button-->
        <!--      >-->
      </div>
    </div>

    <p v-if="logs" class="logs-section">Logs: <span v-html="logs"></span></p>
  </div>
</template>

<style lang="scss">
.base-action-section {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.project-settings {
  margin-top: 24px;
}

.logs-section,
.build-logs-section {
  text-align: left;
}
</style>
