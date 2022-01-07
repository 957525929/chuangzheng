<template>
  <div>
    <div>
      <a-card title="监测方法">
        <a-button slot="extra" @click="goBack">返回</a-button>
        <SourceItem :data="rowData" />
        <br />
        <Search ref="search" @search="searchData" />
        <br />
        <MethodTable ref="table" :columns="columns" :tableData="tableData" :data="rowData" @updateData="loadData" />
      </a-card>
    </div>
  </div>
</template>

<script>
import SourceItem from '../scenceManage/components/sourceItem.vue'
import Search from '../scenceManage/components/search.vue'
import MethodTable from './components/methodTable.vue'
import { columns, tableData } from './data/methodTableData'
import { getMethodList } from '@/api/scene'
import moment from 'moment'
export default {
  components: {
    SourceItem,
    Search,
    MethodTable
  },
  mounted() {
    this.rowData = JSON.parse(this.$route.query.data)
    // console.log(this.rowData)
    this.loadData()
  },
  data() {
    return {
      rowData: '',
      columns,
      tableData,
      state: {
        startTime: null,
        endTime: null,
        name: ''
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadData() {
      try {
        // console.log('data1', data1)
        let params = { itemId: this.rowData.id }
        let data1 = this.state
        // 过滤空数据
        for (let key in data1) {
          if (data1[key]) {
            params[key] = data1[key]
          }
        }
        this.$refs.table.loading_tab = true
        console.log(params)
        let res = await getMethodList(params)
        this.tableData = res.data
        this.$refs.table.loading_tab = false
        this.$refs.search.loading_but = false
      } catch (e) {
        console.log(e)
      }
    },
    searchData(value) {
      // let data = {
      //   startTime: value.startTime
      //   endTime: value.endTime
      //   name: value.name
      // }
      this.state.startTime = value.startTime ? moment(value.startTime).format('YYYY-MM-DD HH:mm:ss') : ''
      this.state.endTime = value.endTime ? moment(value.endTime).format('YYYY-MM-DD HH:mm:ss') : ''
      this.state.name = value.name
      // console.log(this.rowData)
      // console.log(data)
      // console.log('search', value)
      this.$refs.search.loading_but = true
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
