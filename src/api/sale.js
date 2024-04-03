/* eslint-disable */ 
import request from '@/utils/request'

const api = {
  saleOrder: '/sale-order',
  saleOrderItem: '/sale-order-item',
}

export default api

export function listSaleOrder (parameter) {
  return request({
    url: api.saleOrder + '/page',
    method: 'get',
    params: parameter
  })
}

export function getSaleOrder (id) {
  return request({
    url: api.saleOrder + '/' + id,
    method: 'get'
  })
}

export function createSaleOrder (parameter) {
  return request({
    url: api.saleOrder,
    method: 'post',
    data: parameter
  })
}

export function updateSaleOrder (id, parameter) {
  return request({
    url: api.saleOrder + '/' + id,
    method: 'put',
    data: parameter
  })
}



// SaleOrderItem
export function listSaleOrderItem (parameter) {
  return request({
    url: api.saleOrderItem + '/page',
    method: 'get',
    params: parameter
  })
}

export function getSaleOrderItem (id) {
  return request({
    url: api.saleOrderItem + '/' + id,
    method: 'get'
  })
}

export function createSaleOrderItem (parameter) {
  return request({
    url: api.saleOrderItem,
    method: 'post',
    data: parameter
  })
}

export function updateSaleOrderItem (id, parameter) {
  return request({
    url: api.saleOrderItem + '/' + id,
    method: 'put',
    data: parameter
  })
}



