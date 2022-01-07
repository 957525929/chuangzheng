<template>
  <div>
    <a-card class="card" title="参数配置">
      <a-button slot="extra" @click="goBack">返回</a-button>
      <SourceItem :data="rowData" />
      <br />
      <!-- <ParamsList :rowData="rowData" /> -->
      <ParamsTable :data="dataExample" :show="false" ref="paramsTable" />
      <br />
      <a-form-item class="btn-position">
        <a-button type="primary" @click="handlerOk" v-if="dataExample.length != 0"> 保存 </a-button>
        <!-- <a-button style="margin-left: 30px" html-type="reset"> 重置 </a-button> -->
      </a-form-item>
    </a-card>
  </div>
</template>

<script>
import SourceItem from '../scenceManage/components/sourceItem.vue'
// import ParamsList from './components/paramsList'
import ParamsTable from './components/paramsTable'
import { columns, tableData } from './data/paramsTableData'
import { getEqPara, updateEqParam } from '@/api/equip'
export default {
  components: {
    SourceItem,
    // ParamsList
    ParamsTable
  },
  created() {
    this.rowData = JSON.parse(this.$route.query.data)
    this.loadData()
  },
  data() {
    return {
      rowData: '',
      columns,
      tableData,
      dataExample: [],
      oldDataExample: []
    }
  },
  watch: {
    dataExample(newValue) {}
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    async loadData() {
      try {
        let params = {
          id: this.rowData.id
        }
        let res = await getEqPara(params)

        console.log(res.data)
        this.dataExample = res.data
        this.oldDataExample = res.data
        this.oldDataExample = this.oldDataExample.map(item => {
          return {
            id: item.id,
            name: item.name,
            value: item.value,
            upper: item.upper,
            lower: item.lower,
            unit: item.unit
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    handlerOk() {
      this.$refs.paramsTable.$refs.editableTable.getValues((error, values) => {
        // // 错误数 = 0 则代表验证通过
        if (error === 0) {
          this.update_table(values)
        } else {
          this.$message.error('验证未通过')
          return false
        }
      })
    },
    async update_table(value) {
      // console.log(JSON.stringify(this.oldDataExample))
      // console.log(JSON.stringify(value), 'value')
      if (JSON.stringify(this.oldDataExample) == JSON.stringify(value)) {
        return false
      }
      try {
        let data = value.map(item => {
          item.equipmentId = this.rowData.id
          return item
        })
        let res = await updateEqParam(data)
        if (res.code == 200) {
          this.$message.success('修改成功')
          this.loadData()
        }
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.btn-position {
  display: flex;
  justify-content: flex-end;
}
</style>
