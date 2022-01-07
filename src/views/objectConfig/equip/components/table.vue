<template>
  <div>
    <a-button @click="add">新增</a-button>
    <a-table
      :columns="columns"
      :data-source="tableData"
      rowKey="id"
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
        <a @click="parts(record)">配件列表</a>
        <a-divider type="vertical" />
        <a @click="params(record)">参数配置</a>
        <a-divider type="vertical" />
        <a @click="knowledge(record)">基础知识</a>
        <a-divider type="vertical" />
        <a-popconfirm :title="`是否删除仪器(${record.name})?`" ok-text="确定" cancel-text="取消"  @confirm="del(record)">
          <a href="#">删除</a>
        </a-popconfirm>
      </span>
      <template slot="num" slot-scope="text, record, index">
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
      <template slot="updateTime" slot-scope="text, record">
        {{ record.updateTime | dayjs }}
      </template>
      <template slot="actType" slot-scope="text, record">
        {{ record.typeName }}
      </template>
      <span slot="description" slot-scope="text">
        <j-ellipsis :value="text" :length="10" />
      </span>
    </a-table>
    <Modal
      :visible.sync="visible"
      :title="title"
      :rowData="rowData"
      @updateData="updateData"
      :getTypeData="getTypeData"
    />
  </div>
</template>

<script>
import Modal from './modal'
import { getEquipmentList, deleteEquipment } from '@/api/equip'
import JEllipsis from '@/components/jeecg/JEllipsis'

export default {
  components: {
    Modal,
    JEllipsis
  },
  props: ['columns', 'tableData', 'getTypeData'],
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
      this.title = '新增仪器'
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
      this.$router.push('/objectConfig/scenceManage/sourceList?data=' + JSON.stringify(v))
    },
    parts(v) {
      this.$router.push('/objectConfig/equip/parts?data=' + JSON.stringify(v))
    },
    params(v) {
      this.$router.push('/objectConfig/equip/params?data=' + JSON.stringify(v))
    },
    async loadData() {
      // try {
      //   let res = await getEquipmentList()
      //   this.tableData = res.data
      //   console.log(res.data)
      // } catch (e) {
      //   console.log(e)
      // }
      this.$emit('updateData')
    },
    updateData(index, data) {
      console.log('2323232ddddd')
      this.loadData()
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    },
    knowledge(v) {
      v.type = 5
      this.$router.push('/objectConfig/cardManage/index?data=' + JSON.stringify(v))
    },
    async del(v) {
       let data = new FormData()
       data.append('eqId', v.id)
       const res = await deleteEquipment(data);
       if(res.code == 200) {
         this.$message.success('仪器删除成功!!!')
       } else {
         this.$message.error(res.message)
       }
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
