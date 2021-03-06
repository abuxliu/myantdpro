import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Switch, message, TreeSelect, Button } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;

const DepartmentForm = connect(({ systemDepartment: { tree, department }, loading }) => ({
  tree,
  department,
  loading: loading.effects['systemDepartment/fetchById'],
}))(
  Form.create({ name: 'departmentForm' })(
    ({ loading, children, isEdit, id, department, tree, form, dispatch }) => {
      const { validateFields, getFieldDecorator, resetFields, setFieldsValue } = form;

      // 【模态框显示隐藏属性】
      const [visible, setVisible] = useState(false);

      // 【模态框显示隐藏函数】
      const showModalHandler = e => {
        if (e) e.stopPropagation();
        setVisible(true);
      };
      const hideModelHandler = () => {
        setVisible(false);
      };

      // 【获取数据】
      useEffect(() => {
        if (visible && isEdit) {
          dispatch({
            type: 'systemDepartment/fetchById',
            payload: {
              id,
            },
          });
        }
        return () => {
          dispatch({
            type: 'systemDepartment/clear',
          });
        };
      }, [visible, isEdit, id, dispatch]);

      // 【修改时，回显表单】
      useEffect(() => {
        // 👍 将条件判断放置在 effect 中
        if (visible && isEdit) {
          if (Object.keys(department).length > 0) {
            // 不论是否修改父部门，保证页面停留在原页面下。
            const formData = {
              id: department.id,
              name: department.name,
              parentId: department.parentId,
              status: department.status,
            };
            if (!department.parentId) {
              delete formData.parentId;
            }
            setFieldsValue({ ...formData, oldParentId: department.parentId });
          }
        }
      }, [visible, isEdit, department, setFieldsValue]);

      // 【新建时，保证任何时候添加上级菜单都有默认值】
      // 不论是否修改父部门，保证页面停留在原页面下。
      useEffect(() => {
        if (visible && !isEdit) {
          if (id) {
            setFieldsValue({ parentId: id, oldParentId: id });
          } else if (tree.length) {
            setFieldsValue({ parentId: tree[0].id, oldParentId: tree[0].id });
          }
        }
      }, [visible, isEdit, id, tree, setFieldsValue]);

      // 【添加与修改】
      const handleAddOrUpdate = () => {
        validateFields((err, fieldsValue) => {
          if (err) return;

          if (isEdit) {
            dispatch({
              type: 'systemDepartment/update',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('修改成功');
              },
            });
          } else {
            dispatch({
              type: 'systemDepartment/add',
              payload: fieldsValue,
              callback: () => {
                resetFields();
                hideModelHandler();
                message.success('添加成功');
              },
            });
          }
        });
      };

      // 【表单布局】
      const formItemLayout = {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 17 },
        },
      };

      return (
        <>
          <span onClick={showModalHandler}>{children}</span>
          <Modal
            destroyOnClose
            title={isEdit ? '修改' : '新增'}
            visible={visible}
            onOk={handleAddOrUpdate}
            onCancel={hideModelHandler}
            footer={[
              <Button key="back" onClick={hideModelHandler}>
                取消
              </Button>,
              <Button key="submit" type="primary" loading={loading} onClick={handleAddOrUpdate}>
                确定
              </Button>,
            ]}
          >
            <Form {...formItemLayout}>
              {isEdit && getFieldDecorator('id')(<Input hidden />)}
              {getFieldDecorator('oldParentId')(<Input hidden />)}
              <FormItem label="名称">
                {getFieldDecorator('name', {
                  rules: [
                    {
                      required: true,
                      message: '请将名称长度保持在1至20字符之间！',
                      min: 1,
                      max: 20,
                    },
                  ],
                })(<Input />)}
              </FormItem>
              {isEdit && !department.parentId ? null : (
                <FormItem label="父部门">
                  {getFieldDecorator('parentId', {
                    rules: [{ required: true, message: '请选择一个父部门！' }],
                  })(
                    <TreeSelect
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      treeData={tree}
                      placeholder="请选择部门"
                      treeDefaultExpandAll
                    />,
                  )}
                </FormItem>
              )}
              <FormItem label="状态">
                {getFieldDecorator('status', {
                  rules: [{ required: true }],
                  initialValue: true,
                  valuePropName: 'checked',
                })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
              </FormItem>
              <FormItem label="描述">
                {getFieldDecorator('description', {
                  rules: [{ message: '请将描述长度保持在1至50字符之间！', min: 1, max: 50 }],
                })(
                  <TextArea placeholder="请输入部门描述。" autoSize={{ minRows: 2, maxRows: 6 }} />,
                )}
              </FormItem>
            </Form>
          </Modal>
        </>
      );
    },
  ),
);

export default DepartmentForm;
