<template>
  <div class="tinymce-editor">
    <editor ref="getEdit" v-model="myValue" :init="init" :disabled="disabled" @onClick="onClick"> </editor>
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/icons/default'
import 'tinymce/themes/silver/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/fullscreen'
import { uploadAction, getFileAccessHttpUrl } from '@/api/manage'
export default {
  components: {
    Editor
  },
  props: {
    value: {
      type: String,
      required: false
    },
    triggerChange: {
      type: Boolean,
      default: false,
      required: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plugins: {
      type: [String, Array],
      // default: 'lists image link media table textcolor wordcount contextmenu fullscreen'
      default: 'lists image link table textcolor wordcount contextmenu fullscreen'
    },
    toolbar: {
      type: [String, Array],
      // 暂时隐藏媒体工具 | lists link unlink image media table |
      default:
        'undo redo |  formatselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists link unlink image table | removeformat | fullscreen',
      branding: false
    },
    tid: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      //初始化配置
      init: {
        language_url: process.env.BASE_URL + 'tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: process.env.BASE_URL + 'tinymce/skins/lightgray',
        height: '60vh',
        plugins: this.plugins,
        toolbar: this.toolbar,
        branding: false,
        menubar: false,
        toolbar_drawer: false,
        images_upload_handler: (blobInfo, success, error) => {
          let formData = new FormData()
          let imgName = new Date().getTime() + blobInfo.filename()
          formData.append('file', blobInfo.blob(), blobInfo.filename())
          formData.append('tid', this.tid)
          // formData.append('name', imgName)
          // formData.append('biz', 'jeditor')
          // formData.append('jeditor', '1')
          uploadAction(window._CONFIG['domianURL'] + '/common/FileUploadController/upload', formData).then(res => {
            // let img = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic14.nipic.com%2F20110527%2F7539498_003034652127_2.jpg&refer=http%3A%2F%2Fpic14.nipic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1636598419&t=e40365a87340ab23ca1f3b05ec6c2911'
            // success(img)
            let img = ''
            console.log(res)
            // if (res.success) {
            // img.status = 1
            if (res.code == '200') {
              const img = res.data
              success(img)
            } else {
              error(res.message)
            }
          })
        }
      },
      myValue: this.value
    }
  },
  mounted() {
    tinymce.init({})
    this.getList()
  },
  updated() {},
  methods: {
    getList() {
      // console.log(document.getElementById(''))
      console.log(document.getElementsByClassName('ant-modal-mask'))
      // this.$refs.getEdit.disabled = true
      // Editor.mode.set('readonly')
    },
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    //可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = ''
    }
  },
  watch: {
    value(newValue) {
      this.myValue = newValue == null ? '' : newValue
    },
    myValue(newValue) {
      if (this.triggerChange) {
        this.$emit('change', newValue)
      } else {
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
<style>
.tox .tox-control-wrap .tox-textfield {
  pointer-events: none;
}
</style>
