<template>
  <div>
    <div>
      <a-card title="知识卡条目">
        <a-button slot="extra" @click="goBack">返回</a-button>
        <SourceItem :data="rowData" />
        <br />
        <Search @search="searchData" />
        <br />
        <MethodTable :columns="columns" :tableData="tableData" :data="rowData" />
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
import { cardApi } from '@/api/card'
import moment from 'moment'
export default {
  components: {
    SourceItem,
    Search,
    MethodTable
  },
  mounted() {
    this.rowData = JSON.parse(this.$route.query.data)
    console.log(this.rowData)
    this.loadData()
  },
  data() {
    return {
      rowData: '',
      columns,
      tableData
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadData(data1) {
      try {
        console.log('data1', this.rowData)
        let params = { cardId: this.rowData.id }
        // 过滤空数据
        // for (let key in data1) {
        //   if (data1[key]) {
        //     params[key] = data1[key]
        //   }
        // }
        // if (data1) {
        //   params = data1
        // } else {
        //   params = {}
        // }
        console.log(params)
        // return false
        let res = await cardApi.loadCard(this.rowData.id)
        if (res.code == 200) {
          console.log(res.data, 'asdasassa')
          this.tableData = res.data
        }
        // this.tableData = res.data
      } catch (e) {
        console.log(e)
      }
    },
    searchData(value) {
      let data = {
        startTime: value.startTime ? moment(value.startTime).format('YYYY-MM-DD HH:mm:ss') : '',
        endTime: value.endTime ? moment(value.endTime).format('YYYY-MM-DD HH:mm:ss') : '',
        name: value.name
      }
      // console.log(this.rowData)
      // console.log(data)
      // console.log('search', value)
      this.loadData(data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
