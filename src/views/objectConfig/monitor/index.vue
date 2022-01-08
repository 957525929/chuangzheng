<template>
  <div>
    <a-card>
      <!-- <Search ref="search" :sceneOption="sceneOption" @search="searchData" /> -->
      <Search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="queryParam"
        :formLayout="formLayout"
      />
    </a-card>
    <a-card>
      <Table ref="table" :columns="columns" :tableData="dataSource" :sceneOption="sceneOption" @updateData="updateData">
      </Table>
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from '@/components/form'
// import Search from './components/search'
import { monitor } from './data/tableData'
import { getSceneItemList, getSceneList } from '@/api/scene'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import moment from 'moment'
export default {
  mixins: [JeecgListMixin],
  components: {
    Table,
    Search
  },
  data() {
    return {
      sceneOption: [],
      queryParam: {
        startTime: '',
        endTime: '',
        name: '',
        sceneId: ''
      },
      ...monitor,
      formLayout: 'inline',
      form_handler: [
        {
          label: '查询',
          key: 'submit',
          icon: 'search',
          loading: this.loading,
          handler: () => this.searchData()
        }
      ],
      url: {
        list: '/programmerweb/SceneItemController/getSceneItemList'
      }
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    async loadSenceData() {
      // this.$refs.table.loading_tab = true
      let params = {}
      let data1 = this.queryParam
      // 过滤空数据
      for (let key in data1) {
        if (data1[key]) {
          params[key] = data1[key]
        }
      }
      // console.log(params, 'params')
      // let res = await getSceneItemList(params)
      let data = await getSceneList()
      this.sceneOption = this.handlerOption(data.data)
      if (this.dataSource && this.sceneOption) {
        for (let key in this.dataSource) {
          for (let v in this.sceneOption) {
            if (this.dataSource[key].sceneId == this.sceneOption[v].key) {
              this.dataSource[key].scene = this.sceneOption[v].value
            }
          }
        }
      }
      // console.log(res.data)
      // this.tableData = res.data
      // this.$refs.table.loading_tab = false
      // this.$refs.search.loading_but = false
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
      this.queryParam.startTime = value.startTime
      this.queryParam.endTime = value.endTime
      this.queryParam.name = value.name
      this.queryParam.sceneId = value.sceneId
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
