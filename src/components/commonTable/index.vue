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
      <template :slot="action" slot-scope="text, record">
        <slot name="action" v-bind="record"></slot>
      </template>
    </a-table>
  </div>
</template>

<script>
import JEllipsis from '@/components/jeecg/JEllipsis'
export default {
  components: {
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
