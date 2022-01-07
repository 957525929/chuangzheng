<template>
  <div class="super-flow-base-demo">
    <!--      <a-button type="info" style="float: right" @click="reset()">-->
    <!--        重置-->
    <!--      </a-button>-->
    <a-button type="primary" style="float: right" @click="save()" :loading="loading">
      保存
    </a-button>
    <super-flow
      ref="superFlow"
      :node-list="processData.nodeList"
      :link-list="processData.linkList"
      :origin="origin"
      :graph-menu="graphMenuList"
      :node-menu="nodeMenuList"
      :link-menu="linkMenuList"
      :enter-intercept="enterIntercept"
      :output-intercept="outputIntercept"
      :link-desc="linkDesc"
    >
      <template v-slot:node="{ meta }">
        <div :class="`flow-node flow-node-${meta.prop}`">
          <header>
            {{ meta.title }}
          </header>
          <section>
            {{ meta.name }}
          </section>
        </div>
      </template>
    </super-flow>

    <!-- 编辑modal -->
    <a-modal
      width="50%"
      :title="modalTitle"
      :visible="editVisible"
      @ok="editOk"
      @cancel="setValue(false)"
      :ok-button-props="{ style: modalStyle }"
    >
      <div>
        <a-form-model
          ref="ruleForm"
          :model="mesData"
          :rules="rules"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
        >
          <a-form-model-item :label="mesData.title" prop="refActIdCopy">
            <a-select
              v-model="mesData.refActIdCopy"
              showSearch
              :autoClearSearchValue="false"
              :not-found-content="null"
              placeholder="请选择"
              @search="handleSelectChange"
              @blur="onBlur"
              @change="handleSelectChange"
            >
              <a-select-option v-for="item in activityData" :key="item.value" :value="item.value">
                {{ item.label }}
              </a-select-option>
            </a-select>
            <a-select
              v-if="mesData.prop == 'equip'"
              label-in-value
              @change="descChange"
              placeholder="请选择仪器"
              :default-value="{ key: mesData.eqId }"
              :disabled="!isEdit"
            >
              <a-select-option value="1"> 全站仪 </a-select-option>
              <a-select-option value="2"> 水准仪 </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="英文名称" v-if="mesData.prop != 'equip'" prop="nameEngCopy">
            <a-input v-model="mesData.nameEngCopy" placeholder="请输入英文名称" :readOnly="!isEdit || show"></a-input>
          </a-form-model-item>
          <a-form-model-item v-if="mesData.prop != 'equip'" label="描述" prop="descriptionCopy">
            <a-textarea
              v-model="mesData.descriptionCopy"
              :auto-size="{ minRows: 6, maxRows: 15 }"
              placeholder="请输入描述信息"
              :readOnly="!isEdit"
            />
          </a-form-model-item>
          <a-form-model-item label="是否关联仪器">
            <a-switch v-model="mesData.isRelevancyCopy">
              <a-icon slot="checkedChildren" type="check" />
              <a-icon slot="unCheckedChildren" type="close" />
            </a-switch>
          </a-form-model-item>
          <div v-if="mesData.prop != 'equip' && mesData.isRelevancyCopy">
            <a-divider>关联仪器</a-divider>
            <a-form-model-item label="仪器" prop="eqIdCopy">
              <a-select
                v-if="mesData.prop != 'equip'"
                label-in-value
                @change="descChange"
                placeholder="请选择仪器"
                :key="mesData.eqIdCopy"
                :default-value="{ key: mesData.eqIdCopy }"
                :disabled="!isEdit"
              >
                <a-select-option v-for="item in equipData" :key="item.label" :value="item.value">
                  {{ item.label }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </div>
        </a-form-model>
      </div>
    </a-modal>
  </div>
</template>

<script>
const drawerType = {
  node: 0,
  link: 1
}
import { activityApi } from '@/api/activity'
import { getEquipmentList } from '@/api/equip'
export default {
  props: ['id', 'rowData'],
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes
    }
  },
  data() {
    return {
      loading: false,
      oldJsonString: '',
      flagValue: '',
      processData: {
        nodeList: [],
        linkList: []
      },
      delIndex: '',
      // 编辑modal
      editVisible: false,
      activityName: '',
      modalTitle: '',
      // modal确定按钮的显隐
      modalStyle: {
        display: 'none'
      },
      isEdit: true,
      mesData: {
        name: ''
      },
      icon: {
        display: 'inline-block',
        marginLeft: '15px',
        color: '#00db00',
        fontSize: '22px'
      },
      curNode: {},
      json: {},
      activityData: [],
      equipData: [],
      activityIds: [],
      drawerType,
      drawerConf: {
        title: '',
        visible: false,
        type: null,
        info: null,
        open: (type, info) => {
          const conf = this.drawerConf
          conf.visible = true
          conf.type = type
          conf.info = info
          if (conf.type === drawerType.node) {
            conf.title = '节点'
            if (this.$refs.nodeSetting) this.$refs.nodeSetting.resetFields()
            this.$set(this.nodeSetting, 'name', info.meta.name)
            this.$set(this.nodeSetting, 'desc', info.meta.desc)
          } else {
            conf.title = '连线'
            if (this.$refs.linkSetting) this.$refs.linkSetting.resetFields()
            this.$set(this.linkSetting, 'desc', info.meta ? info.meta.desc : '')
          }
        },
        cancel: () => {
          this.drawerConf.visible = false
          if (this.drawerConf.type === drawerType.node) {
            this.$refs.nodeSetting.clearValidate()
          } else {
            this.$refs.linkSetting.clearValidate()
          }
        }
      },
      linkSetting: {
        desc: ''
      },
      nodeSetting: {
        name: '',
        desc: ''
      },
      origin: [685, 350],
      nodeList: [],
      linkList: [],
      //从后台返回的已有的节点 existsNote
      existsNote: [],
      show: true,
      graphMenuList: [
        [
          {
            label: '开始',
            disable(graph) {
              return !!graph.nodeList.find(node => node.meta.prop === 'start')
            },
            selected: (graph, coordinate) => {
              const start = graph.nodeList.find(node => node.meta.prop === 'start')
              if (!start) {
                let node = graph.addNode({
                  width: 80,
                  height: 50,
                  coordinate: coordinate,
                  meta: {
                    prop: 'start',
                    title: '开始'
                  }
                })
                this.addNodeList(node)
              }
            }
          },
          {
            label: '活动',
            disable: false,
            selected: (graph, coordinate) => {
              let node = graph.addNode({
                width: 160,
                height: 80,
                coordinate: coordinate,
                meta: {
                  prop: 'process',
                  title: '活动',
                  isRelevancy: false,
                  isRelevancyCopy: false,
                  description: '',
                  descriptionCopy: '',
                  eqId: '',
                  eqIdCopy: '',
                  eqName: '',
                  eqNameCopy: '',
                  name: '',
                  nameCopy: '',
                  nameEng: '',
                  nameEngCopy: '',
                  refActId: '',
                  refActIdCopy: ''
                }
              })
              this.addNodeList(node)
            }
          },
          // {
          //   label: '仪器',
          //   disable: false,
          //   selected: (graph, coordinate) => {
          //     graph.addNode({
          //       width: 160,
          //       height: 80,
          //       coordinate: coordinate,
          //       meta: {
          //         prop: 'equip',
          //         title: '仪器',
          //         name: "",
          //         type: "",
          //         eqId:""
          //       },
          //     })
          //   },
          // },
          {
            label: '结束',
            disable(graph) {
              return !!graph.nodeList.find(point => point.meta.prop === 'end')
            },
            selected: (graph, coordinate) => {
              let node = graph.addNode({
                width: 80,
                height: 50,
                coordinate: coordinate,
                meta: {
                  prop: 'end',
                  title: '结束'
                }
              })
              this.addNodeList(node)
            }
          }
        ],
        [
          // {
          //   label: '打印数据',
          //   selected: (graph, coordinate) => {
          //     console.log(JSON.stringify(graph.toJSON(), null, 2))
          //   },
          // },
          {
            label: '全选',
            selected: (graph, coordinate) => {
              graph.selectAll()
            }
          },
          {
            label: '保存修改',
            selected: (graph, coordinate) => {
              this.save()
            }
          }
        ]
      ],
      nodeMenuList: [
        // [
        //   {
        //     label: '查看',
        //     disable: false,
        //     hidden(node) {
        //       return node.meta.prop === 'start' || node.meta.prop === 'end' || node.meta.prop === 'equip'
        //     },
        //     selected: (node, coordinate) => {
        //       this.editVisible = true
        //       this.modalTitle = '详情'
        //       this.modalStyle.display = 'none'
        //       this.isEdit = false
        //       this.mesData = node.meta
        //       this.isShow(node)
        //     },
        //   },
        // ],
        [
          {
            label: '编辑',
            hidden(node) {
              return node.meta.prop === 'start' || node.meta.prop === 'end' || node.meta.prop === 'equip'
            },
            selected: (node, coordinate) => {
              this.editVisible = true
              this.modalTitle = '编辑'
              this.modalStyle.display = ''
              this.isEdit = true
              this.mesData = node.meta
              this.isShow(node)
              this.curNode = node
              // this.nodeList.find(item => {
              //   if(item.id == node.id) {
              //     this.editVisible = true
              //     this.modalTitle = '编辑'
              //     this.modalStyle.display = ''
              //     this.isEdit = true
              //     this.mesData = node.meta
              //   }
              // })
            }
          }
        ],
        [
          {
            label: '资源列表',
            disable: false,
            hidden(node) {
              return node.meta.prop === 'start' || node.meta.prop === 'end' || node.meta.prop === 'equip'
            },
            selected: (node, coordinate) => {
              this.list(node)
            }
          }
        ],
        [
          {
            label: '删除',
            disable: false,
            hidden(node) {
              return node.meta.prop === 'start' || node.meta.prop === 'end' || node.meta.prop === 'equip'
            },
            selected(node, coordinate) {
              sessionStorage.setItem('delNode', node.id)
            }
          }
        ]
      ],
      linkMenuList: [
        [
          {
            label: '删除',
            disable: false,
            selected: (link, coordinate) => {
              link.remove()
            }
          }
        ],
        [
          {
            label: '编辑',
            disable: false,
            selected: (link, coordinate) => {
              console.log(link, coordinate)
            }
          }
        ]
      ],
      rules: {
        refActIdCopy: [{ required: true, message: '请选择活动', trigger: 'change' }],
        nameEngCopy: [{ required: true, message: '请输入英文', trigger: 'change' }],
        descriptionCopy: [{ required: true, message: '请输入描述内容', trigger: 'change' }],
        eqIdCopy: [{ required: true, message: '请选择仪器', trigger: 'change' }]
      }
    }
  },
  watch: {
    id: function(newVal, oldVal) {
      if (newVal) {
        this.loadData()
      }
    }
  },
  created() {},
  mounted() {
    this.delIndex = setInterval(this.getDelIndex, 1000)
    sessionStorage.setItem('delNode', '')
    this.getInitData()
  },
  destroyed() {
    clearInterval(this.delIndex)
    sessionStorage.setItem('delNode', '')
    this.save()
  },
  methods: {
    async loadData() {
      let res = await activityApi.getMethodDetail({ methodId: this.id })
      if (res.code == 200) {
        if (res.data) {
          this.oldJsonString = res.data
          this.processData = JSON.parse(res.data)
          for (let i in this.processData.nodeList) {
            this.json[this.processData.nodeList[i].id] = this.processData.nodeList[i]
            //this.existsNote.push(this.processData.nodeList[i].id)
          }
        }
      } else {
        this.$message.error(res.message)
      }
    },
    async getInitData() {
      let res = await activityApi.getAllActivities()
      if (res.code == 200) {
        this.activityData = []
        for (let i in res.data) {
          if (res.data[i].name) {
            this.activityIds.push(res.data[i].id)
            this.activityData.push({ label: res.data[i].name, value: res.data[i].id })
          }
        }
      }
      res = await getEquipmentList()
      if (res.code == 200) {
        for (let i in res.data) {
          if (res.data[i].name) {
            this.equipData.push({ label: res.data[i].name, value: res.data[i].id })
          }
        }
      }
    },
    async addNodeList(node) {
      this.json[node.id] = node
      this.processData = this.getJsonString()
      let params = {
        jsonString: JSON.stringify(this.processData),
        methodId: this.id,
        node: {
          id: node.id,
          endId: node.meta.prop == 'end' ? 'end' : '',
          startId: node.meta.prop == 'start' ? 'start' : '',
          meta: {
            description: '',
            eqId: '',
            isRelevancy: false,
            name: '',
            nameEng: '',
            prop: node.meta.prop,
            refActId: '',
            title: node.meta.title
          }
        }
      }
      var res = ''
      if (node.meta.prop == 'process') {
        res = await activityApi.addActivity(params)
      } else {
        res = await activityApi.addStartEndActivity(params)
      }
      if (res.code != 200) {
        node.remove()
        this.$message.error(res.message)
      }
    },
    enterIntercept(formNode, toNode, graph) {
      const formType = formNode.meta.prop
      switch (toNode.meta.prop) {
        case 'start':
          return false
        // case 'approval':
        //   return [
        //     'start',
        //     'approval',
        //     'condition',
        //     'cc'
        //   ].includes(formType)
        case 'process':
          return [
            'start',
            // 'approval',
            'process'
          ].includes(formType)
        case 'equip':
          return ['process'].includes(formType)
        case 'end':
          return ['process'].includes(formType)
        default:
          return true
      }
    },
    outputIntercept(node, graph) {
      return !(node.meta.prop === 'end')
    },
    linkDesc(link) {
      return link.meta ? link.meta.desc : ''
    },
    //确定modal
    editOk() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.setValue(true)
          if (this.curNode.meta.prop == 'process' && this.curNode.meta.eqId && this.curNode.meta.isRelevancy == true) {
            this.addNode()
          } else {
            this.delEquipNode(this.curNode)
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    setValue(flag) {
      this.editVisible = false
      if (flag) {
        this.curNode.meta.isRelevancy = this.curNode.meta.isRelevancyCopy
        this.curNode.meta.name = this.curNode.meta.nameCopy
        this.curNode.meta.nameEng = this.curNode.meta.nameEngCopy
        this.curNode.meta.description = this.curNode.meta.descriptionCopy
        this.curNode.meta.eqId = this.curNode.meta.eqIdCopy
        if (!this.curNode.meta.eqNameCopy) {
          let item = this.equipData.find(item => {
            if(item.value == this.curNode.meta.eqIdCopy) {
              return item.label
            }
          })

          item && (this.curNode.meta.eqNameCopy = item.label)
        }
        this.curNode.meta.eqName = this.curNode.meta.eqNameCopy
        let activity = this.activityData.find(item => item.value == this.mesData.refActIdCopy)
        this.mesData.refActId = activity ? activity.value : ''
      } else {
        this.curNode.meta.isRelevancyCopy = this.curNode.meta.isRelevancy
        this.curNode.meta.nameCopy = this.curNode.meta.name
        this.curNode.meta.nameEngCopy = this.curNode.meta.nameEng
        this.curNode.meta.descriptionCopy = this.curNode.meta.description
        this.curNode.meta.eqIdCopy = this.curNode.meta.eqId
        this.curNode.meta.eqNameCopy = this.curNode.meta.eqName
        this.mesData.refActIdCopy = this.mesData.refActId ? this.mesData.refActId : this.curNode.meta.name
      }
    },
    addNode() {
      let json = this.getJsonString()
      this.processData.linkList = json.linkList
      let linkList = json.linkList.filter(item => item.startId == this.curNode.id)
      var flag = false
      for (let i in linkList) {
        let node = json.nodeList.find(item => item.id == linkList[i].endId && item.meta.prop == 'equip')
        if (node) {
          json.nodeList = json.nodeList.map(item => {
            if (item.id == node.id) {
              item.meta.name = this.curNode.meta.eqName
              item.meta.eqId = this.curNode.meta.eqId
              flag = true
            }
            return item
          })
          break
        }
      }
      if (flag) {
        setTimeout(this.updateActivity, 1000)
        return
      }
      //通过属性创建仪器节点
      const equip = this.$refs.superFlow.graph.addNode({
        width: 160,
        height: 80,
        coordinate: [this.curNode.coordinate[0], this.curNode.coordinate[1] + 150],
        meta: {
          prop: 'equip',
          title: '仪器',
          name: this.curNode.meta.eqName,
          //"type": this.curNode.meta.type,
          eqId: this.curNode.meta.eqId,
          max: 20,
          min: 12
        }
      })
      this.json[equip.id] = equip
      //创建连接线
      const link = {
        id: 'linkEKwzafIV9Xswx7t5',
        startId: this.curNode.id,
        endId: equip.id,
        startAt: [80, 80],
        endAt: [80, 0],
        meta: null
      }
      this.processData.linkList.push(link)
      setTimeout(this.updateActivity, 1000)
    },
    delEquipNode(node, del = 0) {
      if ((node.meta.prop == 'process' && node.meta.isRelevancy == false) || del) {
        this.processData = this.getJsonString()
        const data = this.getJsonString()
        const nodes = data.linkList.filter(v => v.startId == node.id)
        for (let j in nodes) {
          let equip = data.nodeList.find(v => v.id == nodes[j].endId && v.meta.prop == 'equip')
          if (equip) {
            this.processData.nodeList = this.processData.nodeList.filter(v => v.id != equip.id)
            this.processData.linkList = this.processData.linkList.filter(v => v.endId != equip.id)
          }
        }
        if (del) {
          this.processData.nodeList = this.processData.nodeList.filter(v => v.id != node.id)
          this.processData.linkList = this.processData.linkList.filter(v => v.endId != node.id || v.startId != node.id)
          setTimeout(() => {
            this.deleteActivity(node.id)
          }, 1000)
        } else {
          setTimeout(this.updateActivity, 1000)
        }
      }
    },
    async updateActivity() {
      let params = {
        jsonString: JSON.stringify(this.getJsonString()),
        methodId: this.id,
        node: {
          id: this.curNode.id,
          meta: this.curNode.meta
        }
      }
      let res = await activityApi.updateActivity(params)
      if (res.code != 200) {
        this.$message.error(res.message)
        this.loadData()
      }
    },
    getDelIndex() {
      const index = sessionStorage.getItem('delNode')
      if (index) {
        this.delEquipNode(this.json[index], 1)
      }
      sessionStorage.setItem('delNode', '')
    },
    async deleteActivity(id) {
      let formData = new FormData()
      formData.append('jsonString', JSON.stringify(this.getJsonString()))
      formData.append('activityId', id)
      let res = await activityApi.deleteActivity(formData)
      if (res.code != 200) {
        this.loadData()
      }
    },
    handleSelectChange(value) {
      let activity = this.activityData.find(item => item.value == value)
      this.mesData.nameCopy = activity ? activity.label : value
      this.mesData.refActIdCopy = value
    },
    async onBlur(value) {
      if(this.flagValue == value) {
        return
      }
      this.flagValue = value
      if (this.editVisible) {
        let activity = this.activityData.find(item => item.value == value)
        this.mesData.nameCopy = activity ? activity.label : value
        this.mesData.refActIdCopy = value
        if (activity) {
          let res = await activityApi.getActivity({ activityId: activity.value })
          if (res.code == 200 && res.data) {
            this.mesData.descriptionCopy = res.data.description
            this.mesData.eqIdCopy = res.data.eqId
            this.mesData.isRelevancyCopy = res.data.isRelevancy
            this.mesData.nameCopy = res.data.name
            this.mesData.nameEngCopy = res.data.nameEng
          }
        }
      }
    },
    descChange(value) {
      this.curNode.meta.eqIdCopy = value.key
      this.curNode.meta.eqNameCopy =  value.label.replace(/^\s*|\s*$/g,"")
    },
    typeChange(value) {
      console.log(`selected ${value}`)
    },
    callback(key) {},
    async list(node) {
      let res = await activityApi.getPathNodeIdByActivityId({ activityId: node.id })
      if (res.code != 200) {
        this.$message.error('网络异常，请稍候再试!')
        return
      }
      let data = {
        pathNodeId: res.data,
        cName: this.rowData.cName,
        methodName: this.rowData.name,
        activityName: node.meta.name
      }
      this.$router.push('/objectConfig/scenceManage/sourceList?data=' + JSON.stringify(data))
    },
    isShow(note) {
      if (note.meta.prop == 'process') {
        this.show = this.existsNote.indexOf(note.id) === -1 ? false : true
      } else {
        this.show = true
      }
    },
    getJsonString() {
      return this.$refs.superFlow.graph.toJSON()
    },
    async save() {
      this.loading = true
      var data = this.getJsonString()
      var jsonString = JSON.stringify(data)
      if (this.oldJsonString == jsonString) {
        this.$message.error('保存失败，流程未做修改！')
        this.loading = false
        return
      }
      var pushData = {
        nodeList: data.nodeList.filter(v => v.meta.prop != 'equip'),
        methodId: this.id,
        jsonString: jsonString
      }
      for (let i in pushData.nodeList) {
        let startId =
          pushData.nodeList[i].meta.prop == 'start'
            ? { startId: 'start' }
            : data.linkList.find(v => v.endId == pushData.nodeList[i].id)
        let endId =
          pushData.nodeList[i].meta.prop == 'end'
            ? [{ endId: 'end' }]
            : data.linkList.filter(v => v.startId == pushData.nodeList[i].id)
        if (!startId || !Array.isArray(endId)) {
          this.$message.warning('存在未连接的节点，请修改！')
          return (this.loading = false)
        } else {
          for (let j in endId) {
            let equip = data.nodeList.find(v => v.id == endId[j].endId)
            //当结束节点是仪器 增加仪器参数
            equip && equip.meta && equip.meta.prop == 'equip' ? '' : (pushData.nodeList[i].endId = endId[j].endId)
          }
          pushData.nodeList[i].startId = startId.startId
        }
        pushData.nodeList[i].startId = startId.startId
      }
      console.log('pushData', pushData)
      //接下来调用后台接口保存
      let res = await activityApi.updateMethodActs(pushData)
      if (res.code == 200) {
        this.$message.success('保存成功！')
      } else {
        this.$message.error(res.message)
      }
      this.loading = false
      this.loadData()
    },
    del() {
      this.json[this.curNode.id].remove()
    },
    reset() {
      this.processData = JSON.parse(JSON.stringify(this.oldData))
    }
  }
}
</script>

<style lang="less">
.super-flow-base-demo {
  width: 100%;
  height: 70vh;
  margin: 0 auto;
  background-color: #f5f5f5;

  .super-flow__node {
    .flow-node {
      > header {
        font-size: 14px;
        height: 32px;
        line-height: 32px;
        padding: 0 12px;
        color: #ffffff;
      }

      > section {
        text-align: center;
        line-height: 20px;
        overflow: hidden;
        padding: 6px 12px;
        word-break: break-all;
      }

      &.flow-node-start {
        > header {
          height: 50px;
          line-height: 50px;
          background-color: #55abfc;
        }
      }

      &.flow-node-process {
        > header {
          background-color: #30b95c;
        }
      }

      &.flow-node-approval {
        > header {
          background-color: rgba(188, 181, 58, 0.76);
        }
      }

      &.flow-node-equip {
        > header {
          background-color: rgba(188, 181, 58, 0.76);
        }
      }

      &.flow-node-end {
        > header {
          height: 50px;
          line-height: 50px;
          background-color: #bc1d16;
        }
      }
    }
  }
  button {
    float: right;
    margin: 10px;
  }
}
</style>
