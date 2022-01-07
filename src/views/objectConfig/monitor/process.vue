<template>
  <div>
    <a-card title="活动配置">
      <a-button slot="extra" @click="goBack">返回</a-button>
      <SourceItem :data="rowData" />
      <Process :id="rowData.id" :rowData="rowData" />
    </a-card>
  </div>
</template>

<script>
import SourceItem from '../scenceManage/components/sourceItem.vue'
import Process from '@/components/testList'
import { processData } from './data/processData'
export default {
  components: {
    SourceItem,
    Process
  },
  mounted() {
    this.rowData = JSON.parse(this.$route.query.data)
    console.log(this.rowData)
  },
  data() {
    return {
      rowData: '',
      processData
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped></style>
