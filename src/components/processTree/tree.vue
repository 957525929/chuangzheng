<template>
  <div :ref="treeRefName" :class="treeClassName">
    <div
      v-for="item in convertData"
      :key="item.uuid"
      :class="[
        isChild ? 'process-tree-childNodes-row' : 'process-tree-roots',
        isChild && item.isLong ? 'long-with-line' : ''
      ]"
      :style="isChild ? {} : rootStyle"
    >
      <div class="line" v-if="item.isLong"></div>
      <span
        v-if="item.key == '1' || item.key == '2' || item.key == '3'"
        class="process-tree-node iocnShow"
        :class="[isLeaftNode(item), typeNode(item)]"
        @click="nodeClick(item)"
        v-html="
          form.maxEquip1 ? item.name + '<br/>超限上限值:' + form.maxEquip1 + '超限下限值:' + form.minEquip1 : item.name
        "
      ></span>
      <span
        v-else
        class="process-tree-node"
        :class="[isLeaftNode(item), typeNode(item)]"
        @click="nodeClick(item)"
        v-html="form.score ? `${item.name + '<br/>考核分数为:' + form.score}` : item.name"
      ></span>

      <!-- <span
        class="process-tree-node"
        :class="[isLeaftNode(item), typeNode(item), idx == item.name ? 'click-node' : '']"
        @click="nodeClick(item.name)"
        >{{ item.name }}</span
      > -->

      <!-- <span
        class="process-tree-node"
        v-if="item.name == '自动化监测'"
        @click="showDrawer(item)"
        :class="isLeaftNode(item)"
        >{{ item.name }}</span
      >
      <span
      > -->
      <!-- <span
        class="process-tree-node"
        v-else-if="item.name == '手动监测'"
        @click="showDrawer(item)"
        :class="isLeaftNode(item)"
        >{{ item.name }}</span
      >
      <span class="process-tree-node" v-else :class="isLeaftNode(item)">{{ item.name }}</span>
      > -->
      <!-- <span class="process-tree-node" v-else :class="isLeaftNode(item)">{{ item.name }}</span> -->
      <div
        class="process-tree-childNodes"
        v-if="item.children"
        :class="item.children.length > 1 ? 'multiply-node' : 'single-node'"
      >
        <processTree :data="item.children || []" :isChild="true" />
      </div>
    </div>
    <a-drawer
      title="设置"
      placement="right"
      :closable="false"
      :visible="visible"
      :after-visible-change="afterVisibleChange"
      @close="onClose"
    >
      <a-form :form="form">
        <!-- <a-form-item v-if="this.form.test == '小角法'" label="考核项目">
          <a-select placeholder="请选择" @change="handlerChange">
            <a-select-option v-for="x in option" :key="x.value" :value="x.value">
              {{ x.label }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
        <a-form-item label="考核项目">
          <a-input v-model="form.test" disabled></a-input>
        </a-form-item>
        <a-form-item v-if="['全站仪的使用'].indexOf(form.test) > -1" label="超限上限值">
          <a-input v-model="form.maxEquip" placeholder="请输入超限上限值为多少"></a-input>
        </a-form-item>
        <a-form-item v-if="['全站仪的使用'].indexOf(form.test) > -1" label="超限下限值">
          <a-input v-model="form.minEquip" placeholder="请输入超限下限值为多少"></a-input>
        </a-form-item>
        <a-form-item v-if="['全站仪的使用'].indexOf(form.test) == -1" label="分数">
          <a-input v-model="form.score1" placeholder="请输入该项目满分为多少"></a-input>
        </a-form-item>
      </a-form>
      <div
        :style="{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          borderTop: '1px solid #e8e8e8',
          padding: '10px 16px',
          textAlign: 'right',
          left: 0,
          background: '#fff',
          borderRadius: '0 0 4px 4px'
        }"
      >
        <a-button style="marginRight: 8px" @click="onClose">
          取消
        </a-button>
        <a-button type="primary" @click="submit">
          提交
        </a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import uuidv4 from 'uuid'
export default {
  name: 'processTree',
  props: {
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    isChild: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      convertData: this.convert(this.data),
      rootStyle: {},
      idx: 0,
      key: false,
      visible: false,
      form: {
        score: '',
        score1: '',
        test: '',
        total: '',
        test1: '',
        maxEquip: '',
        maxEquip1: '',
        minEquip: '',
        minEquip1: ''
      },
      getTotal: [],
      option: [
        {
          value: '小角法',
          label: '小角法'
        },
        {
          value: '极坐标法',
          label: '极坐标法'
        }
      ]
    }
  },
  mounted() {
    this.handlerData()
  },
  watch: {
    data() {
      this.convertData = this.convert(this.data)
    },
    form: {
      handler(newValue, oldValue) {
        // console.log('1111122')
        // console.log(newValue.score)
        // console.log(oldValue.score)
        // if (newValue != '') {
        //   this.getTotal.push(newValue.score)
        // }
      },
      deep: true
    }
  },
  computed: {
    treeRefName() {
      return this.isChild ? 'childTree' : 'baseTree'
    },
    treeClassName() {
      return this.isChild ? '' : 'process-tree'
    }
  },

  methods: {

    handlerData() {
      console.log('111111')
      console.log(this.convert(this.data))
    },
    initDomWidth() {
      let leafs = document.getElementsByClassName('leaf-node')
      leafs = Array.from(leafs)
      leafs = leafs.map(i => {
        let total = this.getOffset(i, 'offsetLeft')
        return total
      })

      this.rootStyle = { width: Math.max(...leafs) * 1.5 + 'px' }
    },
    getOffset(obj, offsetDir) {
      var realNum = obj[offsetDir]
      var positionParent = obj.offsetParent //获取上一级定位元素对象

      while (positionParent != null) {
        realNum += positionParent[offsetDir]
        positionParent = positionParent.offsetParent
      }
      return realNum
    },
    convert(arr) {
      return arr.map(item => {
        item.uuid = uuidv4()
        if (item.children && item.children.length > 0) {
          item.children = this.convert(item.children)
        }
        return item
      })
    },
    isLeaftNode(data) {
      return data.children && data.children.length > 0 ? '' : 'leaf-node'
    },
    typeNode(data) {
      return data.type == 2
        ? 'type-node2'
        : data.type == 1
        ? 'type-node1'
        : data.type == 3
        ? 'type-node3'
        : 'type-node4'
    },
    nodeClick(item) {
      this.idx = item.name
      this.visible = true
      this.form.test = item.name
      this.form.total = item
      // this.form.score = ''
      // this.form.score1 = ''
    },
    begin() {
      this.key = true
      console.log('get')
    },
    afterVisibleChange(val) {
      console.log('visible', val)
    },
    // showDrawer(item) {
    //   this.visible = true
    //   this.form.test = item.name
    //   this.form.total = item
    //   this.form.score = ''
    //   this.form.score1 = ''
    // },
    onClose() {
      this.visible = false
    },
    submit() {
      // console.log(this.getTotal)
      // this.form.test = this.form.total.children[0].name
      // console.log(this.form)
      this.form.score = this.form.score1
      this.form.maxEquip1 = this.form.maxEquip
      this.form.minEquip1 = this.form.minEquip
      // console.log(this.form.score)
      this.getTotal.push(this.form.score)
      // console.log('1312131')
      console.log(this.getTotal)
      this.visible = false
    }
    // submit() {
    //   this.form.test = this.form.total.children[0].name
    //   // if (this.form.test == '后方交会法' && this.form.score1 != '') {
    //   //   this.visible = false
    //   // }
    //   // if (this.form.test1 == 'change' && this.form.score1 != '') {
    //   //   this.visible = false
    //   // }
    // },
  }
}
</script>

<style scoped>
.process-tree {
  padding: 10px;
  overflow: scroll;
  padding-bottom: 27px;
  width: 100%;
  padding-right: 0;
  font-size: 0;
  line-height: 0;
}
.process-tree-roots {
  width: 250%;
  margin-bottom: 20px;
}
.single-node::before {
  content: '';
  display: block;
  position: absolute;
  width: 23px;
  height: 3px;
  background: rgba(203, 221, 238, 1);
  left: -23px;
  top: 52%;
}
.multiply-node::before {
  content: '';
  display: block;
  position: absolute;
  width: 3px;
  height: 100%;
  background: rgba(203, 221, 238, 1);
  left: -23px;
  top: 0;
}

.process-tree-node {
  position: relative;
  padding: 6px 10px;
  background: rgba(203, 221, 238, 1);
  border-radius: 2px;
  color: #333;
  display: inline-block;
  cursor: pointer;
  min-width: 80px;
  text-align: center;
  font-size: 12px;
  line-height: 1.8em;
  vertical-align: middle;
  min-height: 20px;
}

.process-tree-node::after {
  content: '';
  display: block;
  width: 20px;
  height: 3px;
  background: rgba(203, 221, 238, 1);
  position: absolute;
  left: 100%;
  top: 50%;
}
.leaf-node::after {
  display: none;
}

.process-tree-childNodes {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  margin-left: 43px;
  top: -0.5px;
}
.process-tree-childNodes > div {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.multiply-node .process-tree-childNodes-row::before {
  content: '';
  display: block;
  position: absolute;
  width: 20px;
  height: 3px;
  background: rgba(203, 221, 238, 1);
  left: -20px;
  top: 50%;
}
.multiply-node .process-tree-childNodes-row:first-child::after,
.multiply-node .process-tree-childNodes-row:last-child::after {
  content: '';
  position: absolute;
  display: block;
  width: 4px;
  height: 50%;
  background: #fff;
  left: -23px;
}
.multiply-node .long-with-line:first-child::after,
.multiply-node .long-with-line:last-child::after {
  left: -166px;
}
.multiply-node .process-tree-childNodes-row:first-child::after {
  top: 0px;
}
.multiply-node .process-tree-childNodes-row:last-child::after {
  bottom: -4px;
}

.process-tree-childNodes-row {
  position: relative;
  margin-bottom: 10px;
}
.process-tree-childNodes-row:last-child {
  margin-bottom: 0;
}

.long-with-line {
  margin-left: 142px;
}
.line {
  position: absolute;
  width: 142px;
  height: 3px;
  background-color: rgba(203, 221, 238, 1);
  top: 50%;
  left: -161px;
}

.type-node1 {
  background-color: rgba(0, 111, 255, 0.5);
  border-radius: 50px;
}

.type-node2 {
  background-color: rgba(118, 194, 0, 0.5);
  background-image: url('../../assets/edit.png');
  background-repeat: no-repeat;
  background-size: 15px;
  background-position: top right;
  padding: 10px;
}

.type-node3 {
  background-color: rgba(255, 138, 0, 0.5);
}

.type-node4 {
  background-color: rgba(255, 0, 0, 0.5);
  border-radius: 50px;
}
.iocnShow {
  /* position: absolute;   */
  background-image: url('../../assets/edit.png');
  background-repeat: no-repeat;
  background-size: 15px;
  background-position: top right;
  padding: 10px;
}
</style>
