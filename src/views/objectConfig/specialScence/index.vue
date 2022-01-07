<template>
  <div>
    <a-card>
      <Search ref="search" :sourceData="sourceData" @search="searchData" />
    </a-card>
    <a-card>
      <Table
        ref="table"
        :sourceData="sourceData"
        :columns="columns"
        :tableData="tableData"
        :total="total"
        @search="loadData"
      >
      </Table>
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from './components/search'
import { columns, tableData } from './data/tableData'
import { sight } from '@/api/speciScene'
import moment from 'moment'
let state = {
  nameLK: '',
  startTimeGE: '',
  endTimeLE: '',
  pageNo: 1,
  pageSize: 10,
  sceneIdEQ: ''
}
export default {
  components: {
    Table,
    Search
  },
  data() {
    return {
      columns,
      tableData,
      total: 0,
      sceneOption: [],
      sourceData: {},
      state
    }
  },
  mounted() {
    this.sourceData = JSON.parse(this.$route.query.data)
    this.state.sceneIdEQ = this.sourceData.id
    this.loadData()
  },
  methods: {
    async loadData() {
      this.$refs.table.loading_tab = true
      let params = {}
      let data = this.state
      // debugger
      // 过滤空数据
      for (let key in data) {
        if (data[key]) {
          params[key] = data[key]
        }
      }
      console.log('this.state', params)
      let res = await sight.sceneSight(params)
      if (res.code == 200) {
        // console.log(res.data.list)
        this.tableData = res.data.list
        this.total = res.data.total
        this.$refs.search.loading_but = false
        this.$refs.table.loading_tab = false
      } else {
        this.$refs.search.loading_but = false
        this.$refs.table.loading_tab = false
        this.$message.error(res.message)
      }
      //let data = await getSceneList()
      //this.sceneOption = this.handlerOption(data.data)
    },
    handlerOption(params) {
      return params.map(item => {
        return {
          value: item.name,
          key: item.id
        }
      })
    },
    searchData(value) {
      this.state.nameLK = value.name
      this.state.startTimeGE = value.startTime
      this.state.endTimeLE = value.endTime
      // this.state.pageNo = value.pageNo ? value.pageNo : 1
      this.$refs.search.loading_but = true
      console.log('state', this.state)
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
