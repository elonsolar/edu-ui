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

        <a-form-item v-show="false" label="id">
          <a-input v-decorator="['id']" />
        </a-form-item>

        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true,  message: '请输入名称！'}]}]" />
        </a-form-item>
        <a-form-item label="编码">
          <a-input v-decorator="['code', {rules: [{required: true,  message: '请输入编码！'}]}]" />
        </a-form-item>
        <a-form-item label="类别">
          <a-select
          v-decorator="['category', {rules: [{required: true,  message: '请选择类别！'}]}]"
          style="width: 100%"
          placeholder="请选择类别"
          @change="handleRoleChange"
          >
            <a-select-option v-for="(item) in categoryList" :name="item.label" :key="item.value">
                {{ item.label }}
              </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="规格">
          <a-input v-decorator="['specifications', {rules: [{required: false,  message: '请输入规格！'}]}]" />
        </a-form-item>
        <a-form-item label="单价">
          <a-input-number style="width: 100%"  v-decorator="['price', {rules: [{required: true , message: '请输入单价！'}]}]"  :min="0" :step="0.1" :max="99999"  />
        </a-form-item>
        <a-form-item label="库存">
          <a-input-number style="width: 100%"  v-decorator="['quantity', {rules: [{required: true}]}]"  :min="0" :max="99999"  />
        </a-form-item>
        <a-form-item label="单位">
          <a-input v-decorator="['unit', {rules: [{required: true}]}]"   />
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
import pick from 'lodash.pick'
// 表单字段
const fields = ['description', 'id', 'code', 'name', 'category','price', 'quantity','unit','specifications', 'version']

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
      categoryList:[
        {"value":20071,"label":"课时"},
        {"value":20072,"label":"教材"},
        {"value":20073,"label":"其他"},
      ]
    }
  },
  created () {

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })

  },
  methods:{
  
    submit(){
      this.$emit('ok')
    }


  }
}
</script>
