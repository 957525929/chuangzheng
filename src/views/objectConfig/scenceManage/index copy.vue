<template>
  <div>
    <a-card>
      <Search ref="search" @search="searchData" />
    </a-card>
    <a-card>
      <Table ref="table" :columns="columns" :tableData="tableData" @updateData="updateData" />
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from './components/search'
import { columns, tableData } from './data/tableData'
import { getSceneList } from '@/api/scene'
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
      state: {
        startTime: null,
        endTime: null,
        name: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      // console.log('data', data)
      let params = {}
      // 过滤空数据
      let data = this.state
      for (let key in data) {
        if (data[key]) {
          params[key] = data[key]
        }
      }
      // console.log('params', params)
      // console.log(' this.$refs.table.loading_tab', this.$refs.table.loading_tab)
      this.$refs.table.loading_tab = true
      let res = await getSceneList(params)
      this.tableData = res.data
      this.$refs.table.loading_tab = false
      this.$refs.search.loading_but = false
    },
    updateData() {
      this.loadData()
    },
    searchData(value) {
      this.state.startTime = value.startTime
      this.state.endTime = value.endTime
      this.state.name = value.name

      this.$refs.search.loading_but = true
      // console.log(data)
      // console.log('search', value)
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
