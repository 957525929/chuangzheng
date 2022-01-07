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
import { getSceneItemList, getSceneList } from '@/api/scene'
import { cardApi } from '@/api/card'
import moment from 'moment'
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
      search: {
        objIdEQ: '',
        pageNo: 1,
        pageSize: 10,
        startTimeGE: '',
        endTimeLE: '',
        nameLk: ''
      }
    }
  },
  mounted() {
    this.sourceData = JSON.parse(this.$route.query.data)
    this.search.objIdEQ = this.sourceData.id
    this.loadData()
  },
  methods: {
    async loadData() {
      this.$refs.table.loading_tab = true
      // console.log('this.search', this.search)
      let res = await cardApi.paging(this.search)
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
      this.search.startTimeGE = value.startTime
      this.search.endTimeLE = value.endTime
      this.search.nameLk = value.name
      this.search.pageNo = value.pageNo ? value.pageNo : 1
      this.$refs.search.loading_but = true
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
