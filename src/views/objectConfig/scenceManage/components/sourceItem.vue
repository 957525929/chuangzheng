<template>
  <div>
    <a-form layout="inline">
      <a-form-item v-if="data.cName" label="测项名称">{{ data.cName }}</a-form-item>
      <a-form-item v-if="data.methodName" label="方法名称">{{ data.methodName }}</a-form-item>
      <a-form-item v-if="data.activityName" label="活动名称">{{ data.activityName }}</a-form-item>
      <a-form-item v-if="data.name" label="名称">{{ data.name }}</a-form-item>
      <a-form-item v-if="data.description" label="描述">{{ data.description }}</a-form-item>
      <a-form-item v-if="data.scene" label="所属场景">{{ data.scene }}</a-form-item>
      <a-form-item v-if="data.cardName" label="卡片名称">{{ data.cardName }}</a-form-item>
      <a-form-item v-if="data.sceneName" label="所属场景">{{ data.sceneName }}</a-form-item>
      <a-form-item v-if="data.updateTime" label="更新时间">{{ data.updateTime | dayjs }}</a-form-item>
      <slot></slot>
      <a-divider />
    </a-form>
  </div>
</template>

<script>
import { formatDate } from '@/utils/util'
export default {
  props: ['data']
}
</script>

<style lang="scss" scoped></style>
