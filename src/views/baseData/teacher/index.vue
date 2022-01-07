<template>
  <div>
    <a-card>
      <Search ref="search" @search="searchData" />
    </a-card>
    <a-card>
      <Table ref="table" :columns="columns"  @updateData="updateData" />
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from './components/search'
import { columns, } from './data/tableData'
import { teacherApi } from '@/api/teacher'
import moment from 'moment'

export default {
  components: {
    Table,
    Search
  },
  data() {
    return {
      columns,
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
    async loadData(data) {
      console.log('data', data)
      // setTimeout(() => (this.$refs.search.loading_but = false), 500)
      // debugger
      this.$refs.table.loadData(data)
    },
    searchData(value) {
      let data = {
        startTime: value.startTime,
        endTime: value.endTime,
        name: value.name
        // account: value.account
      }
      // console.log(data)
      this.$refs.search.loading_but = true
      // console.log('search', value)
      this.loadData(data)
    },
    updateData() {
      this.$refs.search.loading_but = false
    }
  }
}
</script>

<style lang="scss" scoped></style>
