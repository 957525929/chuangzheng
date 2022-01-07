<template>
  <div class="ele-page">
    <div class="left-card">
      <a-tooltip placement="left">
        <template slot="title">
          <span>点击刷新</span>
        </template>
        <a-icon class="icon" type="redo" @click="reload" />
      </a-tooltip>
      <!-- 左侧树 -->
      <a-card style="height: 100%; overflow: auto">
        <a-tree :load-data="onLoadData" style="height: 100%" show-line :tree-data="treeData">
          <template slot="custom" slot-scope="item">
            <a-tooltip :mouseEnterDelay="0.8" placement="right" overlayClassName="tip_style">
              <template slot="title">{{ ename }}</template>
              <div style="width: 100%" @click="getItem(item)" @mouseover="getEname(item)">
                {{ item.title }}
              </div>
            </a-tooltip>
          </template>
        </a-tree>
      </a-card>
    </div>

    <div class="right-card">
      <a-card style="height: 100%">
        <a-alert message="请点击左侧菜单,显示详细数据" banner closable />
        <a-form v-if="id != 0 && id != -1" layout="inline">
          <a-row :gutter="24">
            <a-col :span="8">
              <a-form-item label="资源名称">{{ treeContent.title }}</a-form-item>
            </a-col>
            <a-col :span="8">
              <!-- <a-form-item label="英文名称">{{ treeContent.ename }}</a-form-item> -->
              <a-form-item label="英文名称">
                <j-ellipsis :value="treeContent.ename" :length="40" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="更新时间">{{ treeContent.time | dayjs }}</a-form-item>
            </a-col>
          </a-row>
        </a-form>

        <br />

        <tableList v-if="id != 0 && id != -1" :data="eleData" :id="id"></tableList>

        <domoManage v-if="id == -1"></domoManage>
      </a-card>
    </div>
  </div>
</template>

<script>
import { treeData } from './data/tree'

import { getChilds, getResourceList } from '@/api/eleManageApi'
import JEllipsis from '@/components/jeecg/JEllipsis'
import tableList from './components/tableList'
import domoManage from './components/domoManage'

export default {
  inject: ['reload'],
  components: {
    tableList,
    domoManage,
    JEllipsis
  },
  data() {
    return {
      //初始数据
      eleData: [],
      treeData,
      treeContent: {
        title: '',
        ename: '',
        time: ''
      },
      ename: '',

      tipStyle: {
        color: 'red'
      },

      getTree: {
        pid: 0,
        data: ''
      },
      id: 0,
      getKey: '',
      selectKey: ['-1']
    }
  },
  mounted() {
    console.log('this.$route.params', this.$route.params)
    this.getKey = this.$route.params.key
    if (this.getKey) {
      this.id = -1
      // this.selectKey = ['-1']
      console.log('selectKey', this.selectKey)
    }
  },
  methods: {
    // 处理列表数据
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

    // 处理树数据
    handleTreeData(data) {
      return data.map(i => {
        return {
          title: i.name,
          key: i.id,
          time: i.updateTime,
          ename: i.nameEng,
          pid: i.pid,
          seq: i.seq,
          isLeaf: this.getTree.pid == '-2' ? true : i.isLeaf ? i.isLeaf : false,
          scopedSlots: { title: 'custom' }
        }
      })
    },

    // 懒加载获取树节点
    async onLoadData(treeNode) {
      if (treeNode.dataRef.key != -1) {
        this.getTree.pid = treeNode.dataRef.key
        let pid = {
          pid: this.getTree.pid
        }
        try {
          let res = await getChilds(pid)
          console.log(res)
          this.getTree.data = this.handleTreeData(res.data)
        } catch (err) {
          console.log(err)
        }
        return new Promise(resolve => {
          if (treeNode.dataRef.children) {
            resolve()
            return
          }
          setTimeout(() => {
            treeNode.dataRef.children = this.getTree.data
            this.treeData = [...this.treeData]
            resolve()
          }, 1000)
        })
      }
    },

    // 获取所点击树的内容
    async getItem(v) {
      this.treeContent = v
      let key = v.key
      if (key && key != 0 && key != -1) {
        let id = {
          pathNodeId: key
        }
        this.id = id.pathNodeId
        // try {
        //   let res = await getResourceList(id)
        //   this.eleData = this.handleTableData(res.data)
        //   console.log(this.eleData)
        // } catch (err) {
        //   console.log(err)
        //   this.eleData = []
        // }
      } else if (key == -1) {
        this.id = -1
      } else {
        this.id = 0
      }
    },
    getEname(v) {
      this.ename = v.ename
    },
    refresh() {
      window.location.reload()
    }
  }
}
</script>

<style lang="less" scoped>
.ele-page {
  display: flex;
  justify-content: center;
  height: 80vh;
}
.left-card {
  position: relative;
  flex: 1;
}
.icon {
  position: absolute;
  right: 20px;
  top: 30px;
  z-index: 999;
  font-size: 20px;
  color: #08c;
}
.icon:hover {
  color: orange;
}
.right-card {
  flex: 3;
}
</style>
<style lang="less">
.tip_style {
  .ant-tooltip-inner {
    background-color: grey !important;
  }
  .ant-tooltip-arrow::before {
    background-color: grey !important;
  }
}
</style>
