<template>
  <div>
    <a-button @click="add()">新增</a-button>
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
        <a-popconfirm title="确定要删除该资源吗？" @confirm="del(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
      <template slot="createTime" slot-scope="text, record">
        {{ record.createTime | dayjs }}
      </template>
      <template slot="num" slot-scope="text, record, index">
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
    </a-table>
    <SourceModal
      ref="SourceModal"
      :visible.sync="visible"
      :tid="tid"
      :title="title"
      :rowData="rowData"
      :id="id"
      @updateData="updateData"
    />
  </div>
</template>

<script>
import SourceModal from './sourceModal.vue'
import { getResourceList, delResource } from '@/api/eleManageApi'
import { guid } from '@/utils/util'
export default {
  components: {
    SourceModal
  },
  mounted() {
    // console.log('22222')
    // console.log('id', this.id)
  },
  data() {
    return {
      visible: false,
      title: '',
      rowData: '',
      page: '',
      pageSize: '',
      tid: '',
      loading_tab: false
    }
  },
  props: ['columns', 'tableData', 'id'],
  methods: {
    add() {
      this.visible = true
      this.title = '新增'
      this.rowData = ''
      this.tid = guid()
      console.log(this.tid)
      this.$refs.SourceModal.clear()
    },
    look(v) {
      this.visible = true
      this.title = '查看'
      this.rowData = v
      this.$refs.SourceModal.editSoucerce(v)
    },
    edit(v) {
      this.visible = true
      this.title = '编辑'
      this.rowData = v
      this.tid = guid()
      console.log(this.tid)
      this.$refs.SourceModal.editSoucerce(v)
    },
    async del(record) {
      console.log('22221111')
      const formData = new FormData()
      formData.append('resId', record.id)
      try {
        let res = await delResource(formData)
        console.log(res)
        if (res.code == 200) {
          this.loadData()
          this.$message.success('删除成功')
        }
      } catch (err) {
        console.log(err)
      }
    },
    async loadData() {
      // console.log(this.rowData, '11111')
      // try {
      //   let params = {
      //     pathNodeId: this.id
      //   }
      //   console.log(params)
      //   let res = await getResourceList(params)
      //   console.log(res.data)
      //   this.tableData = this.handChange(res.data)
      // } catch (e) {
      //   console.log(e)
      // }
      this.$emit('updataData')
    },
    handChange(data) {
      return data.map(item => {
        item.resUrl = item.resUrl + '?' + new Date().getTime()
        return item
      })
    },
    updateData(index, data) {
      this.loadData()
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    }
  }
}
</script>

<style lang="scss" scoped></style>
