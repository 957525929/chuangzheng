<template>
  <div>
    <a-card class="card" title="配件列表">
      <a-button slot="extra" @click="goBack">返回</a-button>
      <SourceItem :data="rowData" />
      <br />
      <Search />
      <br />
      <PartsList :columns="columns" :tableData="tableData" />
    </a-card>
  </div>
</template>

<script>
import SourceItem from '../scenceManage/components/sourceItem.vue'
import Search from './components/search'
import PartsList from './components/partsList'
import { columns, tableData } from './data/partsTableData'
export default {
  components: {
    SourceItem,
    PartsList,
    Search,
  },
  mounted() {
    this.rowData = JSON.parse(this.$route.query.data)
  },
  data() {
    return {
      rowData: '',
      columns,
      tableData,
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<style lang="less" scoped>
</style>