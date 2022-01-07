<template>
  <div>
    <a-card>
      <Search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="state"
        :formLayout="formLayout"
      />
    </a-card>
    <a-card>
      <Table ref="table" :columns="columns" :tableData="tableData" @updateData="updateData" />
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from '@/components/form'
import { sence } from './data/tableData'
import { getSceneList } from '@/api/scene'
import moment from 'moment'
import { editDateForSearch } from '@/utils/util'
export default {
  components: {
    Table,
    Search
  },
  data() {
    return {
      ...sence,

      state: {
        startTime: null,
        endTime: null,
        name: ''
      },
      formLayout: 'inline',
      form_handler: [
        {
          label: '查询',
          key: 'submit',
          icon: 'search',
          loading: false,
          handler: () => this.searchData()
        }
      ]
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
      this.$refs.table.loading_tab = true
      let res = await getSceneList(params)
      this.tableData = res.data
      this.$refs.table.loading_tab = false
      this.form_handler[0].loading = false
    },
    updateData() {
      this.loadData()
    },
    searchData( ) {
      if (!(this.state = editDateForSearch(this.state))) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
      this.form_handler[0].loading = true
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
