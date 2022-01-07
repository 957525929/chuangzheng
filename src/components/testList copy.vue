<template>
  <div class="super-flow-base-demo">
    <super-flow
      ref="superFlow"
      :node-list="nodeList"
      :link-list="linkList"
      :origin="origin"
      :graph-menu="graphMenuList"
      :node-menu="nodeMenuList"
      :link-menu="linkMenuList"
      :enter-intercept="enterIntercept"
      :output-intercept="outputIntercept"
      :link-desc="linkDesc"
    >
      <template v-slot:node="{ meta }">
        <div :class="`flow-node flow-node-${meta.prop}`" @click="showMes(meta)">
          <header>
            {{ meta.name }}
          </header>
          <section>
            {{ meta.desc }}
          </section>
        </div>
      </template>
    </super-flow>

    <!-- 编辑modal -->
    <a-modal
      width="30%"
      :title="modalTitle"
      :visible="editVisible"
      @ok="editOk"
      @cancel="editVisible = false"
      :ok-button-props="{ style: modalStyle }"
    >
      <div>
        <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
          <a-form-item :label="mesData.name">
            <a-input
              v-if="mesData.prop != 'equip'"
              v-model="mesData.desc"
              placeholder="请输入流程名称"
              :readOnly="!isEdit"
            ></a-input>
            <a-select
              v-if="mesData.prop == 'equip'"
              @change="handleChange"
              placeholder="请选择仪器"
              :default-value="mesData.desc"
              v-model="mesData.desc"
              :disabled="!isEdit"
            >
              <a-select-option value="全站仪"> 全站仪 </a-select-option>
              <a-select-option value="水准仪"> 水准仪 </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item v-if="mesData.prop == 'equip' && !isEdit" label="描述">
            <a-textarea
              v-model="mesData.info"
              :auto-size="{ minRows: 6, maxRows: 15 }"
              placeholder="请输入描述信息"
              :readOnly="!isEdit"
            />
          </a-form-item>
          <a-form-item v-if="mesData.prop != 'equip'" label="描述">
            <a-textarea
              v-model="mesData.info"
              :auto-size="{ minRows: 6, maxRows: 15 }"
              placeholder="请输入描述信息"
              :readOnly="!isEdit"
            />
          </a-form-item>
          <a-form-item v-if="mesData.prop == 'equip'" label="超限上限">
            <a-input v-model="mesData.max" placeholder="请输入超限上限" :readOnly="!isEdit"></a-input>
          </a-form-item>
          <a-form-item v-if="mesData.prop == 'equip'" label="超限下限">
            <a-input v-model="mesData.min" placeholder="请输入超限下限" :readOnly="!isEdit"></a-input>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
import { nodeList } from './testListData copy'
import { linkList } from './testListData copy'

const drawerType = {
  node: 0,
  link: 1,
}

export default {
  data() {
    return {
      // 编辑modal
      editVisible: false,
      modalTitle: '',
      // modal确定按钮的显隐
      modalStyle: {
        display: 'none',
      },
      isEdit: true,
      mesData: {
        name: '',
      },
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
        },
      },
      linkSetting: {
        desc: '',
      },
      nodeSetting: {
        name: '',
        desc: '',
      },

      origin: [681, 465],
      nodeList: [],
      linkList: [],

      graphMenuList: [
        [
          {
            label: '开始',
            disable(graph) {
              return !!graph.nodeList.find((node) => node.meta.prop === 'start')
            },
            selected: (graph, coordinate) => {
              const start = graph.nodeList.find((node) => node.meta.prop === 'start')
              if (!start) {
                graph.addNode({
                  width: 80,
                  height: 50,
                  coordinate: coordinate,
                  meta: {
                    prop: 'start',
                    name: '开始',
                  },
                })
              }
            },
          },
          {
            label: '流程',
            disable: false,
            selected: (graph, coordinate) => {
              graph.addNode({
                width: 160,
                height: 80,
                coordinate: coordinate,
                meta: {
                  prop: 'process',
                  name: '流程',
                },
              })
            },
          },
          // {
          //   label: '审批节点',
          //   disable: false,
          //   selected: (graph, coordinate) => {
          //     graph.addNode({
          //       width: 160,
          //       height: 80,
          //       coordinate: coordinate,
          //       meta: {
          //         prop: 'approval',
          //         name: '审批节点'
          //       }
          //     })
          //   }
          // },
          {
            label: '仪器',
            disable: false,
            selected: (graph, coordinate) => {
              graph.addNode({
                width: 160,
                height: 80,
                coordinate: coordinate,
                meta: {
                  prop: 'equip',
                  name: '仪器',
                },
              })
            },
          },
          {
            label: '结束',
            disable(graph) {
              return !!graph.nodeList.find((point) => point.meta.prop === 'end')
            },
            selected: (graph, coordinate) => {
              graph.addNode({
                width: 80,
                height: 50,
                coordinate: coordinate,
                meta: {
                  prop: 'end',
                  name: '结束',
                },
              })
            },
          },
        ],
        [
          {
            label: '打印数据',
            selected: (graph, coordinate) => {
              console.log(JSON.stringify(graph.toJSON(), null, 2))
            },
          },
          {
            label: '全选',
            selected: (graph, coordinate) => {
              graph.selectAll()
            },
          },
        ],
      ],
      nodeMenuList: [
        [
          {
            label: '删除',
            disable: false,
            hidden(node) {
              return node.meta.prop === 'start' || node.meta.prop === 'end'
            },
            selected(node, coordinate) {
              node.remove()
            },
          },
        ],
        [
          {
            label: '编辑',
            hidden(node) {
              return node.meta.prop === 'start' || node.meta.prop === 'end'
            },
            selected: (node, coordinate) => {
              this.editVisible = true
              this.modalTitle = '编辑'
              this.modalStyle.display = ''
              this.isEdit = true
              this.mesData = node.meta
              // this.nodeList.find(item => {
              //   if(item.id == node.id) {
              //     this.editVisible = true
              //     this.modalTitle = '编辑'
              //     this.modalStyle.display = ''
              //     this.isEdit = true
              //     this.mesData = node.meta
              //   }
              // })
            },
          },
        ],
      ],
      linkMenuList: [
        [
          {
            label: '删除',
            disable: false,
            selected: (link, coordinate) => {
              link.remove()
            },
          },
        ],
        [
          {
            label: '编辑',
            disable: false,
            selected: (link, coordinate) => {
              console.log(link, coordinate)
            },
          },
        ],
      ],
    }
  },
  created() {
    setTimeout(() => {
      this.nodeList = nodeList
      this.linkList = linkList
    }, 100)
  },
  methods: {
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
            'process',
          ].includes(formType)
        case 'equip':
          return ['process'].includes(formType)
        case 'end':
          return ['equip'].includes(formType)
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
      this.editVisible = false
    },

    //左键单击
    showMes(info) {
      if (info.prop != 'start' && info.prop != 'end' && info.desc) {
        this.editVisible = true
        this.modalTitle = '详情'
        this.modalStyle.display = 'none'
        this.isEdit = false
        this.mesData = info
      }
    },

    handleChange(value) {
      console.log(`selected ${value}`)
    },
  },
}
</script>

<style lang="less">
.super-flow-base-demo {
  width: 100%;
  height: 65vh;
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
}
</style>
