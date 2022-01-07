import Vue from 'vue'
import { getAction, deleteAction, putAction, postAction, httpAction } from '@/api/manage'
import { axios } from '@/utils/request'

//仪器列表
const getEquipmentList = params => getAction('/programmerweb/EquipmentController/getEquipmentList', params)
const getEqPara = params => getAction('/programmerweb/EquipmentController/getEqPara', params)
const getEqType = params => getAction('/programmerweb/EquipmentController/getEqType', params)

const addEquipment = params => postAction('/programmerweb/EquipmentController/addEquipment', params)
const deleteEquipment = params => postAction('/programmerweb/EquipmentController/deleteEquipment', params)

const updateEqParam = params => postAction('/programmerweb/EquipmentController/updateEqParam', params)
const updateEquipment = params => postAction('/programmerweb/EquipmentController/updateEquipment', params)
export { getEquipmentList, addEquipment, deleteEquipment, getEqPara, updateEqParam, updateEquipment, getEqType }
