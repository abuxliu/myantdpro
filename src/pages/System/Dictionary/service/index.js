import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 条件查询字典列表数据。
 * @param params
 * @returns {Promise<void>}
 */
export async function pageDict(params) {
  return request(`/dictionaries?${stringify(params)}`);
}

/**
 * 添加字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function addDict(params) {
  return request('/dictionaries', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

/**
 * 按主键查询一条字典数据。
 * @param id
 * @returns {Promise<void>}
 */
export async function getDictById(id) {
  return request(`/dictionaries/${id}`);
}

/**
 * 更新字典。
 * @param params
 * @returns {Promise<void>}
 */
export async function updateDict(params) {
  const { id } = params;
  return request(`/dictionaries/${id}`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

/**
 * 启用禁用字典。
 *
 * @param params
 * @returns {Promise<void>}
 */
export async function enableDict(params) {
  const { id, status } = params;
  return request(`/dictionaries/${id}`, {
    method: 'PATCH',
    data: {
      status,
    },
  });
}

/**
 * 删除字典。
 * @param id
 * @returns {Promise<void>}
 */
export async function deleteDict(id) {
  return request(`/dictionaries/${id}`, {
    method: 'DELETE',
  });
}

/**
 * 批量删除字典。
 * @param ids
 * @returns {Promise<void>}
 */
export async function deleteBatchDict(ids) {
  return request(`/dictionaries`, {
    method: 'DELETE',
    data: {
      ids,
    },
  });
}
