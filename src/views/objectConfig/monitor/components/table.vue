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
        <a @click="point(record)">测点</a>
        <a-divider type="vertical" />
        <a @click="method(record)">监测方法</a>
        <a-divider type="vertical" />
        <a @click="knowledge(record)">基础知识</a>
      </span>
      <template slot="num" slot-scope="text, record, index">
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
      <template slot="updateTime" slot-scope="text, record">
        {{ record.updateTime | dayjs }}
      </template>
      <span slot="description" slot-scope="text">
        <j-ellipsis :value="text" :length="10" />
      </span>
    </a-table>
    <Modal ref="table" @updateData="updateData" v-bind="$attrs" />
  </div>
</template>

<script>
import Modal from './modal'
import moment from 'dayjs'
import { getSceneItemList, getSceneList } from '@/api/scene'
import JEllipsis from '@/components/jeecg/JEllipsis'
export default {
  components: {
    Modal,
    JEllipsis
  },
  props: ['columns', 'tableData'],
  data() {
    return {
      visible: true,
      title: '',
      rowData: '',
      getData: [],
      moment,
      page: '',
      pageSize: '',
      loading_tab: false
    }
  },
  methods: {
    add() {
      console.log('121221121')
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
    method(v) {
      this.$router.push('/objectConfig/monitor/ceMethod?data=' + JSON.stringify(v))
    },
    async loadData() {
      // let data = await getSceneList()
      // console.log(data.data)
      // if (data) {
      //   for (let key in data.data) {
      //     this.getData.push({ name: data.data[key].name, id: data.data[key].id })
      //   }
      //   let res = await getSceneItemList()
      //   this.tableData = res.data
      //   if (res) {
      //     for (let key in res.data) {
      //       for (let v in this.getData) {
      //         if (res.data[key].sceneId == this.getData[v].id) {
      //           res.data[key].scene = this.getData[v].name
      //         }
      //       }
      //     }
      //   }
      // }
      this.$emit('updateData')
    },
    updateData(index, data) {
      // console.log('121121212')
      this.loadData()
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    },
    knowledge(v) {
      v.type = 2
      this.$router.push('/objectConfig/cardManage/index?data=' + JSON.stringify(v))
    }
  },
  watch: {
    // hadData(newvalue) {
    //   console.log('newvalue', newvalue)
    // },
    // deep: true
    // sceneOption: {
    //   handler(newValue, oldValue) {
    //     console.log(newValue)
    //     this.loadData()
    //   },
    //   deep: true,
    //   immediate: true
    // },
    // hadData: {
    //   handler(newValue, oldValue) {
    //     console.log('1212122')
    //     console.log(newValue, oldValue)
    //   },
    //   deep: true,
    //   immediate: true
    // }
  }
}
</script>

<style lang="scss" scoped></style>
