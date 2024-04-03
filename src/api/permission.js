import request from '@/utils/request'
/* eslint-disable */
const api = {
  Permission: '/permission',
  Role: '/role',
  RolePermission: '/role-permission'
}

export function listPermission (parameter) {
  return request({
    url: api.Permission + '/page',
    method: 'get',
    params: parameter
  })
}

export function getPermission (id) {
  return request({
    url: api.Permission ,
    method: 'get',
    params: {"id": id}
  })
}

export function createPermission (parameter) {
  return request({
    url: api.Permission,
    method: 'post',
    data: parameter
  })
}

export function updatePermission (id, parameter) {
  return request({
    url: api.Permission + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function getPermissionTree (parameter) {
  return request({
    url: api.Permission + '/tree',
    method: 'get',
    params: parameter
  })
}
