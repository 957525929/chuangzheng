<template>
  <div>
    <a-button @click="add">新增</a-button>
    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading_tab"
      :pagination="{
        total: total,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        onChange: pageChange
      }"
    >
      <span slot="action" slot-scope="text, record">
        <!-- <a @click="cardRank(record)">知识卡条目</a>
        <a-divider type="vertical" /> -->
        <a @click="edit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="list(record)">资源列表</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="是否确定删除该基础知识?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirm(record.id)"
          @cancel="cancel"
        >
          <a>删除</a>
        </a-popconfirm>
      </span>
      <template slot="num" slot-scope="text, record, index">
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
      <template slot="updateTime" slot-scope="text, record">
        {{ record.updateTime | dayjs }}
      </template>
    </a-table>
    <Modal :base="base" ref="table" @updateData="updateData" />
  </div>
</template>

<script>
import Modal from './modal'
import moment from 'dayjs'
import { getSceneItemList, getSceneList } from '@/api/scene'
import { cardApi } from '@/api/card'
import { editDateForSearch } from '@/utils/util'
export default {
  components: {
    Modal
  },
  props: ['columns', 'tableData', 'sourceData', 'total'],
  data() {
    return {
      visible: true,
      title: '',
      rowData: '',
      getData: [],
      moment,
      page: '',
      pageSize: '',
      base: {
        objId: '',
        objType: ''
      },
      loading_tab: false
    }
  },
  methods: {
    add() {
      this.$refs.table.showModal('add')
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
    point(v) {
      this.$router.push('/objectConfig/monitor/cePoint?data=' + JSON.stringify(v))
    },
    cardRank(v) {
      this.$router.push('/objectConfig/cardManage/cardRank?data=' + JSON.stringify(v))
    },
    updateData() {
      this.$emit('search', { pageNo: 1 })
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.$emit('search', { pageNo: this.page })
    },
    async confirm(key) {
      try {
        let res = await cardApi.deleteCard(key)
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.updateData()
        }
      } catch (e) {
        console.log(e)
      }
      console.log(e)
    },
    cancel() {}
  },
  watch: {
    sourceData: {
      handler(newValue, oldValue) {
        this.base = {
          objId: newValue.id,
          objType: newValue.type
        }
      },
      deep: true,
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
