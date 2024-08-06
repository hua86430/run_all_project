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

const processStatus = ref<SyncProcessStatusResponse>(
  {} as SyncProcessStatusResponse,
);

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
  ListenSubscribeProcessStatus(
    props.project.projectName,
    (response: SyncProcessStatusResponse | undefined) => {
      processStatus.value = response;
      processStatus.value.message = response.message?.replace(
        /(\\r\\n|\\n|\\r)/g,
        "<br />",
      );
    },
  );

  await SendInvoke(
    InvokeEvent.SUBSCRIBE_PROCESS_STATUS,
    props.project.projectName,
  );
});
</script>
<template>
  <el-tooltip
    :disabled="!processStatus?.message"
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
