<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel=";(visible = false), form.resetFields()">
      <template slot="footer">
        <a-button @click=";(visible = false), form.resetFields()">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok()" :loading="confirmLoading">确定 </a-button>
      </template>
      <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 16 }">
        <!--        <a-form-item label="场景">-->
        <!--          <a-select-->
        <!--            v-decorator="[-->
        <!--              'sceneId',-->
        <!--              { initialValue: formData.sceneId, rules: [{ required: true, message: '请选择所属场景' }] }-->
        <!--            ]"-->
        <!--            style="width: 100%"-->
        <!--            @change="handleChange"-->
        <!--            placeholder="请选择所属场景"-->
        <!--            :disabled="!canEdit"-->
        <!--          >-->
        <!--            <a-select-option v-for="item in sceneOption" :key="item.key" :value="item.key">-->
        <!--              {{ item.value }}-->
        <!--            </a-select-option>-->
        <!--          </a-select>-->
        <!--        </a-form-item>-->
        <a-form-item label="情景名称">
          <a-input
            v-decorator="[
              'name',
              { initialValue: formData.name, rules: [{ required: true, message: '请输入情景名称' }] }
            ]"
            placeholder="请输入情景名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="title == '新增'" label="英文名称">
          <a-input
            v-decorator="[
              'nameEng',
              { initialValue: formData.nameEng, rules: [{ required: true, message: '请输入英文名称' }] }
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
import { sight } from '@/api/speciScene'
export default {
  props: ['base'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        id: '',
        name: '',
        nameEng: '',
        description: ''
      },
      canEdit: false,
      visible: false,
      title: '',
      rowData: {},
      sceneOption: [],
      confirmLoading: false
    }
  },
  mounted() {
    this.loadData()
  },
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
              name: values.name,
              nameEng: values.nameEng,
              sceneId: this.base.objId,
              description: values.description
            }
            console.log('params', params)
            // return false
            sight
              .addsceneSight(params)
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
              name: values.name,
              sceneId: this.base.objId,
              description: values.description
            }
            // return false
            if (values.name != this.formData.name || values.description != this.formData.description) {
              sight
                .updatesceneSight(params)
                .then(res => {
                  if (res.code == 200) {
                    this.$message.success('修改成功')
                    this.$emit('updateData')
                  }
                })
                .catch(e => {
                  console.log(e)
                })
            }
          }
          this.visible = false
          this.form.resetFields()
          // this.$emit('updateData', this.title, data)
          this.confirmLoading = false
        }
      })
    },
    handleChange(value) {
      this.formData.scence = value
    },
    async loadData() {
      // let data = await getSceneList()
      // this.sceneOption = this.handlerOption(data.data)
    },
    handlerOption(params) {
      return params.map(item => {
        return {
          value: item.name,
          key: item.id
        }
      })
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
