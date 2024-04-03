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
        <a-form-item v-show='false' label="主键ID">
          <a-input v-decorator="['id', { initialValue: 0 }]" disabled />
        </a-form-item>
        <a-form-item label="调整前课时">
          <a-input-number style="width: 100%" disabled v-decorator="['lessonNumber', {rules: []}]"  :min="-40" :max="40"  />
        </a-form-item>
        <a-form-item label="调整课时">
          <a-input-number  style="width: 100%" v-decorator="['numChange', {rules: []}]"  :min="-40" :max="40" @change="onNumChange" />
        </a-form-item>
        <a-form-item label="调整后课时">
          <a-input-number v-decorator="['newLessonNumber', {initialValue: model.lessonNumber}]"  style="width: 100%" disabled  />
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-decorator="['changeDescription', {rules: []}]" />
        </a-form-item>
        <a-form-item v-show="false" label="版本">
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
const fields = ['changeDescription', 'id', 'name', 'mobile', 'community','lessonNumber','numChange','version']

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
      newLessonNumber:0,
      numChange:0
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
  },
  methods:{
    onNumChange(num){
      this.form.setFieldsValue({"newLessonNumber":(this.model.lessonNumber||0) +num})
    }
  }
}
</script>
