<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="$emit('update:visible', false), form.resetFields()">
      <template slot="footer">
        <a-button @click="$emit('update:visible', false), form.resetFields()">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="名称">
          <a-input
            v-decorator="['name', { initialValue: formData.name, rules: [{ required: true, message: '请输入名称' }] }]"
            placeholder="请输入名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="title === '新增'" label="英文名称">
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
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import { formatDate } from '@/utils/util'
import { addScene, updateScene } from '@/api/scene'

export default {
  props: ['visible', 'title', 'rowData'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        pathNodeId: '',
        eName: '',
        id: ''
      },
      canEdit: false,
      confirmLoading: false
    }
  },
  methods: {
    ok() {
      this.form.validateFields((err, values) => {
        console.log(values)
        var data = { ...this.formData }

        if (!err) {
          this.confirmLoading = true
          if (this.title === '新增') {
            let params = {
              parentNode: 'root',
              pid: 0,
              name: values.name,
              nameEng: values.eName,
              description: values.description
            }
            addScene(params)
              .then(res => {
                if (res.code == 200) {
                  this.$message.success('添加成功')
                }
                this.confirmLoading = false
                this.$emit('updateData', this.title, data)
              })
              .catch(e => {
                this.confirmLoading = false
                console.log(e)
              })
          } else {
            console.log(this.rowData)
            let params = {
              id: this.rowData.id,
              pathNodeId: this.rowData.pathNodeId,
              name: values.name,
              description: values.description
            }
            if (values.name != this.formData.name || values.description != this.formData.description) {
              updateScene(params)
                .then(res => {
                  if (res.code == 200) {
                    this.$message.success('修改成功')
                  }
                  this.confirmLoading = false
                  this.$emit('updateData', this.title, data)
                })
                .catch(e => {
                  this.confirmLoading = false
                  console.log(e)
                })
            } else {
              this.confirmLoading = false
            }
          }
          this.$emit('update:visible', false)
          this.form.resetFields()
        }
      })
    }
  },
  watch: {
    rowData() {
      if (this.rowData != '') {
        this.formData = { ...this.rowData }
      } else {
        for (let key in this.rowData) {
          this.rowData[key] = ''
        }
      }
    },
    title() {
      if (this.title === '查看') {
        this.canEdit = false
      } else {
        this.canEdit = true
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
