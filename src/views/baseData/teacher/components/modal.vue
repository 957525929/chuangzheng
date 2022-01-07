<template>
  <div>
    <a-modal :title="title" :visible="visible" @cancel="close">
      <template slot="footer">
        <a-button @click="close">取消</a-button>
        <a-button type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <a-form-model
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        :label-col="{ span: 5 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="账号" prop="account">
          <a-input v-model="formData.account" placeholder="请输入账号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="formData.name" placeholder="请输入姓名"></a-input>
        </a-form-model-item>
        <a-form-model-item label="工号" prop="workId">
          <a-input v-model="formData.workId" placeholder="请输入工号"></a-input>
        </a-form-model-item>
        <a-form-model-item label="手机号码" prop="phone">
          <a-input v-model="formData.phone" placeholder="请输入手机号码"></a-input>
        </a-form-model-item>
        <a-form-model-item label="密码" prop="pwd">
          <a-input v-model="formData.pwd" placeholder="请输入密码" type="password"></a-input>
        </a-form-model-item>
        <a-form-model-item label="确认密码" prop="pwd1">
          <a-input v-model="formData.pwd1" placeholder="请再次输入密码" type="password"></a-input>
        </a-form-model-item>
        <a-form-model-item label="资源权限">
          <a-switch :defaultChecked="true" @change="onChange" v-model="formData.hasRight" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
import { formatDate } from '@/utils/util'
import { addScene, updateScene } from '@/api/scene'
import { teacherApi } from '@/api/teacher'
import { isMobile, isGbOrEn } from '@/utils/validate'
export default {
  data() {
    return {
      formData: {
        account: '',
        name: '',
        workId: '',
        phone: '',
        pwd: '',
        pwd1: '',
        hasRight: true
      },
      canEdit: false,
      visible: false,
      title: '',
      password: '',
      passwords: '',
      rules: {
        account: [{ required: true, trigger: 'blur', validator: this.validateUsername }],
        name: [{ required: true, trigger: 'change', validator: this.checkName }],
        workId: [{ required: true, message: '请输入工号', trigger: 'change' }],
        phone: [{ required: true, trigger: 'change', validator: this.checkPhoneNum }],
        pwd: [{ required: true, trigger: 'change', validator: this.checkPassword }],
        pwd1: [{ required: true, trigger: 'change', validator: this.checkPasswords }]
      },
      confirmLoading: false
    }
  },
  methods: {
    close() {
      this.visible = false
      this.$nextTick(() => {
        this.$refs.ruleForm.clearValidate()
        this.$refs.ruleForm.resetFields()
      })
    },
    ok() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.confirmLoading = true
          // values.hasRight = values.hasRight != undefined ? values.hasRight : true
          // if (this.title === '新增') {
          let values = this.formData
          let params = {
            account: values.account,
            hasRight: values.hasRight,
            name: values.name,
            phone: values.phone,
            pwd: values.pwd,
            workId: values.workId,
            state: 1
            // workId: values.workId
          }
          console.log('params', params)

          teacherApi
            .addTeacher(params)
            .then(res => {
              if (res.code == 200) {
                this.$message.success('添加成功')
              } else {
                this.$message.error(res.message)
              }
              this.confirmLoading = false
              this.$emit('updateData')
            })
            .catch(e => {
              this.confirmLoading = false
              console.log(e)
            })
          this.close()
        }
      })
    },
    add() {
      console.log('asdasasasasd')
      this.title === '新增'
      this.visible = true
    },
    onChange() {},
    checkPassword(rule, value, callback) {
      // const passwords = formItem.formState.confirm_password
      this.password = value
      if (!value) {
        return Promise.reject('请输入密码') //不存在的情况
      } else if (this.passwords && value && this.passwords !== value) {
        // 必须是两个密码都存在的情况下，才会检测密码是否一致。否则不检测
        return Promise.reject('两次密码不一致!') //密码错误的情况
      } else {
        // callback();
        return Promise.resolve()
      }
    },
    checkPasswords(rule, value, callback) {
      this.passwords = value
      if (!value) {
        return Promise.reject('请再次输入密码') //不存在的情况
      } else if (this.password && value && this.password !== value) {
        return Promise.reject('两次密码不一致!') //密码错误的情况
      } else {
        // callback();
        return Promise.resolve()
      }
    },
    checkPhoneNum(rule, value, callback) {
      if (!value) {
        return Promise.reject('请输入手机号') //不存在的情况
      } else if (!isMobile(value)) {
        return Promise.reject('请输入11位数字的手机号') //手机号错误的情况
      } else {
        return Promise.resolve()
      }
    },
    checkName(rule, value, callback) {
      if (!value) {
        return Promise.reject('请输入姓名') //不存在的情况
      } else if (isGbOrEn(value)) {
        return Promise.reject('请输入中文或英文')
      } else {
        return Promise.resolve()
      }
    },
    validateUsername(rule, value, callback) {
      if (!value) {
        return Promise.reject('请输入账号') //不存在的情况
      }
      var params = {
        account: value
      }
      teacherApi.isAccount(params).then(res => {
        if (res.code == 200) {
          callback()
        } else {
          callback('该账号已存在!')
        }
      })
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped></style>
