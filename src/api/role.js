import request from '@/utils/request'
/* eslint-disable */
const api = {
  Role: '/role',
  RolePermission: '/role-permission'
}


// FIXME  permission must  belong to tenant
export function getPermissionTree (parameter) {
  return request({
    url: api.Permission + '/tree',
    method: 'get',
    params: parameter
  })
}


// role 
export function listRole (parameter) {
  return request({
    url: api.Role + '/page',
    method: 'get',
    params: parameter
  })
}

export function getRole (id) {
  return request({
    url: api.Role ,
    method: 'get',
    params: {"id": id}
  })
}

export function createRole (parameter) {
  return request({
    url: api.Role,
    method: 'post',
    data: parameter
  })
}

export function updateRole (id, parameter) {
  return request({
    url: api.Role + '/' + id,
    method: 'put',
    data: parameter
  })
}




export function getRolePermission (parameter) {
  return request({
    url: api.Role + '/permission',
    method: 'get',
    params: parameter
  })
}

export function saveRolePermission (parameter) {
  return request({
    url: api.Role + '/permission',
    method: 'post',
    data: parameter
  })
}