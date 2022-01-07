<template>
  <a-card style="padding: 60px; padding-top: 50px">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="10">
          <a-col :md="5">
            <a-form-item label="模板名称"> <a-input v-model="search.name" placeholder="请输入" /> </a-form-item>
          </a-col>
          <a-col :md="5">
            <a-form-item label="模板类型">
              <a-select placeholder="请选择" @change="selectChange" allow-clear>
                <a-select-option v-for="x in option" :key="x.value" :value="x.value">
                  {{ x.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :sm="9" :md="12">
            <a-form-item label="创建时间">
              <a-date-picker placeholder="开始时间" format="YYYY-MM-DD" @change="startChange" allow-clear />
              ~
              <a-date-picker placeholder="结束时间" format="YYYY-MM-DD" @change="endChange" allow-clear />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-row type="flex" justify="end">
        <a-col>
          <a-button type="primary" icon="search" @click="clickSearch">查询</a-button>
          <a-button type="primary" icon="plus" @click="showModal">新增</a-button>
          <a-button type="dashed" icon="download" @click="exportExcel">导出</a-button>
        </a-col>
      </a-row>
    </div>
    <a-table
      bordered
      :data-source="dataSource"
      :columns="columns"
      :pagination="{
        total: testTotal,
        pageSize: 5,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        onChange: pageChange
      }"
      class="table"
    >
      <template slot="operation" slot-scope="text, record">
        <a :href="record.filePath" download>下载</a>
        <a-divider type="vertical" />
        <a @click="showModal('update', record)">更新</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="deleteIndex(record)">
          <a>删除</a>
        </a-popconfirm>
      </template>
    </a-table>
    <a-modal
      v-model="visible"
      :title="key == 'update' ? '更新文件' : '新增'"
      ok-text="保存"
      cancel-text="取消"
      @ok="onSubmit"
    >
      <a-form-model ref="ruleForm" :model="form" :rules="rules" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
        <a-form-model-item v-if="key != 'update'" label="模板名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入" />
        </a-form-model-item>
        <a-form-model-item v-if="key != 'update'" label="模板类型" prop="type">
          <a-select
            v-model="selectValue"
            showSearch
            :autoClearSearchValue="false"
            :not-found-content="null"
            placeholder="请选择"
            @search="onSearch"
            @blur="onBlur"
            @change="handleSelectChange"
          >
            <a-select-option v-for="x in option" :key="x.value" :value="x.value">
              {{ x.label }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="上传文件">
          <a-upload
            name="file"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :customRequest="uploadRequest"
            @change="handleChange"
          >
            <a-button> <a-icon type="upload" /> 上传文件 </a-button>
          </a-upload>
        </a-form-model-item>
        <a-form-model-item v-if="key != 'update'" v-model="form.content" label="备注" prop="content">
          <a-textarea v-model="form.content" placeholder="请输入" :rows="5" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </a-card>
</template>
<script>
import moment from 'moment'
import * as dayjs from 'dayjs'
import { formatDate, getImgName, guid } from '@/utils/util'

import { export2Excel } from '@/assets/Excel/excelexport'

import { upload, addTemplate, pageTemplate, delTemplate, updateTemplate, getSysDataDict } from '@/api/modalManage'

const EditableCell = {
  props: {
    text: String
  }
}
export default {
  components: {
    EditableCell
  },
  data() {
    return {
      key: '',
      visible: false,
      moment,
      current_start_date: formatDate(new Date().getTime() - 30 * 24 * 3600 * 1000, 'yyyy-MM-dd'),
      current_stop_date: formatDate(new Date().getTime(), 'yyyy-MM-dd'),
      dataSource: [],
      count: 2,
      option: [],
      form: {
        name: '',
        type: null,
        content: ''
      },
      columns: [
        {
          title: '序号',
          align: 'center',
          dataIndex: 'num'
        },
        {
          title: '模板名称',
          align: 'center',
          dataIndex: 'testName',
          scopedSlots: { customRender: 'testName' }
        },
        {
          title: '模板类型',
          align: 'center',
          dataIndex: 'type',
          scopedSlots: { customRender: 'type' }
        },
        // {
        //   title: '小组',
        //   align: 'center',
        //   dataIndex: 'group',
        //   width: 100,
        //   scopedSlots: { customRender: 'group' }
        // },
        {
          title: '创建时间',
          align: 'center',
          dataIndex: 'time'
        },
        {
          title: '最新更新时间',
          align: 'center',
          dataIndex: 'newTime'
        },
        {
          title: '备注',
          align: 'center',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      rules: {
        name: [{ required: true, message: '模板名称不能为空', trigger: 'blur' }]
        // content: [{ required: true, message: '备注不能为空', trigger: 'blur' }]
      },
      tid: guid(),
      fileList: [],
      rowRecord: null,
      search: {
        name: '',
        type: undefined,
        startTime: null,
        endTime: null
      },
      searchData: {
        nameLK: null,
        fileTypeEQ: null,
        endTimeLE: null,
        startTimeGE: null,
        pageNo: 1,
        pageSize: 5
      },
      selectValue: undefined,
      testTotal: 0
    }
  },
  created() {
    // this.getdataSource()
  },
  mounted() {
    this.getTemplate(this.searchData)
    this.getModalType()
  },
  methods: {
    onDelete(key) {
      const dataSource = [...this.dataSource]
      this.dataSource = dataSource.filter(item => item.key !== key)
    },
    lookScore() {
      this.$router.push({ name: 'test-achievement' })
    },
    showModal(value, record) {
      this.key = value
      // console.log(this.key)
      this.rowRecord = record
      if (value === 'update') {
        this.fileList = [
          {
            uid: record.key,
            name: record.testName,
            status: 'done',
            url: record.filePath
          }
        ]
      } else {
        this.fileList = []
        for (let key in this.form) {
          this.form[key] = ''
        }
        this.selectValue = undefined
      }
      this.visible = true
    },
    hideModal() {
      this.visible = false
    },
    onSubmit() {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          if (this.key === 'update') {
            let data = {
              // description: this.rowRecord.content,
              // fileName: this.fileList[0].name,
              filePath: this.fileList[0].url,
              // fileType: this.rowRecord.fileType,
              // templateName: '',
              tid: this.fileList[0].uid,
              id: this.rowRecord.key
            }
            try {
              let res = await updateTemplate(data)
              console.log(res)
            } catch (err) {
              console.log(err)
            }
          } else {
            let data = {
              description: this.form.content,
              fileName: this.form.name,
              filePath: this.fileList[0].url,
              fileType: 0,
              templateName: '',
              tid: this.fileList[0].uid
            }
            let dataType = typeof this.selectValue
            if (dataType === 'number') {
              data.fileType = this.selectValue
              data.templateName = ''
            } else {
              data.fileType = null
              data.templateName = this.selectValue
            }
            try {
              let res = await addTemplate(data)
              console.log(res)
            } catch (err) {
              console.log(err)
            }
          }
        } else {
          console.log('error submit!!')
          return false
        }
        this.getTemplate(this.searchData)
        this.visible = false
      })
    },
    handleChange() {},
    handleSelectChange(value) {
      this.selectValue = value
      // console.log(this.selectValue)
    },
    onSearch(value) {
      this.handleSelectChange(value)
    },
    onBlur(value) {
      this.selectValue = value
      // console.log(value)
    },

    // 上传前验证
    beforeUpload(file) {},
    // upload
    async uploadRequest(file) {
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('tid', this.tid)
      try {
        let res = await upload(formData)
        console.log(res)
        let fileName = getImgName(res.data)
        this.fileList = [
          {
            uid: this.tid,
            name: fileName,
            status: 'done',
            url: res.data
          }
        ]
        // this.preViewTitle = this.fileList[0].name
        // this.preViewUrl = this.fileList[0].url
      } catch (err) {
        console.log(err)
      }
    },

    async getTemplate(req) {
      try {
        let res = await pageTemplate(req)
        let data = []
        for (let i = 0; i < res.data.list.length; i++) {
          data.push({
            key: res.data.list[i].id,
            num: i + 1,
            time: this.timeFilter(res.data.list[i].createTime),
            newTime: this.timeFilter(res.data.list[i].updateTime),
            content: res.data.list[i].description,
            testName: res.data.list[i].fileName,
            type: res.data.list[i].templateName,
            fileType: res.data.list[i].fileType,
            filePath: res.data.list[i].filePath
          })
        }
        this.dataSource = data
        this.testTotal = res.data.total
        console.log(this.dataSource)
      } catch (err) {
        console.log(err)
      }
    },

    pageChange(page, pageSize) {
      // this.loadData(page, pageSize)
      this.searchData.pageNo = page
      this.searchData.pageSize = pageSize
      this.getTemplate(this.searchData)
    },

    async deleteIndex(record) {
      console.log(record)
      try {
        let res = await delTemplate(record.key)
        console.log(res)
      } catch (err) {
        console.log(err)
      }
      this.getTemplate(this.searchData)
    },

    async exportExcel() {
      const sheetName = ['模板']
      const list = [[['模板名称', '模板类型', '创建时间', '最新更新时间', '备注']]]
      let data = []
      try {
        let size = { ...this.searchData }
        size.pageSize = 1000
        if (
          this.searchData.startTimeGE &&
          this.searchData.endTimeLE &&
          this.searchData.startTimeGE >= this.searchData.endTimeLE
        ) {
          this.$message.error('开始时间不能晚于结束时间！')
          return
        }
        let res = await pageTemplate(size)
        data = res.data.list
        console.log('1', data)
      } catch (err) {
        console.log(err)
      }
      for (let i = 0; i < data.length; i++) {
        list[0].push([
          data[i].fileName,
          data[i].templateName,
          this.timeFilter(data[i].createTime),
          this.timeFilter(data[i].updateTime),
          data[i].description
        ])
      }
      const fileName = '模板列表'
      export2Excel(sheetName, list, fileName)
    },
    startChange(date, dateString) {
      this.search.startTime = ''
      if (dateString) {
        this.search.startTime = Date.parse(dateString + ' 00:00:00') / 1000
      }
      console.log('start', this.search.startTime)
    },
    endChange(date, dateString) {
      this.search.endTime = ''
      if (dateString) {
        this.search.endTime = Date.parse(dateString + ' 23:59:59') / 1000
      }
      console.log('end', this.search.endTime)
    },
    clickSearch() {
      this.searchData.nameLK = this.search.name
      this.searchData.fileTypeEQ = this.search.type
      this.searchData.endTimeLE = this.search.endTime
      this.searchData.startTimeGE = this.search.startTime
      if (
        this.searchData.startTimeGE &&
        this.searchData.endTimeLE &&
        this.searchData.startTimeGE >= this.searchData.endTimeLE
      ) {
        this.$message.error('开始时间不能晚于结束时间！')
        return
      }
      this.getTemplate(this.searchData)
    },

    async getModalType() {
      let resType = 'file_type'
      try {
        let res = await getSysDataDict({ resType })
        if (res.code === 200) {
          console.log(res)
          for (let i = 0; i < res.data.length; i++) {
            this.option.push({
              value: res.data[i].dictCode,
              label: res.data[i].dictValue
            })
          }
        } else {
          console.log(res)
        }
      } catch (err) {
        console.log(err)
      }
    },
    selectChange(value) {
      // console.log(value)
      this.search.type = value
    },

    timeFilter(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
      // console.log(dataStr, 'dataStr')
      ;(dataStr + '').length == 10 && (dataStr *= 1000)
      return dayjs(dataStr).format(pattern)
    }
  }
}
</script>
<style>
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.table {
  width: 100%;
  height: 100%;
}
</style>
