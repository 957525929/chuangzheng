<template>
  <div>
    <a-button @click="add">新增</a-button>
    <a-table :columns="columns" :data-source="tableData">
      <span slot="action" slot-scope="text, record">
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="list(record)">资源列表</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="是否确定删除该条目?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirm(record.id)"
          @cancel="cancel"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
      <template slot="updateTime" slot-scope="text, record">
        {{ record.updateTime | dayjs }}
      </template>
    </a-table>
    <Modal ref="table" @updateData="updateData" />
  </div>
</template>

<script>
import Modal from './methodModal.vue'
import { cardApi } from '@/api/card'
export default {
  components: {
    Modal
  },
  props: ['columns', 'tableData', 'data'],
  mounted() {
    // console.log('data', data)
  },
  data() {
    return {
      visible: false,
      title: '',
      rowData: ''
    }
  },
  methods: {
    add() {
      console.log('121221121')
      this.$refs.table.showModal('add', this.data)
      console.log(this.visible)
    },
    look(v) {
      console.log(v)
      this.$refs.table.showModal('look', v)
    },
    edit(v) {
      this.$refs.table.showModal('edit', v)
      console.log(v)
    },
    list(v) {
      this.$router.push('/objectConfig/scenceManage/sourceList?data=' + JSON.stringify(v))
    },
    process(v) {
      v.cName = this.data.name
      this.$router.push('/objectConfig/monitor/process?data=' + JSON.stringify(v))
    },
    async loadData() {
      try {
        console.log(this.data.id)

        let res = await cardApi.loadCard(this.data.id)
        if (res.code == 200) {
          console.log(res.data, 'asdasassa')
          this.tableData = res.data
        }
      } catch (e) {
        console.log(e)
      }
    },
    updateData(index, data) {
      this.loadData()
    },
    async confirm(key) {
      try {
        let res = await cardApi.deleteCardRow(key)
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.loadData()
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
