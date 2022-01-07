<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel=";(visible = false), form.resetFields()">
      <template slot="footer">
        <a-button @click=";(visible = false), form.resetFields()">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok()" :loading="confirmLoading">确定 </a-button>
      </template>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <a-form-item label="场景">
          <a-select
            v-decorator="[
              'sceneId',
              { initialValue: formData.sceneId, rules: [{ required: true, message: '请选择所属场景' }] }
            ]"
            style="width: 100%"
            @change="handleChange"
            placeholder="请选择所属场景"
            :disabled="!canEdit"
          >
            <a-select-option v-for="item in sceneOption" :key="item.key" :value="item.key">
              {{ item.value }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="名称">
          <a-input
            v-decorator="['name', { initialValue: formData.name, rules: [{ required: true, message: '请输入名称' }] }]"
            placeholder="请输入名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="title == '新增'" label="英文名称">
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
import { addSceneItem, updateSceneItem, getSceneList } from '@/api/scene'
export default {
  props: ['sceneOption'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        key: '',
        name: '',
        eName: '',
        sceneId: undefined,
        description: ''
      },
      canEdit: false,
      visible: false,
      title: '',
      rowData: {},
      confirmLoading: false
    }
  },
  mounted() {},
  methods: {
    showModal(key, value) {
      this.visible = true
      console.log(value)
      if (key == 'add') {
        this.title = '新增'
        this.rowData = ''
        for (let key in this.formData) {
          this.formData[key] = ''
        }
        this.formData.sceneId = undefined
      } else if (key == 'look') {
        this.title = '查看'
        this.rowData = value
        for (let key in this.formData) {
          this.formData[key] = this.rowData[key]
        }
      } else {
        this.title = '编辑'
        this.rowData = value
        for (let key in this.formData) {
          this.formData[key] = this.rowData[key]
        }
      }
    },
    ok() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          if (this.title === '新增') {
            let params = {
              sceneId: values.sceneId,
              name: values.name,
              nameEng: values.eName,
              description: values.description
            }

            addSceneItem(params)
              .then(res => {
                if (res.code == 200) {
                  this.confirmLoading = false
                  this.$message.success('添加成功')
                  this.$emit('updateData')
                }
              })
              .catch(e => {
                this.confirmLoading = false
                console.log(e)
              })
          } else {
            let params = {
              id: this.rowData.id,
              pathNodeId: this.rowData.pathNodeId,
              name: values.name,
              description: values.description,
              sceneId: values.sceneId
            }
            if (
              values.sceneId != this.formData.sceneId ||
              values.name != this.formData.name ||
              values.description != this.formData.description
            ) {
              updateSceneItem(params)
                .then(res => {
                  if (res.code == 200) {
                    this.$message.success('修改成功')
                    this.confirmLoading = false
                    this.$emit('updateData')
                  }
                })
                .catch(e => {
                  this.confirmLoading = false
                  console.log(e)
                })
            } else {
              this.confirmLoading = false
            }
          }
          this.visible = false
          this.form.resetFields()
          // this.$emit('updateData', this.title, data)
        }
      })
    },
    handleChange(value) {
      this.formData.scence = value
    }
  },
  watch: {
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
