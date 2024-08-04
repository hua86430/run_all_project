<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig.js";
import { onMounted, ref } from "vue";
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

const processStatus = ref<SyncProcessStatusResponse>();

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
    :content="processStatus?.message"
    placement="right-end"
  >
    <el-tag
      size="large"
      class="status-tag"
      v-if="processStatus?.status === SyncProcessStatus.SUCCESS"
      :type="processStatus?.stage === ProcessStage.RUNNING ? 'success' : 'info'"
    >
      {{ processStatus?.stage }}
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
