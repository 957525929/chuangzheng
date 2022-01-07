export const nodeList = [
    {
      'id': 'nodeBegin',
      'width': 80,
      'height': 50,
      'coordinate': [-644, -148],
      'meta': {
        'prop': 'start',
        'name': '开始'
      }
    },
    {
      'id': 'nodeProcess1',
      'width': 160,
      'height': 80,
      'coordinate': [-442, -163],
      'meta': {
        'prop': 'process',
        'name': '流程',
        'desc': '自动化监测',
        'info': '自动化监测就是采用某些自动化设备，通过使用电能或其他能源支撑，从而使自动化设备能够实现对某些项目或设备的全天候不间断的各种数据运行数据监测。'
      }
    },
    {
      'id': 'nodeProcess1-1',
      'width': 160,
      'height': 80,
      'coordinate': [-210, -163],
      'meta': {
        'prop': 'process',
        'name': '流程',
        'desc': '后方交会法',
        'info': '后方交会是指仅在待定点上设站，向两个已知控制点观测一个水平夹角A，从而计算待定点的坐标，称为后方交会。交会测量是加密控制点常用的方法，它可以在数个已知控制点上设站，分别向待定点观测方向或距离，也可以在待定点上设站向数个已知控制点观测方向或距离，而后计算待定点的坐标。常用的交会监测方法有前方交会、后方交会、侧边交会和自由设站法。'
      }
    },
    // {
    //   'id': 'nodeProcess2',
    //   'width': 160,
    //   'height': 80,
    //   'coordinate': [-442, -75],
    //   'meta': {
    //     'prop': 'process',
    //     'name': '流程',
    //     'desc': '手动监测',
    //     'info': '手动监测是指...'
    //   }
    // },
    // {
    //   'id': 'nodeProcess2-1',
    //   'width': 160,
    //   'height': 80,
    //   'coordinate': [-210, -133],
    //   'meta': {
    //     'prop': 'process',
    //     'name': '流程',
    //     'desc': '小角法',
    //     'info': '小角度法又称小角法，是水平位移监测中常用的方法，通过测定基准线方向与观测点的视线方向之间的微小角度从而计算观测点相对于基准线的偏离值。'
    //   }
    // },
    // {
    //   'id': 'nodeProcess2-2',
    //   'width': 160,
    //   'height': 80,
    //   'coordinate': [-210, -17],
    //   'meta': {
    //     'prop': 'process',
    //     'name': '流程',
    //     'desc': '极坐标法',
    //     'info': '极坐标法是在控制点上测设一个角度和一段距离来确定点的平面位置。'
    //   }
    // },
    // {
    //   'id': 'nodefHsy9uJObPtdHZv1',
    //   'width': 160,
    //   'height': 80,
    //   'coordinate': [-200, -148],
    //   'meta': {
    //     'prop': 'approval',
    //     'name': '审批节点',
    //     'desc': '111111'
    //   }
    // },
    // {
    //   'id': 'nodeZBK0ZPpgMe1exezE',
    //   'width': 160,
    //   'height': 80,
    //   'coordinate': [-200, -275],
    //   'meta': {
    //     'prop': 'approval',
    //     'name': '审批节点'
    //   }
    // },
    {
      'id': 'nodeEquip1',
      'width': 160,
      'height': 80,
      'coordinate': [34, -163],
      'meta': {
        'prop': 'equip',
        'name': '仪器',
        'desc': '全站仪',
        'info': '测量中使用最主要的仪器之一，主要通过几个已知点坐标建立坐标系，获取测量点与仪器之间测距和角度值，换算成测量点在该坐标系的三维坐标，通过不同时段获取的三维坐标的变化反映位移变化。用于测量基坑围护墙顶部水平位移。三脚架作为全站仪架设的基础，一方面为了仪器稳定架设，一方面有一定的高度方便测量人员观测。',
        'max': 20,
        'min': 12
      }
    },
    {
      'id': 'nodeEnd',
      'width': 80,
      'height': 50,
      'coordinate': [286, -148],
      'meta': {
        'prop': 'end',
        'name': '结束'
      }
    },
    // {
    //   'id': 'node0aiA9VuhjkiAdZCs',
    //   'width': 160,
    //   'height': 80,
    //   'coordinate': [-200, -2],
    //   'meta': {
    //     'prop': 'approval',
    //     'name': '审批节点'
    //   }
    // },
  ]
  export const linkList = [
    {
      'id': 'link1',
      'startId': 'nodeBegin',
      'endId': 'nodeProcess1',
      'startAt': [100, 40],
      'endAt': [0, 40],
      'meta': null
    },
    {
      'id': 'link2',
      'startId': 'nodeProcess1',
      'endId': 'nodeProcess1-1',
      'startAt': [160, 40],
      'endAt': [0, 40],
      'meta': null
    },
    {
      'id': 'link3',
      'startId': 'nodeProcess1-1',
      'endId': 'nodeEquip1',
      'startAt': [160, 40],
      'endAt': [0, 40],
      'meta': null
    },
    {
      'id': 'link4',
      'startId': 'nodeEquip1',
      'endId': 'nodeEnd',
      'startAt': [160, 40],
      'endAt': [0, 40],
      'meta': null
    },
    // {
    //   'id': 'link5',
    //   'startId': 'nodeBegin',
    //   'endId': 'nodeProcess2',
    //   'startAt': [160, 40],
    //   'endAt': [0, 40],
    //   'meta': null
    // },
    // {
    //   'id': 'link6',
    //   'startId': 'nodeProcess2',
    //   'endId': 'nodeProcess2-1',
    //   'startAt': [160, 40],
    //   'endAt': [0, 25],
    //   'meta': null
    // },
    // {
    //   'id': 'link7',
    //   'startId': 'nodeProcess2-1',
    //   'endId': 'nodeEquip1',
    //   'startAt': [160, 40],
    //   'endAt': [0, 25],
    //   'meta': null
    // },
    // {
    //   'id': 'link8',
    //   'startId': 'nodeProcess2',
    //   'endId': 'nodeProcess2-2',
    //   'startAt': [160, 40],
    //   'endAt': [0, 25],
    //   'meta': null
    // },
    // {
    //   'id': 'link9',
    //   'startId': 'nodeProcess2-2',
    //   'endId': 'nodeEquip1',
    //   'startAt': [160, 40],
    //   'endAt': [0, 25],
    //   'meta': null
    // },
  ]