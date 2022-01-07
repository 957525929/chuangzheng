<template>
  <div>
    <a-card>
      <Search ref="search" :show="true" @search="searchData" :getTypeData="getTypeData" />
    </a-card>
    <a-card>
      <Table ref="table" :columns="columns" :tableData="tableData" :getTypeData="getTypeData" @updateData="loadData" />
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from './components/search'
import { columns, tableData } from './data/tableData'
import { getEquipmentList, getEqType } from '@/api/equip'
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
      getTypeData: [],
      state: {
        startTime: '',
        endTime: '',
        name: '',
        type: ''
      }
    }
  },
  mounted() {
    this.getType()
    this.loadData()
  },
  methods: {
    async loadData() {
      console.log('asdasdasdasadsass')
      this.$refs.table.loading_tab = true
      try {
        let params = {}
        let data = this.state
        // 过滤空数据
        for (let key in data) {
          if (data[key]) {
            params[key] = data[key]
          }
        }
        console.log(params, 'params')
        let res = await getEquipmentList(params)
        if (res.data) {
          this.tableData = res.data.filter(item => {
            let res = this.getTypeData.find(v => v.key == item.actType)
            res && (item.typeName = res.value)
            return item
          })
        }
        this.$refs.table.loading_tab = false
        this.$refs.search.loading_but = false
      } catch (e) {
        console.log(e)
        this.$refs.table.loading_tab = false
        this.$refs.search.loading_but = false
      }
    },
    async getType() {
      try {
        let res = await getEqType()
        if (res.code == 200) {
          let data = this.handlerData(res.data)
          this.getTypeData = data
          console.log('data', data)
        }
        console.log(res, 'res')
      } catch (e) {
        console.log(e)
      }
    },
    handlerData(data) {
      return data.map(i => {
        return {
          value: i.dictValue,
          key: i.dictCode
        }
      })
    },
    searchData(value) {
      // let data = {
      //   startTime: value.startTime,
      //   endTime: value.endTime,
      //   name: value.name,
      //   actType: value.actType
      // }
      this.state.startTime = value.startTime
      this.state.endTime = value.endTime
      this.state.name = value.name
      this.state.type = value.actType
      // if (value.sceneId == '') {
      //   delete data.sceneId
      // }
      this.$refs.search.loading_but = true
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
