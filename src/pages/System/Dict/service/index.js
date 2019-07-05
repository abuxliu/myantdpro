import request from '@/utils/request';

/**
 * 条件查询字典列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function queryDictList(params) {
  const { parentId = -1, pageSize = 10, current = 1 } = params;
  return request(`/api/v1/dicts?parentId=${parentId}&pageSize=${pageSize}&pageNum=${current}`);
}

/**
 * 按主键查询一条字典数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function queryDictOneById(id) {
  return request(`/api/v1/dicts/${id}`);
}

/**
 * 添加字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function addDict(params) {
  return request('/api/v1/dicts', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

/**
 * 删除字典。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDict(id) {
  return request(`/api/v1/dicts/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除字典。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchDict(ids) {
  return request(`/api/v1/dicts`, {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}

/**
 * 更新字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateDict(params = {}) {
  return request('/api/v1/dicts', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}