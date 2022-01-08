<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="handlerCancel">
      <template slot="footer">
        <a-button @click="handlerCancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <Form ref="vueForm" :formItem="form_item" :formData="formData" :labelCol="labelCol" :wrapperCol="wrapperCol" />
    </a-modal>
  </div>
</template>

<script>
import { addScene, updateScene } from '@/api/scene'
import Form from '@/components/form'
export default {
  // props: ['visible', 'title', 'rowData'],
  components: {
    Form
  },
  data() {
    return {
      formData: {
        pathNodeId: '',
        eName: '',
        id: '',
        name: '',
        updateTime: '',
        description: ''
      },
      formData_init: {},
      canEdit: false,
      confirmLoading: false,
      visible: false,
      title: '',
      form_item_init: [
        {
          type: 'input',
          label: '名称',
          name: 'name',
          required: true,
          readOnly: false
        },
        {
          type: 'input',
          label: '英文名称',
          name: 'eName',
          required: true,
          readOnly: false
        },
        {
          type: 'textarea',
          label: '描述',
          name: 'description',
          readOnly: false
        }
      ],
      form_item: [],
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 16
      }
    }
  },
  mounted() {
    this.form_item = [...this.form_item_init]
    this.form_item = this.form_item.filter(item => item.name != 'eName')
  },
  methods: {
    async add() {
      this.visible = true
      // console.log('form_item', this.form_item)

      await this.reset()
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
    reset() {
      for (let key in this.formData) {
        this.formData[key] = ''
      }
    },
    handlerCancel() {
      this.visible = false
      // this.$refs.vueForm.$refs.form.resetFields()
      for (let key in this.formData) {
        this.formData[key] = ''
      }
    },
    ok() {
      this.$refs.vueForm.$refs.form.validate(valid => {
        if (valid) {
          this.title == '新增' ? this.addModal() : this.editModal()
        }
      })
    },
    async addModal() {
      this.confirmLoading = true
      let params = {
        parentNode: 'root',
        pid: 0,
        name: this.formData.name,
        nameEng: this.formData.eName,
        description: this.formData.description
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
      await this.handlerCancel()
    },
    async editModal() {
      // console.log(this.rowData)
      this.confirmLoading = true
      let params = {
        id: this.rowData.id,
        pathNodeId: this.rowData.pathNodeId,
        name: this.formData.name,
        description: this.formData.description
      }
      if (this.rowData.name != this.formData.name || this.rowData.description != this.formData.description) {
        updateScene(params)
          .then(res => {
            if (res.code == 200) {
              this.$message.success('修改成功')
            }
            this.confirmLoading = false
            this.$emit('updateData')
          })
          .catch(e => {
            this.confirmLoading = false
            console.log(e)
          })
      }
      await this.handlerCancel()
      this.confirmLoading = false
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
        this.form_item.forEach(item => {
          item.readOnly = true
        })
      } else {
        this.canEdit = true
        this.form_item.forEach(item => {
          item.readOnly = false
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
