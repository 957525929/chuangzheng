<template>
  <div>
    <a-card title="资源列表">
      <a-button slot="extra" @click="goBack">返回</a-button>
      <SourceItem :data="rowData" />
      <br />
      <SourceSearch ref="search" @search="searchData" />
      <br />
      <SourceTable
        ref="table"
        :columns="columns"
        :tableData="tableData"
        :id="rowData.pathNodeId"
        @updataData="loadData"
      />
    </a-card>
  </div>
</template>

<script>
import SourceItem from './components/sourceItem'
import SourceSearch from './components/sourceSearch'
import SourceTable from './components/sourceTable'
import { columns } from './data/sourceTableData'
import { getResourceList } from '@/api/eleManageApi'
import moment from 'moment'
export default {
  components: {
    SourceItem,
    SourceSearch,
    SourceTable
  },
  mounted() {
    this.rowData = JSON.parse(this.$route.query.data)
    this.loadData()
  },
  data() {
    return {
      rowData: '',
      columns,
      tableData: [],
      state: {
        startTime: null,
        endTime: null,
        resName: '',
        resType: ''
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadData() {
      // console.log(this.rowData, '11111')
      this.$refs.table.loading_tab = true
      try {
        let params = { pathNodeId: this.rowData.pathNodeId }
        // if (data) {
        //   params = data
        // } else {
        //   params = {
        //     pathNodeId: this.rowData.pathNodeId
        //   }
        // }
        let data = this.state
        // 过滤空数据
        for (let key in data) {
          if (data[key]) {
            params[key] = data[key]
          }
        }
        // console.log(params)
        let res = await getResourceList(params)
        // console.log(res.data)
        this.tableData = this.handChange(res.data)
        this.$refs.table.loading_tab = false
        this.$refs.search.loading_but = false
      } catch (e) {
        this.$refs.table.loading_tab = false
        this.$refs.search.loading_but = false
        console.log(e)
      }
    },
    handChange(data) {
      return data.map(item => {
        item.resUrl = item.resUrl + '?' + new Date().getTime()
        return item
      })
    },
    searchData(value) {
      // let data = {
      //   startTime: value.startTime,
      //   endTime: value.endTime,
      //   resName: value.resName,
      //   resType: value.resType
      // }
      this.state.startTime = value.startTime
      this.state.endTime = value.endTime
      this.state.resName = value.resName
      this.state.resType = value.resType
      // if (data.resType == '全部') {
      //   delete data.resType
      // }
      this.$refs.search.loading_but = true
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
