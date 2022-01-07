import Vue from 'vue'
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import { axios } from '@/utils/request'

//获取树列表
const getTreeList = params => getAction('/getChilds', params)
//根据节点id获取资源列表
// const getResByPathNodeId = params => getAction('/getResByPathNodeId', params)
export { getTreeList }
