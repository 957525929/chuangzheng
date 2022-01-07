export const processData = {
    list: [
        {
            key: '1',
            id: '1',
            name: '简介',
            type: 'html'
        },
        {
            key: '2',
            id: '2',
            name: '示例图片',
            type: 'jpg'
        }
    ],
    process: {
      "nodeList": [
        {
          "id": "nodeBegin",
          "width": 80,
          "height": 50,
          "coordinate": [
            -644,
            -133
          ],
          "meta": {
            "prop": "start",
            "title": "开始"
          }
        },
        {
          "id": "nodeEnd",
          "width": 80,
          "height": 50,
          "coordinate": [
            286,
            -133
          ],
          "meta": {
            "prop": "end",
            "title": "结束"
          }
        },
        {
          "id": "nodeProcess1-1",
          "width": 160,
          "height": 80,
          "coordinate": [
            -97,
            -148
          ],
          "meta": {
            "prop": "process",
            "title": "活动",
            "name": "后方交会法",
            "nameEng": "radial intersection method",
            "isRelevancy":true,
            "type":'移动监测仪器',
            "eqId": '1',
            "description": "后方交会是指仅在待定点上设站，向两个已知控制点观测一个水平夹角A，从而计算待定点的坐标，称为后方交会。交会测量是加密控制点常用的方法，它可以在数个已知控制点上设站，分别向待定点观测方向或距离，也可以在待定点上设站向数个已知控制点观测方向或距离，而后计算待定点的坐标。常用的交会监测方法有前方交会、后方交会、侧边交会和自由设站法。"

          }
        },
        {
          "id": "nodeEquip1",
          "width": 160,
          "height": 80,
          "coordinate": [
            -97,
            12
          ],
          "meta": {
            "prop": "equip",
            "title": "仪器",
            "name": "全站仪",
            "type": "移动监测仪器",
            "description": "测量中使用最主要的仪器之一，主要通过几个已知点坐标建立坐标系，获取测量点与仪器之间测距和角度值，换算成测量点在该坐标系的三维坐标，通过不同时段获取的三维坐标的变化反映位移变化。用于测量基坑围护墙顶部水平位移。三脚架作为全站仪架设的基础，一方面为了仪器稳定架设，一方面有一定的高度方便测量人员观测。",
            "max": 20,
            "min": 12
          }
        },
        {
          "id": "nodeProcess1",
          "width": 160,
          "height": 80,
          "coordinate": [
            -389,
            -148
          ],
          "meta": {
            "prop": "process",
            "title": "活动",
            "name": "自动化监测",
            "nameEng": "automated monitoring",
            "isRelevancy":false,
            "description": "自动化监测就是采用某些自动化设备，通过使用电能或其他能源支撑，从而使自动化设备能够实现对某些项目或设备的全天候不间断的各种数据运行数据监测。"
          }
        }
      ],
      "linkList": [
        {
          "id": "linkEKwzafIV9XCfy7t5",
          "startId": "nodeProcess1-1",
          "endId": "nodeEquip1",
          "startAt": [
            80,
            80
          ],
          "endAt": [
            80,
            0
          ],
          "meta": null
        },
        {
          "id": "link3s0UUobUuXZUMiYY",
          "startId": "nodeProcess1-1",
          "endId": "nodeEnd",
          "startAt": [
            160,
            40
          ],
          "endAt": [
            0,
            25
          ],
          "meta": null
        },
        {
          "id": "linkShOkdAspYP1SpEgW",
          "startId": "nodeProcess1",
          "endId": "nodeProcess1-1",
          "startAt": [
            160,
            40
          ],
          "endAt": [
            0,
            40
          ],
          "meta": null
        },
        {
          "id": "linkrKyXKSWV1EluLNF5",
          "startId": "nodeBegin",
          "endId": "nodeProcess1",
          "startAt": [
            80,
            25
          ],
          "endAt": [
            0,
            40
          ],
          "meta": null
        }
      ]
    }
}