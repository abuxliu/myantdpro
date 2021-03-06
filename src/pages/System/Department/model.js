import {
  getDepartmentTree,
  listSubDepartmentById,
  addDepartment,
  getDepartmentById,
  updateDepartment,
  enableDepartment,
  deleteDepartment,
  moveDepartment,
} from './service';

export default {
  namespace: 'systemDepartment',

  state: {
    // 部门树
    tree: [],
    // 列表
    list: [],
    // 编辑信息
    department: {},
  },

  effects: {
    *fetch({ callback }, { call, put }) {
      const response = yield call(getDepartmentTree);
      yield put({
        type: 'saveTree',
        payload: {
          tree: response,
        },
      });
      if (callback) callback();
    },
    *fetchChildrenById({ payload, callback }, { call, put }) {
      const response = yield call(listSubDepartmentById, payload);
      const list = response.map(item => ({ ...item, status: !!item.status }));
      yield put({
        type: 'saveList',
        payload: {
          list,
        },
      });
      if (callback) callback();
    },
    *add({ payload, callback }, { call, put }) {
      const { oldParentId: parentId } = payload;
      const params = { ...payload, status: +payload.status };
      const response = yield call(addDepartment, params);
      if (response) {
        return;
      }
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *fetchById({ payload, callback }, { call, put }) {
      const { id } = payload;
      const response = yield call(getDepartmentById, id);
      const department = { ...response, status: !!response.status };
      yield put({
        type: 'save',
        payload: {
          department,
        },
      });
      if (callback) callback();
    },
    *update({ payload, callback }, { call, put }) {
      const { oldParentId: parentId } = payload;
      const params = { ...payload, status: +payload.status };
      const response = yield call(updateDepartment, params);
      if (response) {
        return;
      }
      if (parentId) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id: parentId,
          },
        });
      }
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *enable({ payload, callback }, { call, put }) {
      const { id, status, parentId } = payload;
      const params = { id, status: +status };
      yield call(enableDepartment, params);
      if (parentId) {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id: parentId,
          },
        });
      }
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
    *delete({ payload, callback }, { call, put }) {
      const { id, parentId } = payload;
      const response = yield call(deleteDepartment, id);
      if (response === '') {
        yield put({
          type: 'fetchChildrenById',
          payload: {
            id: parentId,
          },
        });
        yield put({
          type: 'fetch',
        });
        if (callback) callback();
      }
    },
    *move({ payload, callback }, { call, put }) {
      const { parentId } = payload;
      yield call(moveDepartment, payload);
      yield put({
        type: 'fetchChildrenById',
        payload: {
          id: parentId,
        },
      });
      yield put({
        type: 'fetch',
      });
      if (callback) callback();
    },
  },

  reducers: {
    saveTree(state, { payload }) {
      const { tree } = payload;
      return {
        ...state,
        tree,
      };
    },
    clearTree(state) {
      return {
        ...state,
        tree: [],
      };
    },
    saveList(state, { payload }) {
      const { list } = payload;
      return {
        ...state,
        list,
      };
    },
    clearList(state) {
      return {
        ...state,
        list: [],
      };
    },
    save(state, { payload }) {
      const { department } = payload;
      return {
        ...state,
        department,
      };
    },
    clear(state) {
      return {
        ...state,
        department: {},
      };
    },
  },
};
