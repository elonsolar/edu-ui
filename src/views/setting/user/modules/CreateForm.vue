<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel')}">
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
        <a-form-item label="用户名">
          <a-input v-decorator="['username', {rules: [{required: true,  message: '请输入姓名！'}]}]" />
        </a-form-item>
        <a-form-item label="手机号">
          <a-input v-decorator="['mobile', {rules: [{required: true,  message: '请输入手机号！'}]}]" />
        </a-form-item>
        <a-form-item v-show="!model" label="密码">
          <a-input v-decorator="['password', {rules: [{required: true,  message: '请输入密码！'}]}]" />
        </a-form-item>
        <a-form-item label="角色">
          <a-select
          v-decorator="['roleId']"
          style="width: 100%"
          placeholder="请选择角色"
          @change="handleRoleChange"
          >
            <a-select-option v-for="(item) in roleList" :name="item.name" :key="item.id">
                {{ item.name }}
              </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item v-show="false" label="角色名称">
          <a-input v-decorator="['roleName', {rules: []}]" />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-decorator="['description', {rules: []}]" />
        </a-form-item>
        <a-form-item v-show="false" label="version">
          <a-input v-decorator="['version', {rules: []}]" />
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable */ 
import md5 from 'md5'
import pick from 'lodash.pick'
import { listRole } from '@/api/role'
// 表单字段
const fields = ['description', 'id', 'username', 'mobile', 'kind','roleId','roleName', 'version']

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    loading: {
      type: Boolean,
      default: () => false
    },
    title: {
      type: String,
      default: () => '新增'
    },
    model: {
      type: Object,
      default: () => null
    }
  },
  data () {
    this.formLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      }
    }
    return {
      form: this.$form.createForm(this),
      roleList: []
    }
  },
  created () {

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
    this.initRoleList()    

  },
  methods:{
    initRoleList(){
      let that =this
        var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{ } ]
        }
        // todo 
        const newObj = {"pageSize":999, 'expr': JSON.stringify(expr) }
        listRole(newObj) .then(res => {
          that.roleList=res.data
          })
    },
    handleRoleChange(id ,node){
      this.form.setFieldsValue({"roleName":node.data.attrs.name})
    },
    submit(){
      this.$emit('ok')
    }


  }
}
</script>
