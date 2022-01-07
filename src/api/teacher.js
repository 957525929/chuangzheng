import { getAction, postAction } from '@/api/manage'
import qs from 'qs'
export const teacherApi = {
  //获取所有教师列表
  getAllTeacherList: params => {
    return getAction('/managerweb/ManagerController/getAllTeacherList', params)
  },
  //添加教师
  addTeacher: params => {
    return postAction('/managerweb/ManagerController/addTeacher', params)
  },
  //重置密码
  resetPwd: params => {
    return postAction('/managerweb/ManagerController/resetPwd', params)
  },
  //设置教师是否有权限修改资源
  updateTeacherHasRight: params => {
    return postAction('/managerweb/ManagerController/updateTeacherHasRight', params)
  },
  //修改教师信息
  updateTeacher: params => {
    return postAction('/managerweb/ManagerController/updateTeacher', params)
  },
  //启用/禁用教师
  updateTeacherState: params => {
    return postAction('/managerweb/ManagerController/updateTeacherState', params)
  },
  //批量导入教师列表
  importTeacherList: params => {
    return postAction('/managerweb/ManagerController/importTeacherList', params)
  },
  //判断账号是否已存在
  isAccount: params => {
    return getAction('/managerweb/ManagerController/isAccount', params)
  },
  //判断账号是否已存在
  isAccountList: params => {
    return getAction(
      '/managerweb/ManagerController/isAccountList?' + qs.stringify(params, { arrayFormat: 'repeat' }),
      {}
    )
  }
}
