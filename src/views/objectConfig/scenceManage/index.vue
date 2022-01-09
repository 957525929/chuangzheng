<template>
  <div>
    <a-card>
      <Search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="queryParam"
        :formLayout="formLayout"
      />
    </a-card>
    <a-card>
      <!-- <Table ref="table" :columns="columns" :tableData="dataSource" @updateData="updateData" /> -->

      <a-button @click="handleAdd">新增</a-button>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :loading="loading"
        :pagination="{
          ipagination
        }"
        rowkey="id"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleLook(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="list(record)">资源列表</a>
          <a-divider type="vertical" />
          <a @click="knowledge(record)">基础知识</a>
          <a-divider type="vertical" />
          <a @click="specialScence(record)">特殊情景</a>
        </span>
        <template slot="updateTime" slot-scope="text, record">
          {{ record.updateTime | dayjs }}
        </template>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + (index + 1) }}
        </template>
        <span slot="description" slot-scope="text">
          <j-ellipsis :value="text" :length="10" />
        </span>
      </a-table>
      <Modal ref="modalForm" @updateData="updateData" />
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from '@/components/form'
import { sence } from './data/tableData'
import { getSceneList } from '@/api/scene'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import { editDateForSearch } from '@/utils/util'
import Modal from './components/modal.vue'
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
      ...sence,
      url: {
        list: '/programmerweb/SceneController/getSceneList'
      },
      queryParam: {
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
          loading: this.loading,
          handler: () => this.searchData()
        }
      ]
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    searchData() {
      console.log('editDateForSearch(this.queryParam)', editDateForSearch(this.queryParam))
      if (!editDateForSearch(this.queryParam)) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
      this.searchQuery()
    },

    updateData() {
      console.log('asdssa')
      this.loadData()
    }
    // pageChange(page, pageSize) {
    //   this.page = page
    //   this.pageSize = pageSize
    // }
  }
}
</script>

<style lang="scss" scoped></style>
