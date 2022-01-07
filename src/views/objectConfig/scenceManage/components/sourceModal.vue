<template>
  <div>
    <a-modal width="60%" :title="title" :visible="visible" @cancel="cancel">
      <template slot="footer">
        <a-button @click="cancel">取消</a-button>
        <a-button v-show="title != '查看'" type="primary" @click="ok" :loading="confirmLoading">确定 </a-button>
      </template>
      <!-- 基本信息 -->
      <a-form layout="inline" :form="form" :label-col="{ span: 7 }" :wrapper-col="{ span: 12 }">
        <a-form-item label="资源名称">
          <a-input
            v-decorator="[
              'name',
              { initialValue: formData.name, rules: [{ required: true, message: '请输入资源名称' }] }
            ]"
            placeholder="请输入资源名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item v-if="rowData == ''" label="英文名称">
          <a-input
            v-decorator="[
              'eName',
              { initialValue: formData.eName, rules: [{ required: true, message: '请输入英文名称' }] }
            ]"
            placeholder="请输入英文名称"
            :disabled="!canEdit"
          ></a-input>
        </a-form-item>
        <a-form-item label="类型">
          <a-select
            v-decorator="[
              'selectValue',
              { initialValue: formData.selectValue, rules: [{ required: true, message: '请选择资源类型' }] }
            ]"
            style="width: 150px"
            @change="handleChange"
            placeholder="请选择资源类型"
            :disabled="!canEdit"
          >
            <a-select-option value="html"> html页面 </a-select-option>
            <a-select-option value="nohtml"> 其它资源 </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
      <br />
      <!-- 新增和编辑 -->
      <div v-if="title === '新增' || title === '编辑'">
        <div v-show="formData.selectValue === 'html'" style="height: 550px">
          <a-form-item>
            <j-editor v-model="htmlContent" :tid="tid" />
          </a-form-item>
        </div>
        <div v-if="formData.selectValue != undefined && formData.selectValue != 'html'">
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
            <img style="width: 100%" :src="preViewUrl" />
            <!-- <video width="100%" controls="controls" id="video">
              <source :src="preViewUrl" type="video/mp4" />
            </video> -->
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
      <div v-if="title === '查看'">
        <iframe
          id="iFrameDiv"
          ref="iframes"
          @load="loadIframe"
          v-show="formData.selectValue === 'html'"
          width="100%"
          height="600px"
          :src="htmlUrl"
        ></iframe>
        <a-carousel v-show="formData.selectValue == 'jpg' || formData.selectValue == 'png'">
          <div>
            <img class="cImg" :src="preViewUrl" />
          </div>
        </a-carousel>
        <video
          v-show="formData.selectValue != 'jpg' && formData.selectValue != 'png' && formData.selectValue != 'html'"
          width="100%"
          height="500px"
          controls="controls"
          autoplay="autoplay"
          loop="loop"
          :src="preViewUrl"
        ></video>
      </div>
    </a-modal>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'
import { addImg, upload, updateImg, addResHtml, getHtmlContentByResId, updateResHtml } from '@/api/eleManageApi'
import { guid, getImgName } from '@/utils/util'
export default {
  components: {
    JEditor
  },
  props: ['visible', 'title', 'rowData', 'id', 'tid'],
  data() {
    return {
      form: this.$form.createForm(this, { name: 'rule' }),
      formData: {
        name: '',
        eName: '',
        selectValue: undefined
      },
      canEdit: false,
      // 新增
      // 富文本
      htmlContent: '',
      oldHtmlContent: '',
      htmlUrl: '',
      // 图片
      fileList: [],
      preViewUrl: '',
      preViewTitle: '',
      previewVisible: false,
      suffix: this.$store.state.app.suffix,
      postfix: this.$store.state.app.postfix,
      addHtmlTid: '',
      addImgTid: '',
      videoSrc: '',
      previewVideoVisible: false,
      noPhoto: '',
      confirmLoading: false
    }
  },
  methods: {
    clear() {
      this.form.resetFields()
      this.htmlContent = ''
      this.fileList = []
      // console.log('1')
    },
    ok() {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          console.log(this.rowData)
          this.rowData == '' ? this.addSource(values) : this.editData(values)
        }
      })
    },
    cancel() {
      this.$emit('update:visible', false)
      this.form.resetFields()
      this.htmlContent = ''
      this.fileList = []
      this.formData.selectValue = undefined
      this.tid = ''
      this.addImgTid = ''
      this.addHtmlTid = ''
    },
    addSource(values) {
      // add图片
      this.confirmLoading = true
      if (this.formData.selectValue == 'nohtml') {
        if (this.fileList.length == 0) {
          this.$message.info('图片不能为空')
          this.confirmLoading = false
          return false
        }
        let params = {
          fileName: this.fileList[0].name,
          pathNodeId: this.id,
          resName: values.name,
          resNameEng: values.eName,
          tid: this.fileList[0].uid
        }
        addImg(params)
          .then(res => {
            if (res.code == 200) {
              this.$message.success('添加图片成功')
              this.$emit('updateData')
              this.$emit('update:visible', false)
              this.form.resetFields()
              this.htmlContent = ''
              this.formData.selectValue = undefined
            }
            this.confirmLoading = false
          })
          .catch(e => {
            console.log(e)
            this.confirmLoading = false
            this.$emit('update:visible', false)
            this.form.resetFields()
            this.htmlContent = ''
            this.formData.selectValue = undefined
          })

        // add html
      } else {
        console.log('htmlContent', this.htmlContent)
        if (this.htmlContent == '') {
          this.$message.info('html内容不能为空')
          return false
        }
        let params = {
          content: this.suffix + this.htmlContent + this.postfix,
          pathNodeId: this.id,
          resName: values.name,
          resNameEng: values.eName,
          tid: this.tid
        }
        addResHtml(params)
          .then(res => {
            if (res.code == 200) {
              this.$message.success('添加html成功')
              this.$emit('updateData')
              this.$emit('update:visible', false)
              this.form.resetFields()
              this.htmlContent = ''
              this.formData.selectValue = undefined
            }
            this.confirmLoading = false
          })
          .catch(e => {
            console.log(e)
            this.$emit('update:visible', false)
            this.form.resetFields()
            this.htmlContent = ''
            this.formData.selectValue = undefined
            this.confirmLoading = false
          })
      }
    },
    async editData(values) {
      this.confirmLoading = true
      if (this.formData.selectValue == 'nohtml') {
        if (this.fileList.length == 0) {
          this.$message.info('图片不能为空')
          this.confirmLoading = false
          return false
        }

        if (this.rowData.resUrl != this.fileList[0].url) {
          let data = {
            fileName: this.fileList[0].name,
            resId: this.rowData.id,
            tid: this.fileList[0].uid
          }
          try {
            let res = await updateImg(data)
            console.log(res)
            this.$message.success('修改图片成功')
            this.confirmLoading = false
            this.$emit('updateData')
          } catch (err) {
            this.confirmLoading = false
            // console.log(err)
          }
        }
        this.confirmLoading = false
        this.$emit('update:visible', false)
        this.form.resetFields()
      } else {
        if (this.htmlContent == '') {
          this.$message.info('html内容不能为空')
          this.confirmLoading = false
          return false
        }
        let data = {
          content: this.suffix + this.htmlContent + this.postfix,
          resId: this.rowData.id,
          tid: this.tid
        }
        if (this.oldHtmlContent != this.htmlContent) {
          try {
            let res = await updateResHtml(data)
            this.$message.success('修改html成功')
            this.$emit('updateData')
            console.log(res)
          } catch (err) {
            console.log(err)
          }
          this.confirmLoading = false
        } else {
          this.confirmLoading = false
          this.$message.info('没有更改')
        }
        this.$emit('update:visible', false)
        this.form.resetFields()
      }
    },
    handleChange(value) {
      this.formData.selectValue = value
      this.htmlContent = ''
      this.fileList.length = 0
      if (value == 'html') {
        this.tid = this.addHtmlTid ? this.addHtmlTid : (this.addHtmlTid = guid())
      } else {
        this.tid = this.addImgTid ? this.addImgTid : (this.addImgTid = guid())
      }
      console.log(this.tid)
    },
    // 新增
    // 新增图片
    imgPreview(file) {
      console.log(this.fileList[0].url, 'sddssdsdds')
      console.log(this.preViewUrl, 'preViewUrl')
      if (this.noPhoto) {
        this.noPhoto ? (this.previewVisible = true) : (this.previewVideoVisible = true)
      } else {
        this.rowData.resType == 'jpg' || this.rowData.resType == 'png'
          ? (this.previewVisible = true)
          : (this.previewVideoVisible = true)
      }
    },
    imgChange({ fileList }) {
      this.fileList = fileList
      // this.isImgChange = true
    },
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
      // const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('只支持上传jpg、png图片或视频')
      }
      const isLt2M = file.size / 1024 / 1024 < 80
      if (!isLt2M) {
        this.$message.error('上传失败，图片或视频大小不能超过80MB!')
      }
      return isJpgOrPng && isLt2M
    },
    async imgRequest(file) {
      const formData = new FormData()
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
        this.preViewTitle = this.fileList[0].name
        this.preViewUrl = this.fileList[0].url
        console.log('this.preViewUrl', this.preViewUrl)
      } catch (err) {
        console.log(err)
      }
    },
    editSoucerce(v) {
      console.log(v, 'v')
      this.rowData = v
      if (this.rowData != '') {
        console.log('this.rowData', this.rowData)
        this.formData.name = this.rowData.resName
        // this.formData.eName = this.rowData.eName
        this.formData.selectValue = this.rowData.resType
        if (this.rowData.resType === 'html') {
          this.htmlUrl = this.rowData.resUrl
          this.showEditor(this.rowData)
          // this.htmlContent = this.rowData.resUrl
        } else if (this.rowData.resType != 'html') {
          this.fileList = [
            {
              uid: '-1',
              name: '示例1.png',
              status: 'done',
              url: this.rowData.resUrl
            }
          ]
          this.preViewUrl = this.rowData.resUrl
          console.log(' this.preViewUrl', this.preViewUrl)
        }
      } else {
        this.formData.name = ''
        this.formData.eName = ''
        this.formData.selectValue = undefined
        this.htmlContent = ''
        this.fileList = []
      }
    },
    async showEditor(record) {
      console.log('222ssssss')
      let id = record.id
      try {
        let res = await getHtmlContentByResId({ resId: id })
        this.htmlContent = res.data
        this.oldHtmlContent = this.htmlContent
        console.log(res)
      } catch (err) {
        console.log(err)
      }
    },
    loadIframe() {
      var _iframe = window.document.getElementById('iFrameDiv')
      _iframe = _iframe.contentWindow || _iframe.contentDocument
      _iframe.postMessage({}, '*')
    }
  },

  watch: {
    rowData() {
      if (this.rowData != '') {
        console.log('this.rowData', this.rowData)
        this.formData.name = this.rowData.resName
        // this.formData.eName = this.rowData.eName
        this.formData.selectValue = this.rowData.resType
        if (this.rowData.resType === 'html') {
          this.htmlUrl = this.rowData.resUrl
          console.log(this.htmlUrl)
          this.showEditor(this.rowData)
          // this.htmlContent = this.rowData.resUrl
        } else if (this.rowData.resType != 'html') {
          this.fileList = [
            {
              uid: '-1',
              name: '示例1.png',
              status: 'done',
              url: this.rowData.resUrl
            }
          ]
          this.preViewUrl = this.rowData.resUrl
        }
      } else {
        this.formData.name = ''
        this.formData.eName = ''
        this.formData.selectValue = undefined
        this.htmlContent = ''
        this.fileList = []
      }
    },
    title() {
      if (this.title === '查看' || this.title === '编辑') {
        this.canEdit = false
      } else {
        this.canEdit = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cImg {
  display: inline-block;
  width: 60%;
  margin: 0 auto;
}
</style>
