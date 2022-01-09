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
      <!-- <Table ref="table" :columns="columns" :tableData="dataSource" :sceneOption="sceneOption" @updateData="updateData">
      </Table> -->
      <div>
        <a-button @click="handleAdd">新增</a-button>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="{
            ipagination
          }"
          @change="handleTableChange"
          rowkey="id"
        >
          <span slot="action" slot-scope="text, record">
            <a @click="handleLook(record)">查看</a>
            <a-divider type="vertical" />
            <a @click="handleEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a @click="list(record)">资源列表</a>
            <a-divider type="vertical" />
            <a @click="point(record)">测点</a>
            <a-divider type="vertical" />
            <a @click="method(record)">监测方法</a>
            <a-divider type="vertical" />
            <a @click="knowledge(record)">基础知识</a>
          </span>
          <template slot="num" slot-scope="text, record, index">
            {{ (ipagination.current - 1) * ipagination.pageSize + (index + 1) }}
          </template>
          <template slot="updateTime" slot-scope="text, record">
            {{ record.updateTime | dayjs }}
          </template>
          <template slot="scene" slot-scope="text, record">
            {{ record.scene }}
          </template>
          <span slot="description" slot-scope="text">
            <j-ellipsis :value="text" :length="10" />
          </span>
        </a-table>
        <Modal ref="table" @updateData="updateData" v-bind="$attrs" />
      </div>
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from '@/components/form'
// import Search from './components/search'
import { monitor } from './data/tableData'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import Modal from './components/modal.vue'
import moment from 'dayjs'
import { getSceneItemList, getSceneList } from '@/api/scene'
import JEllipsis from '@/components/jeecg/JEllipsis'
export default {
  mixins: [JeecgListMixin],
  components: {
    Table,
    Search,
    Modal,
    JEllipsis
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
      },
      tableData: []
    }
  },
  mounted() {
    setTimeout(() => {
      this.loadSenceData()
    }, 200)
  },
  methods: {
    async loadSenceData() {
      // this.$refs.table.loading_tab = true
      // let params = {}
      // let data1 = this.queryParam
      // // 过滤空数据
      // for (let key in data1) {
      //   if (data1[key]) {
      //     params[key] = data1[key]
      //   }
      // }
      // console.log(params, 'params')
      // let res = await getSceneItemList(params)
      console.log('assaas')
      let data = await getSceneList()
      this.sceneOption = this.handlerOption(data.data)

      let res = this.form_item.filter(item => item.label == '场景')
      let option = [{ label: '全部', value: '' }, ...this.sceneOption]
      res.forEach(item => (item.option = option))
      console.log('this.dataSource', this.dataSource)
      console.log(' this.form_item', res)
      if (this.dataSource && this.sceneOption) {
        for (let key in this.dataSource) {
          for (let v in this.sceneOption) {
            if (this.dataSource[key].sceneId == this.sceneOption[v].key) {
              this.dataSource[key].scene = this.sceneOption[v].label
            }
          }
        }
        this.dataSource = [...this.dataSource]
        console.log('this.dataSource', this.dataSource)
      }
    },
    async updateData() {
      await this.loadData()
      // setTimeout(() => {
      await this.loadSenceData()
      // }, 200)
    },
    handlerOption(params) {
      return params.map(item => {
        return {
          value: item.id,
          label: item.name,
          key: item.id
        }
      })
    },
    async searchData(value) {
      // console.log('value', value)
      // this.queryParam.startTime = value.startTime
      // this.queryParam.endTime = value.endTime
      // this.queryParam.name = value.name
      // this.queryParam.sceneId = value.sceneId
      // this.$refs.search.loading_but = true
      // if (value.sceneId == '') {
      //   delete data.sceneId
      // }
      // console.log(data)
      // console.log('search', value)
      this.loadData()
      await this.loadSenceData()
    }
  },
  watch: {
    dataSource: {
      handler(newVal) {
        // console.log(newVal, 'newVal')
        // this.dataSource = newVal
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
