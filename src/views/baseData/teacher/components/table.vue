<template>
  <div>
    <a-button @click="add">新增</a-button>
    <div style="float:right">
      <a-button @click="goToModal" style="margin-right: 5px;">下载模板</a-button>
      <!-- <a-button @click="importModal">导入</a-button> -->
      <a-upload :file-list="fileList" :before-upload="readExcel" accept=".xls,.xlsx">
        <div v-if="fileList.length < 1">
          <a-button> <a-icon type="import" /> 导入 </a-button>
        </div>
      </a-upload>
    </div>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :loading="loading_tab"
      :pagination="{
        total: total,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        onChange: pageChange
      }"
    >
      <template v-for="col in ['account', 'name', 'workId', 'phone']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            @change="e => handleChange(e.target.value, record.id, col)"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="phone" slot-scope="text, record">
        <div>
          <a-tooltip v-if="record.editable" placement="top">
            <template slot="title" v-if="getPhoneTit">
              {{ getPhoneTit }}
            </template>
            <a-input
              :style="getPhoneTit ? 'margin: -5px 0;border:1px solid #ff0000' : 'margin: -5px 0;'"
              :value="text"
              @change="e => handleChange(e.target.value, record.id, 'phone')"
            />
          </a-tooltip>

          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template slot="action" slot-scope="text, record">
        <a-popconfirm
          title="是否确认重置密码?"
          ok-text="确定"
          cancel-text="取消"
          @confirm="reset(record)"
          @cancel="cancel1"
        >
          <a>重置密码</a>
        </a-popconfirm>
        <div class="editable-row-operations">
          <span v-if="record.editable">
            <a @click="() => save(record.id)">保存</a>
            <a-popconfirm title="是否确认取消?" @confirm="() => cancel(record.id)">
              <a>取消</a>
            </a-popconfirm>
          </span>
          <span v-else>
            <a :disabled="editingKey !== ''" @click="() => edit(record.id)">编辑</a>
          </span>
        </div>
      </template>
      <template slot="createTime" slot-scope="text, record">
        {{ record.createTime | dayjs }}
      </template>
      <template slot="num" slot-scope="text, record, index">
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
      <template slot="hasRight" slot-scope="text, record">
        <a-switch
          :defaultChecked="record.hasRight == true ? true : false"
          @change="onChange_right(record)"
          :loading="record.id == loading_right"
        />
      </template>
      <template slot="state" slot-scope="text, record">
        <a-switch
          :defaultChecked="record.state == 1 ? true : false"
          @change="onChange_state(record)"
          :loading="record.id == loading_state"
        />
      </template>
    </a-table>
    <Modal ref="modal" @updateData="updateData" />
  </div>
</template>

<script>
import Modal from './modal'
import { getSceneList } from '@/api/scene'
import { teacherApi } from '@/api/teacher'
import { isMobile } from '@/utils/validate'
export default {
  components: {
    Modal
  },
  props: ['columns'],
  data() {
    return {
      visible: false,
      title: '',
      rowData: '',
      page: 1,
      pageSize: 10,
      total: 0,
      loading_right: '',
      loading_state: '',
      editingKey: '',
      cacheData: [],
      fileList: [],
      flag: false,
      getPhoneTit: '',
      getCheckAccKey: '',
      loading_tab: false,
      tableData: [],
      state: {
        startTime: '',
        endTime: '',
        name: ''
      }
    }
  },
  methods: {
    add() {
      this.$refs.modal.add()
    },

    list(v) {
      console.log(v)
      this.$router.push('/objectConfig/scenceManage/sourceList?data=' + JSON.stringify(v))
    },
    async loadData(data) {
      this.loading_tab = true
      if (data) {
        this.state.startTime = data.startTime
        this.state.endTime = data.endTime
        this.state.name = data.name
      }
      let params = {
        pageNum: this.page,
        pageSize: this.pageSize
      }
      for (let key in this.state) {
        if (this.state[key]) {
          params[key] = this.state[key]
        }
      }
      let res = await teacherApi.getAllTeacherList(params)
      this.total = res.data.total
      this.tableData = res.data.list
      this.cacheData = this.tableData.map(item => ({ ...item }))
      this.loading_tab = false
      this.$emit('updateData')
    },
    updateData(index, data) {
      this.loadData()
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
      this.loadData()
    },
    async onChange_right(record) {
      const formData = new FormData()
      formData.append('teacherId', record.id)
      // console.log(record, 'record')
      // return false
      this.loading_right = record.id
      try {
        let res = await teacherApi.updateTeacherHasRight(formData)
        if (res.code == 200) {
          this.$message.success('修改成功')
          // this.loadData()
          this.loading_right = ''
        } else {
          this.$message.error(res.message)
          this.loading_right = ''
        }
      } catch (e) {
        this.loading_right = ''
        console.log(e)
      }
    },
    async onChange_state(record) {
      const formData = new FormData()
      formData.append('teacherId', record.id)
      this.loading_state = record.id
      try {
        let res = await teacherApi.updateTeacherState(formData)
        if (res.code == 200) {
          this.loading_state = ''
          this.$message.success('修改成功')
          // this.loadData()
        } else {
          this.loading_state = ''
          this.$message.error(res.message)
        }
      } catch (e) {
        this.loading_state = ''
        console.log(e)
      }
    },
    async reset(record) {
      const formData = new FormData()
      formData.append('teacherId', record.id)
      try {
        let res = await teacherApi.resetPwd(formData)
        if (res.code == 200) {
          this.$message.success('重置密码成功')
          // this.loadData()
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        console.log(e)
      }
    },
    cancel1() {},
    handleChange(value, key, column) {
      if (column == 'phone') {
        if (!isMobile(value)) {
          this.getPhoneTit = '请输入11位数字的手机号'
        } else {
          this.getPhoneTit = ''
        }
      }
      console.log('value', value, key, column)
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.id)[0]
      if (target) {
        target[column] = value
        this.tableData = newData
      }
    },
    edit(key) {
      console.log(key, 'key')
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.id)[0]
      this.editingKey = key
      console.log('target', target)
      if (target) {
        target.editable = true
        this.tableData = newData
      }
    },
    async save(key) {
      const newData = [...this.tableData]
      const newCacheData = [...this.cacheData]
      const target = newData.filter(item => key === item.id)[0]
      const targetCache = newCacheData.filter(item => key === item.id)[0]
      console.log('targetCache', targetCache)
      console.log('target', target)
      this.flag = false
      if (target.name == '' || target.account == '' || target.workId == '' || target.phone == '') {
        this.$message.info('当前行所有字段不能为空')
        return false
      }
      if (this.getPhoneTit) {
        this.$message.info('请输入11位数字的手机号')
        return false
      }
      if (target && targetCache) {
        delete target.editable
        if (JSON.stringify(targetCache) != JSON.stringify(target)) {
          try {
            let res = await teacherApi.updateTeacher(target)
            if (res.code == 200) {
              this.loadData()
              this.$message.success('更新成功')
            } else {
              this.$message.error(res.message)
            }
          } catch (e) {
            console.log(e)
          }
        } else {
          this.loadData()
        }
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(key) {
      const newData = [...this.tableData]
      const target = newData.filter(item => key === item.id)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(target, this.cacheData.filter(item => key === item.id)[0])
        delete target.editable
        this.tableData = newData
      }
    },
    goToModal() {
      this.$router.push({ name: 'eleManage-index', params: { key: 1 } })
    },
    readExcel(file) {
      const that = this
      // 拿取文件对象
      var f = file
      // 用FileReader来读取
      var reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = f => {
        var binary = ''
        var wb // 读取完成的数据
        var outdata // 你需要的数据
        var reader = new FileReader()
        reader.onload = e => {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // debugger;
          // return false;
          var XLSX = require('xlsx')
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          var pushData = []
          for (let j = 0; j < 1; j++) {
            // {"id":"123","级别":"自然部","年份":"2021","图层名称":"二违"}
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[j]])
            console.log(JSON.stringify(outdata))
            for (let i = 0; i < outdata.length; i++) {
              if (j == 0) {
                let obj = {
                  workId: outdata[i]['工号'],
                  name: outdata[i]['姓名'],
                  phone: outdata[i]['手机号'],
                  account: outdata[i]['账号'],
                  // phone: outdata[i]['密码'],
                  hasRight: outdata[i]['是否具有修改资源权限']
                }
                // console.log("obj", obj);
                pushData.push(obj)
              }
            }
          }
          this.reImport(pushData)
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
    },
    async reImport(params) {
      console.log('params', params)
      let res_empty = params.filter(item => {
        return (
          item.account == undefined ||
          item.hasRight == undefined ||
          item.name == undefined ||
          item.phone == undefined ||
          item.workId == undefined
        )
      })
      if (res_empty.length > 0) {
        this.$message.error('提交的数据的字段不能为空')
        return false
      }
      let res_phone = params.filter(item => {
        return !isMobile(item.phone)
      })
      if (res_phone.length > 0) {
        let data = res_phone.map(item => item.phone)
        let phoneData = data.join('、')
        this.$message.error(`${phoneData}手机格式不符合`)
        return false
      }
      let res_account = params.map(item => {
        return item.account
      })

      this.getCheckAccKey = ''
      try {
        let params = { accountList: res_account }
        let res = await teacherApi.isAccountList(params)
        if (res.code == 500) {
          this.$message.error(res.message)
          this.getCheckAccKey = 'error'
        }
      } catch (e) {
        console.log(e)
      }
      if (this.getCheckAccKey == 'error') {
        return false
      }
      try {
        let res = await teacherApi.importTeacherList(params)
        if (res.code == 200) {
          this.$message.success('导入成功')
          this.loadData()
        } else {
          this.$message.error(res.message)
        }
        console.log(res)
      } catch (e) {
        console.log(e)
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
    }
  }
}
</script>

<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>
