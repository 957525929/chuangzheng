<template>
  <div>
    <a-card class="card">
      <!-- <a-button slot="extra" @click="goBack">返回</a-button> -->
      <SourceItem :data="rowData"> <a-button style="float:right" @click="goBack">返回</a-button></SourceItem>

      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="测点">
          <PointPage @updatePoint="updatePoint" :getData="rowData" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="自定义方案" force-render>
          <CustomPoint ref="CustomPoint" :getPoint="rowData" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script>
import SourceItem from '../scenceManage/components/sourceItem.vue'
import PointPage from './components/pointPage'
import CustomPoint from './components/customPoint'
export default {
  components: {
    SourceItem,
    CustomPoint,
    PointPage
  },
  mounted() {
    this.rowData = JSON.parse(this.$route.query.data)
    // console.log(this.rowData)
  },
  data() {
    return {
      rowData: '',
      getData: []
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    updatePoint(value) {
      console.log('value', value)
      this.getData = value
    },
    callback(key) {
      console.log(key)
      if (key == 2) {
        this.updateCustom()
      }
    },
    updateCustom() {
      // console.log('23jhcdbjdshdsj')
      this.$refs.CustomPoint.loadData()
    }
  }
}
</script>

<style lang="less" scoped>
.card {
  height: 100%;
}
</style>
