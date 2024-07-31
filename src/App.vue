<script setup lang="ts">
import { getMessage } from "./composables/GetMessage";
import { LogRequest } from "./classes/logRequest";
import { ref } from "vue";
import { listenBuildProjectMessage } from "./composables/ListenBuildProjectMessage";
import { buildAndRunProject } from "./composables/BuildAndRunProject";
import { UploadFile, UploadInstance } from "element-plus";
import { CsprojFileObject } from "./classes/CsprojFileObject";

const buildMessage = ref("");
const logs = ref<string>("");
const csprojFileObject = ref<CsprojFileObject>(new CsprojFileObject());

async function buildAndRun() {
  listenBuildProjectMessage(buildMessage, csprojFileObject.value.projectName);
  await buildAndRunProject(csprojFileObject.value);
}

async function showLogs() {
  logs.value = await getMessage(
    new LogRequest("info", "C:/logs/log-error.txt"),
  );
}

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
      <button title="click me" @click="showLogs">click me to show log</button>
      <button title="click me" @click="buildAndRun">build and run</button>
    </div>

    <p v-if="logs" class="logs-section">Logs: <span v-html="logs"></span></p>
    <p v-if="buildMessage" class="build-logs-section">
      Build Message:
      <span v-html="buildMessage"></span>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.logs-section,
.build-logs-section {
  text-align: left;
}
</style>
