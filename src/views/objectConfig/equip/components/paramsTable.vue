<template>
  <div>
    <JEditableTable
      ref="editableTable"
      :columns="columns"
      :dataSource="dataSource"
      :rowNumber="true"
      :rowSelection="isShow"
      :actionButton="isShow"
    >
    </JEditableTable>
  </div>
</template>

<script>
import JEditableTable from '@/components/jeecg/JEditableTable'
import { FormTypes } from '@/utils/JEditableTableUtil'

export default {
  components: {
    JEditableTable
  },
  props: ['data', 'show'],
  data() {
    return {
      dataSource: [],
      isShow: this.show,
      // 表头
      columns: [
        {
          title: '参数名称',
          key: 'paramname',
          type: FormTypes.input,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }]
        },
        {
          title: '参数缺省值',
          key: 'value',
          type: FormTypes.inputNumber,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }]
        },
        {
          title: '超限上限值',
          key: 'upper',
          type: FormTypes.inputNumber,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }]
        },
        {
          title: '超限下限值',
          key: 'lower',
          type: FormTypes.inputNumber,
          placeholder: '请输入${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }]
        },
        {
          title: '单位',
          key: 'unit',
          type: FormTypes.input,
          placeholder: '请选择${title}',
          validateRules: [{ required: true, message: '${title}不能为空' }]
        }
      ]
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    delData() {
      this.$refs.editableTable.initialize()
    },
    loadData() {
      if (this.dataSource.length > 0) {
        // console.log(this.columns)
        let data = this.columns.filter(item => item.title == '参数名称')
        data[0].key = 'name'
      } else {
        let data = this.columns.filter(item => item.title == '参数名称')
        // console.log('adassasa')
        data[0].key = 'paramname'
      }
    }
  },
  watch: {
    show() {
      this.isShow = this.show
    },
    data(newValue) {
      // console.log('newValuenewValuenewValue', newValue)
      this.dataSource = newValue
      this.loadData()
    }
  }
}
</script>

<style lang="less" scoped></style>
