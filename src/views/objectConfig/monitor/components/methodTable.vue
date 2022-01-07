<template>
  <div>
    <a-button @click="add">新增</a-button>
    <a-table :loading="loading_tab" :columns="columns" :data-source="tableData">
      <span slot="action" slot-scope="text, record">
        <a @click="look(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="list(record)">资源列表</a>
        <a-divider type="vertical" />
        <a @click="process(record)">活动配置</a>
        <a-divider type="vertical" />
        <a @click="knowledge(record)">基础知识</a>
        <a-divider type="vertical" />
        <a-popconfirm :title="`是否删除监测方法(${record.name})?`" ok-text="确定" cancel-text="取消"  @confirm="del(record)">
          <a href="#">删除</a>
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
import Modal from '../../monitor/components/methodModal.vue'
import { getMethodList, deleteMethod } from '@/api/scene'
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
      rowData: '',
      loading_tab: false
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
      // try {
      //   console.log(this.data.id)
      //   let params = {
      //     itemId: this.data.id
      //   }
      //   let res = await getMethodList(params)
      //   this.tableData = res.data
      // } catch (e) {
      //   console.log(e)
      // }
      this.$emit('updateData')
    },
    updateData(index, data) {
      this.loadData()
    },
    knowledge(v) {
      v.type = 3
      this.$router.push('/objectConfig/cardManage/index?data=' + JSON.stringify(v))
    },
    async del(v) {
      let data = new FormData()
      data.append('methodId', v.id)
      const res = await deleteMethod(data);
      if(res.code == 200) {
        this.$message.success('删除成功!!!')
      } else {
        this.$message.error(res.message)
      }
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
