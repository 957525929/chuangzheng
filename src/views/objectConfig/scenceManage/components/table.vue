<template>
  <div>
    <a-button @click="add">新增</a-button>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading_tab"
      :pagination="{
        total: tableData.length,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        onChange: pageChange
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="look(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
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
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
      <span slot="description" slot-scope="text">
        <j-ellipsis :value="text" :length="10" />
      </span>
    </a-table>
    <Modal :visible.sync="visible" :title="title" :rowData="rowData" @updateData="updateData" />
  </div>
</template>

<script>
import Modal from './modal'
import JEllipsis from '@/components/jeecg/JEllipsis'
export default {
  components: {
    Modal,
    JEllipsis
  },
  props: ['columns', 'tableData'],
  data() {
    return {
      visible: false,
      title: '',
      rowData: '',
      page: '',
      pageSize: '',
      loading_tab: false
    }
  },
  methods: {
    add() {
      this.visible = true
      this.title = '新增'
      this.rowData = ''
    },
    look(v) {
      this.visible = true
      this.title = '查看'
      this.rowData = v
    },
    edit(v) {
      this.visible = true
      this.title = '编辑'
      this.rowData = v
    },
    list(v) {
      console.log(v)
      this.$router.push('/objectConfig/scenceManage/sourceList?data=' + JSON.stringify(v))
    },
    async loadData(data) {
      // let res = await getSceneList(data)
      // this.tableData = res.data
      this.$emit('updateData')
    },
    updateData(index, data) {
      this.loadData()
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    },
    knowledge(v) {
      v.type = 1
      this.$router.push('/objectConfig/cardManage/index?data=' + JSON.stringify(v))
    },
    specialScence(v) {
      this.$router.push('/objectConfig/specialScence/index?data=' + JSON.stringify(v))
    }
  }
}
</script>

<style lang="scss" scoped></style>
