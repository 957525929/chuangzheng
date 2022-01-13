<template>
  <div>
    <a-card>
      <!-- <Search ref="search" :show="true" @search="searchData" :getTypeData="getTypeData" /> -->
      <Search
        ref="search"
        :formItem="form_item"
        :formHandler="form_handler"
        :formData="queryParam"
        :formLayout="formLayout"
      />
    </a-card>
    <a-card>
      <!-- <Table ref="table" :columns="columns" :tableData="tableData" :getTypeData="getTypeData" @updateData="loadData" /> -->
      <a-button @click="handleAdd">新增</a-button>
      <a-table
        :columns="columns"
        :data-source="dataSource"
        rowKey="id"
        :loading="loading"
        :pagination="{
          ipagination
        }"
        @change="handleTableChange"
      >
        <span slot="action" slot-scope="text, record">
          <a @click="handleLook(record)">查看</a>
          <a-divider type="vertical" />
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="list(record)">资源列表</a>
          <a-divider type="vertical" />
          <a @click="parts(record)">配件列表</a>
          <a-divider type="vertical" />
          <a @click="params(record)">参数配置</a>
          <a-divider type="vertical" />
          <a @click="knowledge(record)">基础知识</a>
          <a-divider type="vertical" />
          <a-popconfirm
            :title="`是否删除仪器(${record.name})?`"
            ok-text="确定"
            cancel-text="取消"
            @confirm="del(record)"
          >
            <a href="#">删除</a>
          </a-popconfirm>
        </span>
        <template slot="num" slot-scope="text, record, index">
          {{ (ipagination.current - 1) * ipagination.pageSize + (index + 1) }}
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
      <Modal ref="modalForm" @updateData="updateData" :getTypeData="getTypeData" />
    </a-card>
  </div>
</template>

<script>
import Table from './components/table'
import Search from '@/components/form'
import { equip } from './data/tableData'
import { getEquipmentList, getEqType, deleteEquipment } from '@/api/equip'
import moment from 'moment'
import Modal from './components/modal.vue'
import JEllipsis from '@/components/jeecg/JEllipsis'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
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
      ...equip,
      getTypeData: [],
      queryParam: {
        startTime: null,
        endTime: null,
        name: '',
        type: ''
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
      ],
      url: {
        list: '/programmerweb/EquipmentController/getEquipmentList'
      }
    }
  },
  mounted() {},
  methods: {
    async getType() {
      try {
        let res = await getEqType()
        if (res.code == 200) {
          let data = this.handlerData(res.data)
          this.getTypeData = data
          let res_type = this.form_item.filter(item => item.label == '类型')
          let option = [{ label: '全部', value: '' }, ...this.getTypeData]
          res_type.forEach(item => (item.option = option))
          this.tableData = this.dataSource.filter(item => {
            let res = this.getTypeData.find(v => v.key == item.actType)
            res && (item.typeName = res.value)
            return item
          })
          // console.log('data', data)
        }
        // console.log(res, 'res')
      } catch (e) {
        console.log(e)
      }
    },
    handlerData(data) {
      return data.map(i => {
        return {
          value: i.dictValue,
          label: i.dictValue,
          key: i.dictCode
        }
      })
    },
    searchData(value) {
      this.loadData()
    },
    updateData(index, data) {
      // console.log('2323232ddddd')
      this.loadData()
    },
    parts(v) {
      this.$router.push('/objectConfig/equip/parts?data=' + JSON.stringify(v))
    },
    params(v) {
      this.$router.push('/objectConfig/equip/params?data=' + JSON.stringify(v))
    }
  },
  watch: {
    dataSource: {
      handler() {
        this.getType()
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
