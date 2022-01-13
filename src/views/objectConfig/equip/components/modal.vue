<template>
  <div>
    <a-modal width="70%" :title="title" :visible="visible" @cancel="closeModal">
      <template slot="footer">
        <a-button @click="closeModal">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="仪器类型">
          <a-select
            v-decorator="[
              'actType',
              { initialValue: formData.actType, rules: [{ required: true, message: '请选择所属场景' }] }
            ]"
            style="width: 100%"
            @change="handleChange"
            placeholder="请选择仪器类型"
            :disabled="!canEdit"
          >
            <a-select-option v-for="item in getTypeData" :key="item.key" :value="item.key">{{
              item.value
            }}</a-select-option>
            <!-- <a-select-option value="移动监测配件"> 移动监测配件 </a-select-option>
            <a-select-option value="预埋设监测配件"> 预埋设监测配件 </a-select-option> -->
          </a-select>
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            v-decorator="['name', { initialValue: formData.name, rules: [{ required: true, message: '请输入名称' }] }]"
            placeholder="请输入名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="英文名称" v-if="this.title == '新增仪器'">
          <a-input
            v-decorator="[
              'eName',
              { initialValue: formData.eName, rules: [{ required: true, message: '请输入英文名称' }] }
            ]"
            placeholder="请输入英文名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="描述">
          <a-textarea
            v-decorator="['description', { initialValue: formData.description }]"
            placeholder="请输入描述"
            :disabled="!canEdit"
          ></a-textarea>
        </a-form-item>
        <ParamsTable v-if="this.title == '新增仪器'" ref="paramsTable" :data="dataSource" :show="true" />
        <!-- <a-form-item label="参数名" v-if="this.rowData == ''">
          <a-input
            v-decorator="['paramname', { initialValue: formData.paramname }]"
            placeholder="请输入参数名"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="参数缺省值" v-if="this.rowData == ''">
          <a-input
            v-decorator="['value', { initialValue: formData.value }]"
            placeholder="请输入参数缺省值"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="超限上限值" v-if="this.rowData == ''">
          <a-input
            v-decorator="['upper', { initialValue: formData.upper }]"
            placeholder="请输入超限上限值"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="超限下限值" v-if="this.rowData == ''">
          <a-input
            v-decorator="['lower', { initialValue: formData.lower }]"
            placeholder="请输入超限下限值"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="单位" v-if="this.rowData == ''">
          <a-input
            v-decorator="['unit', { initialValue: formData.unit }]"
            placeholder="请输入单位"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item> -->
        <!-- <a-form-item label="描述">
          <a-textarea
            v-decorator="['description', { initialValue: formData.description }]"
            placeholder="请输入描述"
            :disabled="!canEdit"
          ></a-textarea>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { addEquipment, updateEquipment } from '@/api/equip'
import ParamsTable from './paramsTable.vue'
export default {
  components: {
    ParamsTable
  },
  props: ['getTypeData'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        key: '',
        name: '',
        eName: '',
        actType: undefined,
        description: '',
        lower: '',
        paramname: '',
        unit: '',
        upper: '',
        value: ''
      },
      canEdit: false,
      dataSource: [],
      getData: [],
      confirmLoading: false,
      visible: false,
      title: ''
    }
  },
  methods: {
    async add() {
      this.visible = true
      // console.log('form_item', this.form_item)
      console.log('sceneOption', this.sceneOption)
      this.form_item = this.form_item_init
    },
    async edit(record) {
      this.visible = true
      this.formData = { ...record }
      this.rowData = record
    },
    async look(record) {
      this.visible = true
      this.formData = { ...record }
    },
    ok() {
      this.form.validateFields((err, values) => {
        var data = { ...values }
        if (!err) {
          // if (this.title == '编辑') {
          //   data.key = this.formData.key
          // } else {
          //   data.key = Math.floor(Math.random() * 100 + 2)
          //   data.time = formatDate(new Date().getTime(), 'yyyy-MM-dd hh:mm:ss')
          // }

          this.title == '编辑' ? this.editData(values) : this.addData(values)
        }
      })
    },
    handleChange(value) {
      this.formData.selectValue = value
    },
    addData(value) {
      // console.log('dataSource', this.dataSource)
      this.$refs.paramsTable.$refs.editableTable.getValues((error, values) => {
        // // 错误数 = 0 则代表验证通过
        if (error === 0) {
          // this.$message.success('验证通过')
          // console.log(values, 'values')
          let params = {
            actType: value.actType,
            name: value.name,
            nameEng: value.eName,
            description: value.description,
            addEqParamDTOS: values
          }
          this.addData_table(params)
        } else {
          this.$message.error('验证未通过')
          return false
        }
      })
    },
    async addData_table(params) {
      try {
        // console.log(params, ' this.$refs.paramsTable.$refs.editableTable')
        // return false
        this.confirmLoading = true
        let res = await addEquipment(params)
        if (res.code == 200) {
          this.$emit('updateData')
          this.$message.success('新增成功')
          this.visible = false
          this.confirmLoading = false
          this.form.resetFields()
        }
      } catch (e) {
        this.confirmLoading = false
        console.log(e)
      }
    },
    async editData(value) {
      try {
        if (
          value.actType != this.formData.actType ||
          value.name != this.formData.name ||
          value.description != this.formData.description
        ) {
          this.confirmLoading = true
          let params = {
            description: value.description,
            name: value.name,
            actType: value.actType,
            type: value.actType,
            description: value.description,
            pathNodeId: this.rowData.pathNodeId,
            id: this.rowData.id
          }
          // return false
          let res = await updateEquipment(params)
          console.log(res)
          if (res.code == 200) {
            this.$emit('updateData')
            this.$message.success('修改成功')
          }
          this.confirmLoading = false
        }
        this.visible = false
        this.form.resetFields()
      } catch (e) {
        this.confirmLoading = false
      }
    },
    closeModal() {
      if (this.title === '新增仪器') {
        this.$refs.paramsTable.delData()
      }
      this.visible = false
      this.form.resetFields()
    }
  },
  watch: {
    rowData() {
      if (this.rowData != '') {
        console.log('this.rowData', this.rowData)
        this.formData.key = this.rowData.key
        this.formData.name = this.rowData.name
        this.formData.description = this.rowData.description
        this.formData.actType = this.rowData.actType
      } else {
        this.formData.key = ''
        this.formData.name = ''
        this.formData.description = ''
        this.formData.actType = undefined
        // this.formData.actType = this.title == '新增' ? '' : '移动监测仪器'
      }
    },
    title() {
      if (this.title === '查看') {
        this.canEdit = false
      } else {
        this.canEdit = true
        this.title == '新增仪器' && (this.formData.type = '移动监测仪器')
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
