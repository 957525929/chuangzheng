<template>
  <div class="pointPage">
    <span>
      <a-select
        style="width: 200px"
        :options="option"
        :default-value="1"
        @change="handleChange"
        placeholder="请选择考试模式"
      >
      </a-select
    ></span>
    <span style="float:right">
      <a-button style="margin:0 10px 10px 0" ghost :type="canAdd1 ? 'danger' : 'primary'" @click="save">保存</a-button>
      <a-button style="margin-bottom: 10px" ghost :type="canAdd1 ? 'danger' : 'primary'" @click="reset">重置</a-button>
    </span>
    <div class="pointPosition" id="pointDiv" ref="pointDiv" @click="touchstart">
      <div
        v-for="(v, i) in importPoint"
        :class="v.type == 1 ? 'point' : 'triangle'"
        :key="i"
        :style="v"
        @mouseover="showPointItem(v)"
        @mouseleave="closePointItem"
        @click="delPoint(v)"
      ></div>
      <div
        v-for="(v, i) in getKey == 1 ? pointCheckedEasy : getKey == 2 ? pointCheckedOrdinary : pointCheckedDifficulty"
        :class="v.type == 1 ? 'pointChecked' : 'triangleChecked'"
        :key="i"
        :style="v"
        @mouseover="showPointItem(v)"
        @mouseleave="closePointItem"
        @click="back(v)"
      ></div>
      <div v-if="mesShow" class="point-mes">
        <div class="mes-type">
          <div>X：</div>
          <div>{{ info.x }} E</div>
        </div>
        <div class="mes-type">
          <div>Y：</div>
          <div>{{ info.y }} N</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { pointData } from '@views/objectConfig/monitor/data/pointData'
import { guid } from '@/utils/util'
import { getPointRankAndPointItemList, getPointItemList, addDefaultRankPoints } from '@/api/scene'
export default {
  props: ['getPoint'],
  data() {
    return {
      mesShow: false,
      //删除点modal
      pointVisible: false,
      //储存删除点信息
      delItem: '',
      //判断是否添加点
      canAdd: false,
      canAdd1: false,
      // 添加点
      addBtn: '新增测点',
      addBtn1: '新增基准点',
      pointData: pointData,
      importPoint: [],
      oldPointData: [],
      oldRankPointData: [],
      triangleData: [],
      getKey: 1,
      curDiv: {
        width: '',
        height: ''
      },
      info: {
        x: '',
        y: ''
      },
      fileList: [],
      pointCheckedEasy: [],
      pointCheckedOrdinary: [],
      pointCheckedDifficulty: [],
      option: [
        { value: 1, label: '简单' },
        { value: 2, label: '普通' },
        { value: 3, label: '困难' }
      ],
      uniqueData: []
    }
  },
  mounted() {
    // this.init()
  },
  watch: {
    getPoint() {
      this.loadData()
    }
  },
  methods: {
    async loadData() {
      console.log(this.getPoint, 'this.da1asdrter12ta')

      //加载全部点数
      let params = {
        itemId: this.getPoint.id
      }
      try {
        let res = await getPointItemList(params)

        if (res.code == 200) {
          this.importPoint = res.data
          // console.log(res.data, 'customPoint')
          this.init()
          this.initRankPoint()
        }
      } catch (e) {
        console.log(e)
      }
    },
    async initRankPoint() {
      // console.log('22223333')
      //加载对应级别的点数
      let params_rank = {
        itemId: this.getPoint.id,
        rank: this.getKey
      }
      // console.log(params_rank, 'data')
      // return false
      try {
        let res = await getPointRankAndPointItemList(params_rank)
        // console.log(res, 'asassasdasasas')
        if (res.code == 200) {
          // console.log(res.data, 'res.data')
          // this.importPoint = res.data
          this.uniqueData = res.data
          this.getKey == 1
            ? (this.pointCheckedEasy = res.data)
            : this.getKey == 2
            ? (this.pointCheckedOrdinary = res.data)
            : (this.pointCheckedDifficulty = res.data)
          console.log('this.pointCheckedEasy', this.pointCheckedEasy)
          this.rankPoint()
        }
      } catch (e) {
        console.log(e)
      }
    },
    init() {
      this.curDiv.width = this.$refs.pointDiv.offsetWidth
      this.curDiv.height = this.$refs.pointDiv.offsetHeight
      this.importPoint = this.importPoint.map(item => {
        item.bottom = parseFloat(item.x) * 1.84
        item.bottom = this.curDiv.height * 0.035 + item.bottom + 'px'
        item.left = parseFloat(Math.abs(item.y)) * 1.94 + 'px'
        return item
      })
      console.log(this.importPoint)
      // this.oldPointData = [...this.importPoint]
    },
    rankPoint() {
      this.curDiv.width = this.$refs.pointDiv.offsetWidth
      this.curDiv.height = this.$refs.pointDiv.offsetHeight
      this.getKey == 1
        ? (this.pointCheckedEasy = this.pointCheckedEasy.map(item => {
            item.bottom = parseFloat(item.x) * 1.84
            item.bottom = this.curDiv.height * 0.035 + item.bottom + 'px'
            item.left = parseFloat(Math.abs(item.y)) * 1.94 + 'px'
            item.id = item.pointId
            return item
          }))
        : this.getKey == 2
        ? (this.pointCheckedOrdinary = this.pointCheckedOrdinary.map(item => {
            item.bottom = parseFloat(item.x) * 1.84
            item.bottom = this.curDiv.height * 0.035 + item.bottom + 'px'
            item.left = parseFloat(Math.abs(item.y)) * 1.94 + 'px'
            item.id = item.pointId
            return item
          }))
        : (this.pointCheckedDifficulty = this.pointCheckedDifficulty.map(item => {
            item.bottom = parseFloat(item.x) * 1.84
            item.bottom = this.curDiv.height * 0.035 + item.bottom + 'px'
            item.left = parseFloat(Math.abs(item.y)) * 1.94 + 'px'
            item.id = item.pointId
            return item
          }))

      // console.log(this.importPoint)
      this.oldRankPointData = [
        ...(this.getKey == 1
          ? this.pointCheckedEasy
          : this.getKey == 2
          ? this.pointCheckedOrdinary
          : this.pointCheckedDifficulty)
      ]
    },

    //鼠标移入移出显示隐藏测点信息
    showPointItem(v) {
      this.info.x = (parseFloat(v.bottom) - this.curDiv.height * 0.035) / 1.84
      this.info.y = -parseFloat(v.left) / 1.94
      this.mesShow = true
    },
    closePointItem() {
      this.mesShow = false
    },
    //删除测点modal
    delPoint(v, key) {
      if (this.canAdd || this.canAdd1) return
      this.delItem = v
      console.log(v)
      // this.pointVisible = true
      // this.getKey = key
      // this.importPoint = this.importPoint.filter(i => i.id != this.delItem.id)
      this.getKey == 1
        ? this.pointCheckedEasy.push(this.delItem)
        : this.getKey == 2
        ? this.pointCheckedOrdinary.push(this.delItem)
        : this.pointCheckedDifficulty.push(this.delItem)
    },
    back(v) {
      const pointPositionsDele = [
        ...(this.getKey == 1
          ? this.pointCheckedEasy
          : this.getKey == 2
          ? this.pointCheckedOrdinary
          : this.pointCheckedDifficulty)
      ]
      this.getKey == 1
        ? (this.pointCheckedEasy = pointPositionsDele.filter(item => item.id !== v.id))
        : this.getKey == 2
        ? (this.pointCheckedOrdinary = pointPositionsDele.filter(item => item.id !== v.id))
        : (this.pointCheckedDifficulty = pointPositionsDele.filter(item => item.id !== v.id))
      // data = pointPositionsDele.filter(item => item.key !== key)
      this.getPoint.push(v)
    },
    // pointOk() {
    //   this.pointVisible = false
    //   // if (this.getKey == 'triangle') {
    //   //   this.triangleData = this.triangleData.filter(i => i.id != this.delItem.id)
    //   // } else {
    //   this.importPoint = this.importPoint.filter(i => i.id != this.delItem.id)
    //   // }
    //   this.pointChecked.push(this.delItem)
    // },
    touchstart(e) {
      if (this.canAdd || this.canAdd1) {
        let div = document.querySelector('#pointDiv').getBoundingClientRect()
        let x = e.clientX - div.left - 7
        let y = this.curDiv.height - (e.clientY - div.top) - 7
        let addPoint = {
          id: guid(),
          bottom: `${y}px`,
          left: `${x}px`
        }
        if (this.canAdd) {
          addPoint['background-color'] = 'red'
          addPoint['type'] = 1
        } else if (this.canAdd1) {
          addPoint['borderBottom'] = '16px solid red'
          addPoint['type'] = 2
        }
        this.importPoint.push(addPoint)
      }
    },
    reset() {
      console.log('...this.oldRankPointData', this.oldRankPointData)
      this.getKey == 1
        ? (this.pointCheckedEasy = [])
        : this.getKey == 2
        ? (this.pointCheckedOrdinary = [])
        : (this.pointCheckedDifficulty = [])
    },
    async save() {
      let getData =
        this.getKey == 1
          ? this.pointCheckedEasy
          : this.getKey == 2
          ? this.pointCheckedOrdinary
          : this.pointCheckedDifficulty
      let data = getData.map(item => item.id)
      console.log('datadatadatadatadata', data)
      let uniData = this.uniqueData.map(item => item.pointId)
      //对比不同
      let diffData = this.getArrDifference(data, uniData)
      let params = {
        itemId: this.getPoint.id,
        pointIds: data,
        rank: this.getKey
      }
      console.log('params', params)
      // return false
      if (diffData.length == 0) {
        return false
      }
      try {
        let res = await addDefaultRankPoints(params)
        if (res.code == 200) {
          this.$message.success('设置成功')
          console.log(res)
        }
      } catch (e) {}
    },
    handleChange(value) {
      this.getKey = value
      console.log(this.getKey)
      this.initRankPoint()
    },
    getArrDifference(arr1, arr2) {
      return arr1.concat(arr2).filter(function(v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.pointPage {
  height: 100%;
  width: 100%;
}
.pointPosition {
  position: relative;
  margin: 0 auto;
  height: 1000px;
  width: 1000px;
  background-image: url('../../../../assets/pointBaseMap.png');
  background-size: 100% auto;
}
.point {
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: red;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.triangle {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid red;
}
.pointChecked {
  position: absolute;
  width: 15px;
  height: 15px;
  background-color: greenyellow;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}
.triangleChecked {
  position: absolute;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 16px solid greenyellow;
}
.point-mes {
  position: absolute;
  right: 0;
  background: white;
  padding: 10px;
  margin: 10px;
  box-shadow: 2px 2px 5px #888888;

  .mes-type {
    display: flex;
    justify-content: space-between;
  }
}
</style>
