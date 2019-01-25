import request from '@/utils/request'
export function getInfo(params) {
  // 获取网址信息
  return request({
    url: '/api/getAddressList',
    method: 'get',
    params
  })
}
export function addInfo(data) {
  // 添加网址
  return request({
    url: '/api/insertAddress',
    method: 'post',
    data
  })
}
export function removeInfo(data) {
  // 删除网址
  return request({
    url: '/api/removeAddress',
    method: 'post',
    data
  })
}
export function updateInfo(data) {
  // 修改网址
  return request({
    url: '/api/updateAddress',
    method: 'post',
    data
  })
}
