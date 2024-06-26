import request from '@/utils/request'
/* eslint-disable */ 
const api = {
  user: '/user',
  role: '/role',
  service: '/service',
  permission: '/permission',
  permissionNoPager: '/permission/no-pager',
  orgTree: '/org/tree'
}

export default api

export function listUser (parameter) {
  return request({
    url: api.user + '/page',
    method: 'get',
    params: parameter
  })
}

export function updateUser (id,parameter) {
  return request({
    url: api.user + '/' +id,
    method: 'put',
    data: parameter
  })
}

export function createUser (parameter) {
  return request({
    url: api.user ,
    method: 'post',
    data: parameter
  })
}
export function changePassword (parameter) {
  return request({
    url: api.user ,
    method: 'post',
    data: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permissionNoPager,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}
