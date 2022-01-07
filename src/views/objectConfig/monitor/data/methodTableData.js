export const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    customRender: (text, record, index) => `${index + 1}`
  },
  {
    title: '名称',
    dataIndex: 'name'
  },
  {
    title: '描述',
    dataIndex: 'description'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' }
  }
]
export const tableData = [
  // {
  //   key: '1',
  //   name: '精密三角高程测量',
  //   eName: 'Precise Trigonometric Leveling',
  //   time: '2021-10-27 14:33:41'
  // },
  // {
  //   key: '2',
  //   name: '小角法水平位移测量',
  //   eName: 'Horizontal displacement measurement by small angle method',
  //   time: '2021-10-20 08:58:52'
  // }
]
