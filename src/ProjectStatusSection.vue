<script lang="ts" setup>
import { ProjectConfig } from "./classes/ProjectConfig.js";
import { onBeforeMount, ref } from "vue";
import { SendInvoke } from "./composables/SendInvoke";
import { InvokeEvent } from "./enums/InvokeEvent";
import { SubscribeProcessStatusRequest } from "./interfaces/SubscribeProcessStatusRequest";
import { ListenerEvent } from "./enums/ListenerEvent";
import { SyncProcessStatusResponse } from "./interfaces/syncProcessStatusResponse";
import { SyncProcessStatus } from "./enums/syncProcessStatus";
import { ListenerResponse } from "./classes/ListenerResponse";
import { InfoFilled } from "@element-plus/icons-vue";

const props = defineProps<{
  project: ProjectConfig;
}>();

const processStatus = ref<SyncProcessStatusResponse>();

onBeforeMount(async () => {
  await SendInvoke(InvokeEvent.SUBSCRIBE_PROCESS_STATUS, {
    projectName: props.project.projectName,
  } as SubscribeProcessStatusRequest);

  const listener = (
    event: any,
    response: ListenerResponse<SyncProcessStatusResponse>,
  ) => {
    processStatus.value = response.data;
  };
  window.ipcRenderer.on(
    `${props.project.projectName}-${ListenerEvent.PROCESS_STATUS}`,
    listener,
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
      type="success"
    >
      {{ processStatus?.stage }}
      <el-icon v-if="Boolean(processStatus?.message)"><InfoFilled /></el-icon>
    </el-tag>
  </el-tooltip>

  <!--  <el-tag v-else type="danger">Stopped</el-tag>-->
</template>

<style lang="scss" scoped>
.status-tag {
  font-size: 16px;
  line-height: 16px;
  //display: flex;
}
</style>
