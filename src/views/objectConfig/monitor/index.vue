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
          :data-source="tableData"
          :loading="loading"
          :pagination="{
            ipagination
          }"
          @change="handleTableChange"
          row-key="id"
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
        <Modal ref="modalForm" @updateData="updateData" :sceneOption="sceneOption" />
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
        startTime: null,
        endTime: null,
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
      tableData: [],
      getKey: false
    }
  },
  mounted() {
    // setTimeout(() => {
    //   this.loadSenceData()
    // }, 200)
    // this.loadSence()
  },
  methods: {
    async loadSence() {
      let data = await getSceneList()
      this.sceneOption = this.handlerOption(data.data)
      let res = this.form_item.filter(item => item.label == '场景')
      let option = [{ label: '全部', value: '' }, ...this.sceneOption]
      res.forEach(item => (item.option = option))
    },
    async loadSenceData() {
      let data1 = await getSceneList()
      this.sceneOption = this.handlerOption(data1.data)
      let res = this.form_item.filter(item => item.label == '场景')
      let option = [{ label: '全部', value: '' }, ...this.sceneOption]
      res.forEach(item => (item.option = option))
      let data = [...this.dataSource]
      if (data && this.sceneOption) {
        for (let key in data) {
          for (let v in this.sceneOption) {
            if (data[key].sceneId == this.sceneOption[v].key) {
              data[key].scene = this.sceneOption[v].label
            }
          }
        }
        this.tableData = [...data]
      }
    },
    async updateData() {
      await this.loadData()
      // setTimeout(() => {
      // await this.loadSenceData()
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
      this.loadData()
    }
  },
  watch: {
    dataSource: {
      handler(newVal) {
        // console.log(newVal, 'newVal')
        this.loadSenceData()
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
