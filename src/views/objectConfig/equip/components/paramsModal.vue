<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="$emit('update:visible', false), form.resetFields()">
      <template slot="footer">
        <a-button @click="$emit('update:visible', false), form.resetFields()">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok">确定 </a-button>
      </template>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="参数缺省值">
          <a-input
            v-decorator="[
              'default',
              { initialValue: formData.default, rules: [{ required: true, message: '请输入参数缺省值' }] },
            ]"
            placeholder="请输入参数缺省值"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="超限上限值">
          <a-input
            v-decorator="[
              'max',
              { initialValue: formData.max, rules: [{ required: true, message: '请输入超限上限值' }] },
            ]"
            placeholder="请输入超限上限值"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="超限下限值">
          <a-input
            v-decorator="[
              'min',
              { initialValue: formData.min, rules: [{ required: true, message: '请输入超限下限值' }] },
            ]"
            placeholder="请输入超限下限值"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: ['visible', 'title', 'rowData'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        defalut: '',
        max: '',
        min: '',
      },
      canEdit: false,
    }
  },
  methods: {
    ok() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
        }
      })
    },
  },
  watch: {
    rowData() {
      if (this.rowData != '') {
        this.formData.default = this.rowData.default
        this.formData.max = this.rowData.max
        this.formData.min = this.rowData.min
      } else {
        this.formData.defalut = ''
        this.formData.max = ''
        this.formData.min = ''
      }
    },
    title() {
      if (this.title === '查看') {
        this.canEdit = false
      } else {
        this.canEdit = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>