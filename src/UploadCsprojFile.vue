<script lang="ts" setup>
import { ref } from "vue";
import { UploadFile, UploadInstance } from "element-plus";
import { ProjectConfig } from "./classes/ProjectConfig";
import { CsprojFileObject } from "./classes/CsprojFileObject";

const uploadRef = ref<UploadInstance>();
const projectConfigs = defineModel("projectConfigs", {
  type: Array as () => ProjectConfig[],
  default: [],
});

const onUploadFile = (uploadFile: UploadFile): void => {
  if (!Boolean(uploadFile.raw!.path)) {
    alert("Please upload a .csproj file");
  }

  const csprojFileObject = new CsprojFileObject(
    uploadFile.raw!.path,
    uploadFile.name,
  );

  const existConfig = projectConfigs.value.find(
    (config) => config.projectName === csprojFileObject.projectName,
  );

  if (!existConfig) {
    projectConfigs.value.push(
      new ProjectConfig(
        csprojFileObject.projectName,
        csprojFileObject.filePath,
      ),
    );
  }
};
</script>

<template>
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
</template>
