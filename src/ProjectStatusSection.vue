<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig.js";
import { onMounted, ref, computed } from "vue";
import { SendInvoke } from "./composables/SendInvoke";
import { InvokeEvent } from "./enums/InvokeEvent";
import { SyncProcessStatusResponse } from "./interfaces/syncProcessStatusResponse";
import { SyncProcessStatus } from "./enums/syncProcessStatus";
import { InfoFilled } from "@element-plus/icons-vue";
import { ListenSubscribeProcessStatus } from "./listeners/ListenSubscribeProcessStatus";
import { ProcessStage } from "./enums/processStage";

const props = defineProps<{
  project: ProjectConfig;
}>();
const testHtmlString = ref(
  "[Shabondi] [Build error]: \".NET 的 MSBuild 版本 17.8.5+b5265ef37\\r\\n  Determining projects to restore...\\r\\nF:\\\\git\\\\shabondi\\\\Shabondi\\\\Shabondi.csproj : warning NU1803: You are running the 'restore' operation with an 'HTTP' source, 'http://nuget.coreop.net/nuget'. Non-HTTPS access will be removed in a future version. Consider migrating to an 'HTTPS' source.\\r\\n  所有專案都在最新狀態，可進行還原。\\r\\nF:\\\\git\\\\shabondi\\\\Shabondi\\\\Shabondi.csproj : warning NU1803: You are running the 'restore' operation with an 'HTTP' source, 'http://nuget.coreop.net/nuget'. Non-HTTPS access will be removed in a future version. Consider migrating to an 'HTTPS' source.\\r\\nF:\\\\git\\\\shabondi\\\\Shabondi\\\\Program.cs(29,5): error CS1003: 語法錯誤，必須是 ',' [F:\\\\git\\\\shabondi\\\\Shabondi\\\\Shabondi.csproj]\\r\\n\\r\\n建置失敗。\\r\\n\\r\\nF:\\\\git\\\\shabondi\\\\Shabondi\\\\Shabondi.csproj : warning NU1803: You are running the 'restore' operation with an 'HTTP' source, 'http://nuget.coreop.net/nuget'. Non-HTTPS access will be removed in a future version. Consider migrating to an 'HTTPS' source.\\r\\nF:\\\\git\\\\shabondi\\\\Shabondi\\\\Shabondi.csproj : warning NU1803: You are running the 'restore' operation with an 'HTTP' source, 'http://nuget.coreop.net/nuget'. Non-HTTPS access will be removed in a future version. Consider migrating to an 'HTTPS' source.\\r\\nF:\\\\git\\\\shabondi\\\\Shabondi\\\\Program.cs(29,5): error CS1003: 語法錯誤，必須是 ',' [F:\\\\git\\\\shabondi\\\\Shabondi\\\\Shabondi.csproj]\\r\\n    2 個警告\\r\\n    1 個錯誤\\r\\n\\r\\n經過時間 00:00:00.82\\r\\n\"",
);
const processStatus = ref<SyncProcessStatusResponse>();

const tagStatus = computed(
  (): "success" | "warning" | "info" | "primary" | "danger" => {
    if (!processStatus.value) {
      return "danger";
    }

    if (processStatus.value.status === SyncProcessStatus.SUCCESS) {
      switch (processStatus.value.stage) {
        case ProcessStage.NOT_RUNNING:
          return "info";
        case ProcessStage.RUNNING:
          return "success";
        case ProcessStage.PROCESSING:
          return "warning";
      }
    }

    return "danger";
  },
);

onMounted(async () => {
  ListenSubscribeProcessStatus(processStatus, props.project.projectName);

  await SendInvoke(
    InvokeEvent.SUBSCRIBE_PROCESS_STATUS,
    props.project.projectName,
  );
});
</script>
<template>
  <el-tooltip
    :disabled="!Boolean(processStatus?.message)"
    class="box-item"
    effect="dark"
    placement="right-end"
    :content="processStatus?.message"
    append-to="body"
  >
    <template #content>
      <div v-html="processStatus?.message" style="max-width: 50vw" />
    </template>
    <el-tag
      size="large"
      class="status-tag"
      v-if="processStatus?.status === SyncProcessStatus.SUCCESS"
      :type="tagStatus"
    >
      {{ processStatus?.stage }}
      <el-icon v-if="Boolean(processStatus?.message)"><InfoFilled /></el-icon>
    </el-tag>

    <el-tag
      size="large"
      class="status-tag"
      v-else-if="processStatus?.status === SyncProcessStatus.ERROR"
      type="danger"
    >
      {{ `${processStatus?.stage} Error` }}
      <el-icon v-if="Boolean(processStatus?.message)"><InfoFilled /></el-icon>
    </el-tag>
  </el-tooltip>
</template>

<style lang="scss" scoped>
.status-tag {
  font-size: 14px;
  line-height: 14px;
  //display: flex;
}
</style>
