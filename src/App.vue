<script setup lang="ts">
import { getMessage } from "./composables/GetMessage";
import { LogRequest } from "./classes/logRequest";
import { ref } from "vue";
import {
  listenBuildProjectMessage,
  listenRunProjectMessage,
} from "./composables/ListenBuildProjectMessage";
import { buildAndRunProject } from "./composables/BuildAndRunProject";
import { UploadFile, UploadInstance } from "element-plus";
import { CsprojFileObject } from "./classes/CsprojFileObject";

const buildMessage = ref("");
const runMessage = ref("");
const logs = ref<string>("");
const csprojFileObject = ref<CsprojFileObject>(new CsprojFileObject());

async function buildAndRun() {
  if (!csprojFileObject.value.checkIfFileExists()) {
    alert("Please upload a .csproj file");
    return;
  }
  listenBuildProjectMessage(buildMessage, csprojFileObject.value.projectName);
  listenRunProjectMessage(runMessage, csprojFileObject.value.projectName);
  await buildAndRunProject(csprojFileObject.value);
}

async function showLogs() {
  logs.value = await getMessage(
    new LogRequest("info", "C:/logs/log-error.txt"),
  );
}

const killProcess = (): void => {};

const uploadRef = ref<UploadInstance>();

const onUploadFile = (uploadFile: UploadFile): void => {
  csprojFileObject.value = new CsprojFileObject(
    uploadFile.raw!.path,
    uploadFile.name,
  );
};
</script>

<template>
  <div>
    <div>
      <el-upload
        :on-change="onUploadFile"
        ref="uploadRef"
        :auto-upload="false"
        accept=".csproj"
        :show-file-list="false"
      >
        <template #trigger>
          <el-button type="primary">Select .csproj file</el-button>
        </template>
      </el-upload>
    </div>
    <div>
      <el-button type="primary" @click="showLogs"
        >click me to show log</el-button
      >
      <el-button type="info" @click="buildAndRun">build and run</el-button>
      <el-button type="danger" @click="killProcess">kill process</el-button>
    </div>

    <p v-if="logs" class="logs-section">Logs: <span v-html="logs"></span></p>
    <p v-if="buildMessage" class="build-logs-section">
      Build Message:
      <span v-html="buildMessage"></span>
    </p>
    <p v-if="runMessage" class="run-logs-section">
      Run Message:
      <span v-html="runMessage"></span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.logs-section,
.build-logs-section {
  text-align: left;
}
</style>
