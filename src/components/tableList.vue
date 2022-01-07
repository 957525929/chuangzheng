<template>
  <div>
    <a-table :columns="columns" :data-source="data.list">
      <span slot="action" slot-scope="text, record">
        <!-- <a v-if="record.type === 'html页面'" @click="showEditor(0)">编辑</a>
        <a v-if="record.type === '文本'" @click="showText(0)">编辑</a>
        <a v-if="record.type === '图片'" @click="showUpload(0)">上传</a>
        <a-divider type="vertical" /> -->
        <a v-if="record.type === 'html'" @click="showEditor(1)">查看</a>
        <a v-if="record.type === 'jpg'" @click="showUpload(1)">查看</a>
      </span>
    </a-table>

    <!-- 富文本编辑查看modal -->
    <a-modal
      width="50%"
      :title="title"
      :visible="editorVisible"
      @ok="editorOk"
      @cancel="editorVisible = false"
      :ok-button-props="{ style: modalStyle }"
    >
      <!-- 查看 -->
      <iframe v-if="!isEdit" width="100%" height="600px" src="http://www.uxxsn.com/27554.html"></iframe>
    </a-modal>

    <!-- jpg资源modal -->
    <a-modal
      width="50%"
      :title="title"
      :visible="uploadVisible"
      @ok="editorOk"
      @cancel="uploadVisible = false"
      :ok-button-props="{ style: modalStyle }"
    >
      <!-- 查看 -->
      <a-carousel v-if="!isEdit" arrows>
        <div>
          <img
            class="cImg"
            src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic.lshou.com%2Fpic%2Fimg%2Falicdn%2Fserver%2Fimgextra%2Fi4%2F1968501611%2FTB23p3Gc2OM.eBjSZFqXXculVXa_%21%211968501611.jpg&refer=http%3A%2F%2Fpic.lshou.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1635560138&t=3461dcda8e198b90d87d24261b465cfd"
          />
        </div>
      </a-carousel>
    </a-modal>
  </div>
</template>

<script>
import JEditor from '@/components/jeecg/JEditor'

const columns = [
  {
    title: 'id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '类型',
    key: 'type',
    dataIndex: 'type',
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  },
]

export default {
  components: {
    JEditor,
  },
  props: ['data'],
  data() {
    return {
      columns,
      editorVisible: false,
      textVisible: false,
      uploadVisible: false,
      //注意的modal
      visible: false,
      // modal标题
      title: '',
      //判断是编辑还是查看
      isEdit: false,
      modalStyle: {
        display: 'none',
      },
    }
  },
  methods: {
    //富文本modal
    showEditor(index) {
      this.editorVisible = true
      this.isEdit = index == 0 ? true : false
      this.title = index == 0 ? '编辑' : '查看'
      this.modalStyle.display = index == 1 ? 'none' : ''
    },
    //确定显示modal
    editorOk() {
      this.visible = true
    },
    //确定控制modal关闭
    handleOk() {
      this.visible = false
      this.editorVisible = false
      this.textVisible = false
      this.uploadVisible = false
    },
    //文本modal
    showText(index) {
      this.textVisible = true
      this.isEdit = index == 0 ? true : false
      this.title = index == 0 ? '编辑' : '查看'
      this.modalStyle.display = index == 1 ? 'none' : ''
    },
    // 上传其他资源modal
    showUpload(index) {
      this.uploadVisible = true
      this.isEdit = index == 0 ? true : false
      this.title = index == 0 ? '编辑' : '查看'
      this.modalStyle.display = index == 1 ? 'none' : ''
    },
  },
}
</script>

<style lang="less" scoped>
.cImg {
  display: inline-block;
  width: 60%;
  margin: 0 auto;
}
</style>