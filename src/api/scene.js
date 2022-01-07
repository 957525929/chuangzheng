import Vue from 'vue'
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import { axios } from '@/utils/request'

//新增场景
const addScene = params => postAction('/programmerweb/SceneController/addScene', params)
const getSceneList = params => getAction('/programmerweb/SceneController/getSceneList', params)
const updateScene = params => postAction('/programmerweb/SceneController/updateScene', params)
//场景测项
const addSceneItem = params => postAction('/programmerweb/SceneItemController/addSceneItem', params)
const getSceneItemList = params => getAction('/programmerweb/SceneItemController/getSceneItemList', params)
const updateSceneItem = params => postAction('/programmerweb/SceneItemController/updateSceneItem', params)
const getMethodList = params => getAction('/programmerweb/MethodController/getMethodList', params)
const addMethod = params => postAction('/programmerweb/MethodController/addMethod', params)
const updateMethod = params => postAction('/programmerweb/MethodController/updateMethod', params)
const deleteMethod = params => postAction('/programmerweb/MethodController/deleteMethod', params)
//测点
const getPointItemList = params => getAction('/programmerweb/SceneItemController/getPointItemList', params)
const getPointRankAndPointItemList = params =>
  getAction('/programmerweb/SceneItemController/getPointRankAndPointItemList', params)
const importItemPoints = params => postAction('/programmerweb/SceneItemController/importItemPoints', params)
const addDefaultRankPoints = params => postAction('/programmerweb/SceneItemController/addDefaultRankPoints', params)
export {
  addScene,
  getSceneList,
  updateScene,
  addSceneItem,
  getSceneItemList,
  updateSceneItem,
  deleteMethod,
  getMethodList,
  addMethod,
  updateMethod,
  getPointItemList,
  importItemPoints,
  getPointRankAndPointItemList,
  addDefaultRankPoints
}
