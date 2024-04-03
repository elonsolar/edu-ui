import request from '@/utils/request'
/* eslint-disable */
const api = {
  Tenant: '/tenant',
  TenantPermission: '/tenant-permission'
}




// tenant 
export function listTenant (parameter) {
  return request({
    url: api.Tenant + '/page',
    method: 'get',
    params: parameter
  })
}

export function getTenant (id) {
  return request({
    url: api.Tenant ,
    method: 'get',
    params: {"id": id}
  })
}

export function createTenant (parameter) {
  return request({
    url: api.Tenant,
    method: 'post',
    data: parameter
  })
}

export function updateTenant (id, parameter) {
  return request({
    url: api.Tenant + '/' + id,
    method: 'put',
    data: parameter
  })
}

export function getTenantPermissionTree (parameter) {
  return request({
    url: api.Tenant + '/permission-tree',
    method: 'get',
    params: parameter
  })
}


export function getTenantPermission (parameter) {
  return request({
    url: api.Tenant + '/permission',
    method: 'get',
    params: parameter
  })
}

export function saveTenantPermission (parameter) {
  return request({
    url: api.Tenant + '/permission',
    method: 'post',
    data: parameter
  })
}