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
        <a-form-item v-show="false" label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="名称">
          <a-input v-decorator="['name', {rules: [{required: true,  message: '请输入姓名！'}]}]" />
        </a-form-item>
        <a-form-item label="类别">
           <a-select
              v-decorator="['category']"
              :default-value="[]"
              style="width: 100%"
              placeholder="请选择类别"
            @change="handleChange"
              >
              <a-select-option v-for="(item) in categoryList" :key="item.value">
                  {{ item.name }}
                </a-select-option>
            </a-select>
          <!-- <a-input v-decorator="['kind', {rules: [{required: true,  message: '请选择类型！'}]}]" /> -->
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
const fields = ['description', 'id', 'name', 'code', 'category', 'version']

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
      categoryList: [{"value":10021,"name":"绘画"},{"value":10022,"name":"书法"}]
    }
  },
  created () {
    console.log('custom modal created')

    // 防止表单未注册
    fields.forEach(v => this.form.getFieldDecorator(v))

    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && this.form.setFieldsValue(pick(this.model, fields))
    })
  }
}
</script>
