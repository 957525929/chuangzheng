<template>
  <div class="pointPage">
    <a-button
      style="margin:0 10px 10px 0"
      ghost
      :type="canAdd ? 'danger' : 'primary'"
      @click="showAdd"
      :disabled="canAdd1"
      >{{ addBtn }}</a-button
    >
    <a-button
      style="margin-bottom: 10px"
      ghost
      :type="canAdd1 ? 'danger' : 'primary'"
      @click="showAdd1"
      :disabled="canAdd"
      >{{ addBtn1 }}</a-button
    >
    <span style="float:right">
      <a-button
        style="margin:0 10px 10px 0"
        ghost
        :type="canAdd1 ? 'danger' : 'primary'"
        @click="exportExcel"
        :disabled="canAdd1 || canAdd"
        >下载模板</a-button
      >
      <a-upload :file-list="fileList" @change="fileChange" :before-upload="readExcel" accept=".xls,.xlsx">
        <div v-if="fileList.length < 1">
          <a-button
            style="margin:0 10px 10px 0"
            ghost
            :type="canAdd1 ? 'danger' : 'primary'"
            :disabled="canAdd1 || canAdd"
            >导入</a-button
          >
        </div>
      </a-upload>
      <a-button
        style="margin:0 10px 10px 0"
        ghost
        :type="canAdd1 || canAdd ? 'danger' : 'primary'"
        :disabled="canAdd1 || canAdd"
        @click="save"
        >保存</a-button
      >
      <a-button
        style="margin-bottom: 10px"
        ghost
        :type="canAdd1 || canAdd ? 'danger' : 'primary'"
        :disabled="canAdd1 || canAdd"
        @click="reset"
        >重置</a-button
      >
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

    <!-- 测点modal -->
    <a-modal width="30%" title="注意" :visible="pointVisible" @ok="pointOk" @cancel="pointVisible = false">
      <p>是否删除该测点？</p>
    </a-modal>
  </div>
</template>

<script>
import { pointData } from '@views/objectConfig/monitor/data/pointData'
import { guid } from '@/utils/util'
import { export2Excel } from '../../../../assets/Excel/excelexport'
import { getPointItemList, importItemPoints } from '@/api/scene'
export default {
  props: ['getData'],
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
      triangleData: [],
      getKey: '',
      curDiv: {
        width: '',
        height: ''
      },
      info: {
        x: '',
        y: ''
      },
      fileList: [],
      addPoint: [],
      uniqueData: []
    }
  },
  mounted() {
    // this.init()
  },
  watch: {
    getData() {
      this.loadData()
    }
  },
  methods: {
    async loadData() {
      console.log(this.getData, 'this.da121212ta')
      let params = {
        itemId: this.getData.id
      }
      // console.log(params, 'data')
      try {
        let res = await getPointItemList(params)
        if (res.code == 200) {
          console.log(res.data)
          this.uniqueData = res.data
          this.importPoint = res.data
          this.init()
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
      this.oldPointData = [...this.importPoint]
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
      this.pointVisible = true
      this.getKey = key
    },
    pointOk() {
      this.pointVisible = false
      if (!this.delItem.itemId) {
        this.importPoint = this.importPoint.filter(i => i.id != this.delItem.id)
      }
    },

    //添加测点modal
    showAdd() {
      if (!this.canAdd) {
        this.$message.info('请在图中点击以添加测点')
        this.canAdd = true
        this.addBtn = '结束'
      } else if (this.canAdd) {
        this.$message.success('添加点结束')
        this.canAdd = false
        this.addBtn = '新增测点'
      }
    },
    //添加基准点modal
    showAdd1() {
      if (!this.canAdd1) {
        this.$message.info('请在图中点击以添加基准点')
        this.canAdd1 = true
        this.addBtn1 = '结束'
      } else if (this.canAdd1) {
        this.$message.success('添加基准点结束')
        this.canAdd1 = false
        this.addBtn1 = '新增基准点'
      }
    },
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
        this.addPoint.push(addPoint)
        this.importPoint.push(addPoint)
      }
    },
    reset() {
      this.importPoint = [...this.oldPointData]
      this.addPoint = []
    },
    async save() {
      let pushData = this.importPoint.map(item => {
        item.x = (parseFloat(item.bottom) - this.curDiv.height * 0.035) / 1.84
        item.y = -parseFloat(item.left) / 1.94
        return item
      })
      pushData = pushData.filter(item => !item.itemId)
      console.log('pushData', pushData)
      this.importItem(pushData)
    },
    async importItem(value) {
      let params = {
        itemId: this.getData.id,
        points: value
      }
      // console.log(this.uniqueData, 'this.uniqueData')
      // return false
      try {
        let res = await importItemPoints(params)
        if (res.code == 200) {
          this.$message.success('添加成功')

          // this.$emit('updateCustom')
          this.loadData()
        }
      } catch (e) {}
    },
    exportExcel() {
      console.log(this.classId, 'this.classId')
      const sheetName = ['测点']
      const list = [[['x', 'y', 'type']]]

      //list[1].push(...this.errorDatas);
      for (let i = 0; i < this.pointData.length; i++) {
        list[0].push([this.pointData[i].x, this.pointData[i].y, this.pointData[i].type])
      }
      console.log('list', list)
      const fileName = '测点'
      export2Excel(sheetName, list, fileName)
    },
    fileChange() {},
    readExcel(file) {
      const that = this
      // 拿取文件对象
      var f = file
      // 用FileReader来读取
      var reader = new FileReader()
      // 重写FileReader上的readAsBinaryString方法
      FileReader.prototype.readAsBinaryString = f => {
        var binary = ''
        var wb // 读取完成的数据
        var outdata // 你需要的数据
        var reader = new FileReader()
        reader.onload = e => {
          // 读取成Uint8Array，再转换为Unicode编码（Unicode占两个字节）
          var bytes = new Uint8Array(reader.result)
          var length = bytes.byteLength
          for (var i = 0; i < length; i++) {
            binary += String.fromCharCode(bytes[i])
          }
          // debugger;
          // return false;
          var XLSX = require('xlsx')
          wb = XLSX.read(binary, {
            type: 'binary'
          })
          var pushData = []
          pushData.list = []
          for (let j = 0; j < 1; j++) {
            // {"id":"123","级别":"自然部","年份":"2021","图层名称":"二违"}
            outdata = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[j]])
            console.log(JSON.stringify(outdata))
            for (let i = 0; i < outdata.length; i++) {
              // if (j == 0) {
              //   pushData.classeId = outdata[i]['测点id']
              // } else {
              // "行政区":"康美村","类型":1,"面积":500
              let obj = {
                x: outdata[i]['x'],
                y: outdata[i]['y'],
                type: outdata[i]['type']
              }
              // console.log("obj", obj);
              pushData.list.push(obj)
              // }
            }
          }
          // console.log("-----base----" + JSON.stringify(pushData.base));
          // console.log("-----list----" + JSON.stringify(pushData.list));
          this.importPoint = pushData.list
          this.$emit('updatePoint', this.importPoint)
          this.importItem(pushData.list)
          // this.init()
          // this.reImport(pushData)
          // console.log(this.pushData.list)
          // console.log('pushData', this.pushData)

          // console.log(this.importPoint, 'this.dataSource')
        }
        reader.readAsArrayBuffer(f)
      }
      reader.readAsBinaryString(f)
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
  background-color: greenyellow;
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
