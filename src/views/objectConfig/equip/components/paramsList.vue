<template>
  <div>
    <a-form :form="form" :label-col="{ span: 2 }" :wrapper-col="{ span: 10 }" @submit="handleSubmit">
      <a-form-item label="参数名">
        <a-input v-decorator="['name', { initialValue: formData.name }]" placeholder="请输入参数名"></a-input>
      </a-form-item>
      <a-form-item label="参数缺省值">
        <a-input v-decorator="['value', { initialValue: formData.value }]" placeholder="请输入参数缺省值"></a-input>
      </a-form-item>
      <a-form-item label="超限上限值">
        <a-input v-decorator="['upper', { initialValue: formData.upper }]" placeholder="请输入超限上限值"></a-input>
      </a-form-item>
      <a-form-item label="超限下限值">
        <a-input v-decorator="['lower', { initialValue: formData.lower }]" placeholder="请输入超限下限值"></a-input>
      </a-form-item>
      <a-form-item label="单位">
        <a-input v-decorator="['unit', { initialValue: formData.unit }]" placeholder="请输入单位"></a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 12, offset: 5 }">
        <a-button type="primary" html-type="submit">
          保存
        </a-button>
        <a-button style="margin-left: 30px" html-type="reset">
          重置
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import ParamsModal from './paramsModal'
import { getEqPara, updateEqParam } from '@/api/equip'
export default {
  components: {
    ParamsModal
  },
  props: ['rowData'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        name: '',
        value: '',
        upper: '',
        lower: '',
        unit: ''
      },
      canEdit: false
    }
  },
  mounted() {
    // this.loadData()
  },
  methods: {
    handleSubmit() {
      this.form.validateFields((err, values) => {
        this.editData(values)
      })
    },
    async editData(value) {
      try {
        let params = {
          equipmentId: this.formData.equipmentId,
          id: this.formData.id,
          lower: value.lower,
          name: value.name,
          unit: value.unit,
          upper: value.upper,
          value: value.value
        }
        console.log(params)
        let res = await updateEqParam(params)
        this.$message.success('修改成功')
        console.log(res)
      } catch (e) {
        console.log(e)
      }
    },
    reset() {
      this.form.resetFields()
    },
    async loadData() {
      console.log(this.rowData.id, 'dasdasdasdsa')
      try {
        let params = {
          id: this.rowData.id
        }
        let res = await getEqPara(params)

        console.log(res.data)
        for (let key in res.data) {
          this.formData[key] = res.data[key]
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  watch: {
    rowData: {
      handler(newName, oldName) {
        console.log(this.rowData)
        if (this.rowData.id) {
          this.loadData()
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped></style>
