export const columns = [
  {
    title: '序号',
    dataIndex: 'num',
    scopedSlots: { customRender: 'num' }
  },
  {
    title: '资源名称',
    dataIndex: 'resName'
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    scopedSlots: { customRender: 'updateTime' }
  },
  {
    title: '类型',
    dataIndex: 'resType'
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
  //   name: '简介',
  //   eName: 'info',
  //   time: '2021-10-27 14:33:41',
  //   type: 'html'
  // },
  // {
  //   key: '2',
  //   name: '展示图片',
  //   eName: 'image',
  //   time: '2021-10-20 08:58:52',
  //   type: 'jpg'
  // }
]
