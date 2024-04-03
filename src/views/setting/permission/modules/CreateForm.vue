<template>
  <a-modal
    :title="title"
    :width="640"
    :visible="visible"
    :confirmLoading="loading"
    @ok="() => { $emit('ok') }"
    @cancel="() => { $emit('cancel') }"
  >
    <a-spin :spinning="loading">
      <a-form :form="form" v-bind="formLayout">
        <!-- 检查是否有 id 并且大于0，大于0是修改。其他是新增，新增不显示主键ID -->
          <a-form-item  v-show="false" label="id">
          <a-input v-decorator="['id']" />
        </a-form-item>
          <a-form-item  v-show="false" label="parentId">
          <a-input v-decorator="['parentId']" />
        </a-form-item>
        <a-form-item label="编码">
          <a-input v-decorator="['code', {rules: [{required: true,  message: '请输入编码！'}]}]" />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true,  message: '请输入名称！'}]}]" />
        </a-form-item>
        <a-form-item label="类型">
          <a-select
          v-decorator="['permissionType']"
          disabled
          :default-value="[]"
          style="width: 100%"
          placeholder="请选择科目"
          >
           <a-select-option v-for="(item) in permissionTypeList" :key="item.key">
              {{ item.name }}
            </a-select-option>
         </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable */ 
import pick from 'lodash.pick'
import { getPermission } from '@/api/permission'
// 表单字段
const fields = [ 'id', 'code', 'name', 'permissionType','parentId']

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
      permissionTypeList: [
        {"key":40011,"name":"菜单"},
        {"key":40012,"name":"按钮"}
      ]
    }
  },
  created () {

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
      this.model && this.model.id>0 && this.getPermissionById()
    })
  },
  methods:{
    getPermissionById(){
      let that = this
      getPermission(this.model.id).then(res=>{
        that.form.setFieldsValue(pick(res, fields))
      })

    },
    handleChange(){


    }


  }
}
</script>
