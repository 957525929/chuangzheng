<template>
  <div>
    <a-button @click="add">新增</a-button>
    <a-table :columns="columns" :data-source="tableData">
      <span slot="action" slot-scope="text, record">
        <a @click="look(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="list(record)">资源列表</a>
      </span>
    </a-table>
    <Modal :visible.sync="visible" :title="title" :rowData="rowData" @updateData="updateData" />
  </div>
</template>

<script>
import Modal from './modal'
export default {
  components: {
    Modal,
  },
  props: ['columns', 'tableData'],
  data() {
    return {
      visible: false,
      title: '',
      rowData: '',
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
      this.$router.push('/objectConfig/scenceManage/sourceList?data=' + JSON.stringify(v))
    },
    updateData(index, data) {
      if(index == '新增') {
        this.tableData.push(data)
      } else {
        this.tableData.map(item => {
          if(item.key == data.key) {
            item.name = data.name;
            item.eName = data.eName;
          }
          return item;
        })
      }
    }
  },
}
</script>

<style lang="scss" scoped>
</style>