<template>
  <div>
    <a-card>
      <Search ref="search" :sceneOption="sceneOption" @search="searchData" />
    </a-card>
    <a-card>
      <Table ref="table" :columns="columns" :tableData="tableData" :sceneOption="sceneOption" @updateData="updateData">
      </Table>
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from './components/search'
import { columns, tableData } from './data/tableData'
import { getSceneItemList, getSceneList } from '@/api/scene'

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
      sceneOption: [],
      state: {
        startTime: '',
        endTime: '',
        name: '',
        sceneId: ''
      }
    }
  },
  mounted() {
    this.loadData()
  },
  methods: {
    async loadData() {
      this.$refs.table.loading_tab = true
      let params = {}
      let data1 = this.state
      // 过滤空数据
      for (let key in data1) {
        if (data1[key]) {
          params[key] = data1[key]
        }
      }
      console.log(params, 'params')
      let res = await getSceneItemList(params)
      let data = await getSceneList()
      this.sceneOption = this.handlerOption(data.data)
      if (res && this.sceneOption) {
        for (let key in res.data) {
          for (let v in this.sceneOption) {
            if (res.data[key].sceneId == this.sceneOption[v].key) {
              res.data[key].scene = this.sceneOption[v].value
            }
          }
        }
      }
      console.log(res.data)
      this.tableData = res.data
      this.$refs.table.loading_tab = false
      this.$refs.search.loading_but = false
    },
    updateData() {
      this.loadData()
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
      console.log('value', value)
      this.state.startTime = value.startTime
      this.state.endTime = value.endTime
      this.state.name = value.name
      this.state.sceneId = value.sceneId
      this.$refs.search.loading_but = true
      // if (value.sceneId == '') {
      //   delete data.sceneId
      // }
      // console.log(data)
      // console.log('search', value)
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
