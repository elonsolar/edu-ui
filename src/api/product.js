/* eslint-disable */ 
import request from '@/utils/request'

const api = {
  sku: '/sku',
  combineSku: '/combine-sku',
  combineSkuItem: '/combine-sku-item',
}

export default api

export function listSku (parameter) {
  return request({
    url: api.sku + '/page',
    method: 'get',
    params: parameter
  })
}

export function getSku (id) {
  return request({
    url: api.sku + '/' + id,
    method: 'get'
  })
}

export function createSku (parameter) {
  return request({
    url: api.sku,
    method: 'post',
    data: parameter
  })
}

export function updateSku (id, parameter) {
  return request({
    url: api.sku + '/' + id,
    method: 'put',
    data: parameter
  })
}


export function takeDownSku (parameter) {
  return request({
    url: api.sku + '/take-down' ,
    method: 'post',
    data: parameter
  })
}

export function placeUpSku (parameter) {
  return request({
    url: api.sku + '/place-up' ,
    method: 'post',
    data: parameter
  })
}


// combineSku
export function listCombineSku (parameter) {
  return request({
    url: api.combineSku + '/page',
    method: 'get',
    params: parameter
  })
}

export function getCombineSku (id) {
  return request({
    url: api.combineSku + '/' + id,
    method: 'get'
  })
}

export function createCombineSku (parameter) {
  return request({
    url: api.combineSku,
    method: 'post',
    data: parameter
  })
}

export function updateCombineSku (id, parameter) {
  return request({
    url: api.combineSku + '/' + id,
    method: 'put',
    data: parameter
  })
}


export function takeDownCombineSku (parameter) {
  return request({
    url: api.combineSku + '/take-down' ,
    method: 'post',
    data: parameter
  })
}

export function placeUpCombineSku (parameter) {
  return request({
    url: api.combineSku + '/place-up' ,
    method: 'post',
    data: parameter
  })
}



// combineSkuItem
export function listCombineSkuItem (parameter) {
  return request({
    url: api.combineSkuItem + '/page',
    method: 'get',
    params: parameter
  })
}

export function getCombineSkuItem (id) {
  return request({
    url: api.combineSkuItem + '/' + id,
    method: 'get'
  })
}

export function createCombineSkuItem (parameter) {
  return request({
    url: api.combineSkuItem,
    method: 'post',
    data: parameter
  })
}

export function deleteCombineSkuItem (id) {
  return request({
    url: api.combineSkuItem+"/"+id,
    method: 'delete',
  })
}

export function updateCombineSkuItem (id, parameter) {
  return request({
    url: api.combineSkuItem + '/' + id,
    method: 'put',
    data: parameter
  })
}