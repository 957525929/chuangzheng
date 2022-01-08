export const monitor = {
  columns: [
    {
      title: '序号',
      dataIndex: 'num',
      scopedSlots: { customRender: 'num' }
    },
    {
      title: '名称',
      dataIndex: 'name'
    },
    // {
    //   title: '英文名称',
    //   dataIndex: 'eName'
    // },
    {
      title: '所属场景',
      dataIndex: 'scene',
      scopedSlots: { customRender: 'scene' }
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      scopedSlots: { customRender: 'updateTime' }
    },
    {
      title: '描述',
      dataIndex: 'description',
      scopedSlots: { customRender: 'description' }
    },
    {
      title: '操作',
      key: 'action',
      scopedSlots: { customRender: 'action' }
    }
  ],
  tableData: [],
  form_item: [
    {
      type: 'input',
      label: '名称',
      name: 'name'
    },
    {
      type: 'picker',
      label: '时间',
      format: 'YYYY-MM-DD',
      startTimeLabel: '开始时间',
      endTimeLabel: '结束时间',
      startTime: 'startTime',
      endTime: 'endTime'
    }
  ]
}
