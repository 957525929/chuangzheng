<template>
  <div>
    <a-form :form="searchForm" layout="inline">
      <a-form-item label="资源类型">
        <a-select
          style="width: 120px"
          @change="handleChange"
          v-decorator="['resType', { initialValue: formData.resType }]"
        >
          <a-select-option value=""> 全部 </a-select-option>
          <a-select-option value="1"> html </a-select-option>
          <a-select-option value="2"> 其他资源 </a-select-option>
        </a-select>
      </a-form-item>
      <!-- <a-form-item label="更新时间"
        ><a-range-picker show-time v-decorator="['updateTime', { initialValue: formData.updateTime }]"> </a-range-picker
      ></a-form-item> -->
      <a-form-item label="资源名称"
        ><a-input placeholder="请输入资源名称" v-decorator="['resName', { initialValue: formData.resName }]"></a-input
      ></a-form-item>
      <a-form-item label="时间">
        <a-date-picker
          placeholder="开始时间"
          format="YYYY-MM-DD"
          v-decorator="['startTime', { initialValue: formData.startTime }]"
          allow-clear
        />
        ~
        <a-date-picker
          placeholder="结束时间"
          format="YYYY-MM-DD"
          v-decorator="['endTime', { initialValue: formData.endTime }]"
          allow-clear
        />
      </a-form-item>

      <a-form-item><a-button @click="search" :loading="loading_but">查询</a-button></a-form-item>
      <a-form-item><a-button type="primary" @click="add(), (addListVisible = true)">新增</a-button></a-form-item>
    </a-form>
    <br />
    <a-table
      :columns="columns"
      :data-source="tableData"
      :scroll="{ y: 430 }"
      :loading="loading_tab"
      :pagination="{
        total: tableData.length,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条 / 共 ${total} 条`,
        onChange: pageChange
      }"
    >
      <span slot="action" slot-scope="text, record">
        <a v-if="record.type === 'html'" @click="showEditor(0, record)">编辑</a>
        <a v-if="record.type != 'html'" @click="showUpload(0, record)">上传</a>
        <a-divider type="vertical" />
        <a v-if="record.type === 'html'" @click="showEditor(1, record)">查看</a>
        <a v-if="record.type != 'html'" @click="showUpload(1, record)">查看</a>
        <a-divider type="vertical" />
        <a-popconfirm title="确定删除吗?" @confirm="delSource(record)">
          <a>删除</a>
        </a-popconfirm>
      </span>
      <template slot="create" slot-scope="text, record">
        {{ record.create | dayjs }}
      </template>
      <template slot="num" slot-scope="text, record, index">
        {{ (page - 1) * pageSize + parseInt(index) + 1 }}
      </template>
    </a-table>

    <!-- 富文本编辑查看modal -->
    <a-modal
      width="50%"
      :title="title"
      :visible="editorVisible"
      @ok="eidtOkModal"
      @cancel="editorVisible = false"
      :ok-button-props="{ style: modalStyle }"
    >
      <!-- 编辑 -->
      <a-form-item v-if="isEdit">
        <j-editor v-model="htmlContent" :tid="tid" />
      </a-form-item>
      <!-- 查看 -->
      <iframe
        id="iFrameDiv"
        ref="iframes"
        @load="loadIframe"
        v-if="!isEdit"
        width="100%"
        height="600px"
        :src="rowData.resUrl"
      ></iframe>
    </a-modal>

    <!-- jpg资源modal -->
    <a-modal
      width="50%"
      :title="title"
      :visible="uploadVisible"
      @ok="imgEdit"
      @cancel=";(uploadVisible = false), (isImgChange = false)"
      :ok-button-props="{ style: modalStyle }"
    >
      <!-- 编辑 -->
      <div v-if="isEdit">
        <div class="clearfix">
          <a-upload
            list-type="picture-card"
            :file-list="fileList"
            @preview="imgPreview"
            @change="imgChange"
            :before-upload="beforeUpload"
            :customRequest="imgRequest"
          >
            <div v-if="fileList.length < 1">
              <a-icon type="plus" />
              <div class="ant-upload-text">Upload</div>
            </div>
          </a-upload>
          <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
            <img :alt="rowData.name" style="width: 100%" :src="preViewUrl" />
          </a-modal>
          <a-modal :visible="previewVideoVisible" :footer="null" @cancel="previewVideoVisible = false">
            <video
              width="100%"
              height="500px"
              controls="controls"
              id="video"
              autoplay="autoplay"
              loop="loop"
              :src="preViewUrl"
            ></video>
          </a-modal>
        </div>
      </div>
      <!-- 查看 -->
      <a-carousel v-if="!isEdit && (rowData.type == 'jpg' || rowData.type == 'png')" arrows>
        <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px; z-index: 1">
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div>
          <img class="cImg" :src="rowData.resUrl" />
        </div>
      </a-carousel>
      <video
        v-if="!isEdit && rowData.type != 'jpg' && rowData.type != 'png'"
        width="100%"
        height="500px"
        controls="controls"
        id="video"
        autoplay="autoplay"
        loop="loop"
        :src="preViewUrl"
      ></video>
    </a-modal>

    <!-- 资源列表新增modal -->
    <a-modal title="新增资源" width="60%" :visible="addListVisible" @ok="handleSubmit" @cancel="closeModal">
      <a-form layout="inline" style="margin-bottom: 10px" :form="form">
        <a-form-item label="资源名称">
          <a-input
            v-decorator="['addData.name', { rules: [{ required: true, message: '请输入资源名称' }] }]"
            placeholder="请输入资源名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="英文名称">
          <a-input
            v-decorator="['addData.eName', { rules: [{ required: true, message: '请输入资源英文名称' }] }]"
            placeholder="请输入资源英文名称"
          ></a-input>
        </a-form-item>
        <a-form-item label="资源类型">
          <a-select
            @change="handleChange"
            v-decorator="['addData.selectValue', { rules: [{ required: true, message: '请输入选择资源类型' }] }]"
            placeholder="请选择资源类型"
            style="width: 200px"
          >
            <a-select-option value="html"> html </a-select-option>
            <a-select-option value="nohtml"> 其他资源 </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>

      <!-- 新增html -->
      <div v-if="addData.selectValue == 'html'" style="height: 550px">
        <a-form-item>
          <j-editor v-model="htmlContent" :tid="tid" />
        </a-form-item>
      </div>

      <!-- 新增jpg -->
      <div v-if="addData.selectValue == 'nohtml'">
        <a-upload
          list-type="picture-card"
          :file-list="fileList"
          @preview="imgPreview"
          @change="imgChange"
          :before-upload="beforeUpload"
          :customRequest="imgRequest"
        >
          <div v-if="fileList.length < 1">
            <a-icon type="plus" />
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
        <a-modal :visible="previewVisible" :footer="null" @cancel="previewVisible = false">
          <img :alt="preViewTitle" style="width: 100%" :src="preViewUrl" />
        </a-modal>
        <a-modal :visible="previewVideoVisible" :footer="null" @cancel="previewVideoVisible = false">
          <video
            width="100%"
            height="500px"
            controls="controls"
            id="video"
            autoplay="autoplay"
            loop="loop"
            :src="preViewUrl"
          ></video>
        </a-modal>
      </div>
    </a-modal>

    <a-modal title="注意" :visible="visible" @ok="handleOk" @cancel="visible = false" :zIndex="2000">
      <p>确定要提交吗？</p>
    </a-modal>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import moment from 'moment'
import { guid, getImgName, compareDate, addHms } from '@/utils/util'

import {
  addImg,
  upload,
  updateImg,
  addResHtml,
  getHtmlContentByResId,
  updateResHtml,
  delResource,
  getResourceList
} from '@/api/eleManageApi'

const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '英文名称',
    dataIndex: 'eName'
  },
  {
    title: '类型',
    dataIndex: 'type'
  },
  {
    title: '创建时间',
    dataIndex: 'create',
    scopedSlots: { customRender: 'create' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]

export default {
  components: {
    JEditor
  },

  props: ['data', 'id'],

  data() {
    return {
      columns,
      tableData: [],
      pathNodeId: null,
      rowData: '',

      //注意的modal
      visible: false,

      //资源列表添加modal
      addListVisible: false,
      // 新增资源
      addData: {
        name: '',
        eName: '',
        selectValue: null
      },
      form: this.$form.createForm(this, { name: 'addSourceRule' }),
      // 新增图片
      fileList: [],
      isImgChange: false,
      tid: null,
      previewVisible: false,
      previewVideoVisible: false,
      preViewUrl: '',
      preViewTitle: '',
      // 新增html
      htmlContent: '',

      // 富文本modal
      editorVisible: false,
      // 图片modal
      uploadVisible: false,
      // modal标题
      title: '',
      //判断是编辑还是查看
      isEdit: false,
      // 按钮显隐
      modalStyle: {
        display: 'none'
      },

      // 查询类型
      type: [
        {
          type: '全部',
          key: '1'
        },
        {
          type: 'html',
          key: '2'
        },
        {
          type: 'jpg',
          key: '3'
        }
      ],
      page: '',
      pageSize: '',
      formData: {
        resName: '',
        startTime: null,
        endTime: null,
        resType: ''
      },
      searchForm: this.$form.createForm(this, { name: 'searchRule' }),
      searchData: null,
      oldEditString: '',
      suffix: this.$store.state.app.suffix,
      postfix: this.$store.state.app.postfix,
      addHtmlTid: '',
      addImgTid: '',
      loading_tab: false,
      loading_but: false,
      noPhoto: ''
    }
  },
  methods: {
    add() {
      this.tid = guid()
      this.form.resetFields()
      this.htmlContent = ''
      this.fileList = []
      console.log(this.tid)
    },
    // 资源列表新增类型选择值
    handleChange(value) {
      this.addData.selectValue = value
      if (value == 'html') {
        this.tid = this.addHtmlTid ? this.addHtmlTid : (this.addHtmlTid = guid())
      } else {
        this.tid = this.addImgTid ? this.addImgTid : (this.addImgTid = guid())
      }
      console.log(this.tid)
    },
    // 新增图片
    imgPreview(file) {
      // console.log('file', this.rowData)
      // console.log('this.noPhoto', this.noPhoto)
      if (this.noPhoto) {
        this.noPhoto ? (this.previewVisible = true) : (this.previewVideoVisible = true)
      } else {
        this.rowData.type == 'jpg' || this.rowData.type == 'png'
          ? (this.previewVisible = true)
          : (this.previewVideoVisible = true)
      }
    },
    imgChange({ fileList }) {
      this.fileList = fileList
      this.isImgChange = true
    },
    // 上传前验证
    beforeUpload(file) {
      const typeArr = [
        'image/jpeg',
        'image/png',
        'video/AVI',
        'video/mov',
        'video/rmvb',
        'video/rm',
        'video/FLV',
        'video/mp4',
        'video/3GP',
        'video/mpg',
        'video/mpe',
        'video/mpeg',
        'video/m2v'
      ]
      const photo = ['image/jpeg', 'image/png']
      this.noPhoto = photo.includes(file.type)
      // console.log('file.type', file.type)
      const isJpgOrPng = typeArr.includes(file.type)
      if (!isJpgOrPng) {
        this.$message.error('只支持上传jpg、png图片或视频')
      }
      const isLt2M = file.size / 1024 / 1024 < 80
      if (!isLt2M) {
        this.$message.error('上传失败，图片或视频大小不能超过80MB!')
      }
      return isJpgOrPng && isLt2M
    },
    // upload
    async imgRequest(file) {
      const formData = new FormData()
      this.tid = this.tid ? this.tid : guid()
      formData.append('file', file.file)
      formData.append('tid', this.tid)
      try {
        let res = await upload(formData)
        let fileName = getImgName(res.data)
        this.fileList = [
          {
            uid: this.tid,
            name: fileName,
            status: 'done',
            url: res.data
          }
        ]
        console.log(this.fileList)
        this.preViewTitle = this.fileList[0].name
        this.preViewUrl = this.fileList[0].url
      } catch (err) {
        console.log(err)
      }
    },
    // add提交
    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.isImgChange == true && this.fileList.length != 0 && this.addData.selectValue === 'nohtml') {
            this.visible = true
            this.addData.name = values.addData.name
            this.addData.eName = values.addData.eName
          } else if (this.addData.selectValue === 'html') {
            if (this.htmlContent == '') {
              this.$message.info('请添加html')
              return false
            }
            this.visible = true
            this.addData.name = values.addData.name
            this.addData.eName = values.addData.eName
          } else {
            this.$message.info('请添加图片')
          }
        }
      })
    },

    //提交的modal关闭
    async handleOk() {
      // 新增资源提交
      if (this.addListVisible) {
        // add图片
        if (this.addData.selectValue == 'nohtml') {
          let data = {
            fileName: this.fileList[0].name,
            pathNodeId: this.id,
            resName: this.addData.name,
            resNameEng: this.addData.eName,
            tid: this.fileList[0].uid
          }
          try {
            let res = await addImg(data)
            console.log(res)
          } catch (err) {
            console.log(err)
          }
          // add html
        } else {
          let data = {
            content: this.suffix + this.htmlContent + this.postfix,
            pathNodeId: this.id,
            resName: this.addData.name,
            resNameEng: this.addData.eName,
            tid: this.tid
          }
          try {
            let res = await addResHtml(data)
            console.log(res)
          } catch (err) {
            console.log(err)
          }
        }
        this.addData = {
          name: '',
          eName: '',
          selectValue: null
        }
      }
      // 上传更新jpg
      if (this.uploadVisible) {
        // const formData = new FormData()
        // formData.append('fileName', this.fileList[0].name)
        // formData.append('resId', this.rowData.id)
        // formData.append('tid', this.fileList[0].uid)
        let data = {
          fileName: this.fileList[0].name,
          resId: this.rowData.id,
          tid: this.fileList[0].uid
        }
        try {
          let res = await updateImg(data)
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      }
      // 编辑html
      if (this.editorVisible) {
        // const formData = new FormData()
        // formData.append('content', this.htmlContent)
        // formData.append('resId', this.rowData.id)
        let data = {
          content: this.suffix + this.htmlContent + this.postfix,
          resId: this.rowData.id,
          tid: this.tid
        }
        try {
          let res = await updateResHtml(data)
          console.log(res)
        } catch (err) {
          console.log(err)
        }
      }

      this.loadData(this.searchData)

      this.visible = false
      this.addListVisible = false
      this.editorVisible = false
      this.uploadVisible = false
    },

    search() {
      this.searchForm.validateFields((err, values) => {
        this.loading_but = true
        console.log(values)
        let data = {
          startTime: values.startTime ? moment(values.startTime).format('YYYY-MM-DD') + ' 00:00:00' : '',
          endTime: values.endTime ? moment(values.endTime).format('YYYY-MM-DD') + ' 23:59:59' : '',
          resName: values.resName,
          resType: values.resType,
          pathNodeId: this.id
        }
        let res = {}
        // 过滤空数据
        for (let key in data) {
          if (data[key]) {
            res[key] = data[key]
          }
        }
        console.log(res, 'data')
        this.searchData = res
        this.loadData(res)
      })
    },

    async loadData(data) {
      this.loading_tab = true
      try {
        //搜索条件
        if (data) {
          if (data.startTime && data.endTime) {
            if (!compareDate(data.startTime, data.endTime)) {
              this.$message.error('开始时间不能大于结束时间！！！')
              this.loading_tab = false
              this.loading_but = false
              return
            }
          }
          let params = data
          let res = await getResourceList(params)
          this.tableData = this.handleTableData(res.data)
          this.loading_tab = false
          this.loading_but = false
        } else {
          let params = {
            pathNodeId: this.id
          }
          let res = await getResourceList(params)
          this.tableData = this.handleTableData(res.data)
          this.loading_tab = false
        }
      } catch (err) {
        this.loading_tab = false
        this.loading_but = false
        console.log(err)
      }
    },

    // 上传jpg modal
    showUpload(index, record) {
      console.log(this.rowData, ' this.rowData')
      this.rowData = record
      this.fileList[0] = {
        uid: record.id,
        name: record.name,
        status: 'done',
        url: record.resUrl
      }
      this.preViewTitle = this.fileList[0].name
      this.preViewUrl = this.fileList[0].url

      this.uploadVisible = true
      this.isEdit = index == 0 ? true : false
      this.title = index == 0 ? '编辑' : '查看'
      this.modalStyle.display = index == 1 ? 'none' : ''
    },
    imgEdit() {
      if (this.isImgChange == true && this.fileList.length != 0) {
        this.visible = true
      } else {
        this.$message.info('请添加或更新图片')
      }
    },

    //富文本编辑modal
    async showEditor(index, record) {
      this.rowData = record
      this.tid = guid()
      console.log(this.tid)
      let id = record.id
      try {
        let res = await getHtmlContentByResId({ resId: id })
        this.htmlContent = res.data
        this.oldEditString = res.data
        console.log(res)
      } catch (err) {
        console.log(err)
      }
      this.editorVisible = true
      this.isEdit = index == 0 ? true : false
      this.title = index == 0 ? '编辑' : '查看'
      this.modalStyle.display = index == 1 ? 'none' : ''
    },
    eidtOkModal() {
      console.log(this.htmlContent)
      console.log(this.oldEditString)
      if (this.htmlContent == this.oldEditString) {
        console.log('true')
        this.$message.info('没有更改')
      } else if (this.htmlContent == '') {
        this.$message.info('html内容不能为空')
      } else {
        console.log('false')
        this.visible = true
      }
    },

    // 删除资源
    async delSource(record) {
      this.rowData = record
      const formData = new FormData()
      formData.append('resId', record.id)
      try {
        let res = await delResource(formData)
        console.log(res)

        let getId = {
          pathNodeId: this.id
        }
        try {
          // this.tableData = this.handleTableData(res.data)
          this.loadData(this.searchData)
        } catch (err) {
          console.log(err)
        }
      } catch (err) {
        console.log(err)
      }
    },

    handleTableData(data) {
      return data.map(i => {
        return {
          id: i.id,
          key: i.id,
          md5: i.md5,
          pid: i.pid,
          name: i.resName,
          eName: i.resNameEng,
          type: i.resType,
          resUrl: i.resUrl + '?' + new Date().getTime(),
          update: i.updateTime,
          create: i.createTime
        }
      })
    },
    pageChange(page, pageSize) {
      this.page = page
      this.pageSize = pageSize
    },
    closeModal() {
      console.log('close')
      this.form.resetFields()
      this.addListVisible = false
      this.isImgChange = false
      this.addData.selectValue = null
      this.htmlContent = ''
      this.fileList = []
      this.tid = ''
      this.addImgTid = ''
      this.addHtmlTid = ''
    },
    loadIframe() {
      var _iframe = window.document.getElementById('iFrameDiv')
      _iframe = _iframe.contentWindow || _iframe.contentDocument
      _iframe.postMessage({}, '*')
    }
  },
  watch: {
    data() {
      // this.tableData = this.data
    },
    id: {
      handler() {
        this.pathNodeId = this.id
        this.searchForm.resetFields()
        this.loadData()
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.cImg {
  display: inline-block;
  width: 80%;
  margin: 0 auto;
}

.ant-carousel /deep/ .slick-slide {
  text-align: center;
  height: 460px;
  line-height: 160px;
  background: grey;
  overflow: hidden;
}

.ant-carousel /deep/ .custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31, 45, 61, 0.11);
  opacity: 0.3;
}
.ant-carousel /deep/ .custom-slick-arrow:before {
  display: none;
}
.ant-carousel /deep/ .custom-slick-arrow:hover {
  opacity: 0.5;
}

.ant-carousel /deep/ .slick-slide h3 {
  color: #fff;
}

.ant-carousel /deep/ .slick-slide image {
  color: #fff;
}
</style>
