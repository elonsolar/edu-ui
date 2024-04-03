<template>
  <a-modal
    :title="title"
    :width="840"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="cancel"
  >
    <a-spin :spinning="loading">
        <a-form-model
         ref="form"
        :model="form"
        :rules="rules"
        layout='vertical'
        >
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-model-item label="原密码" prop="name">
              <a-input style="width: 100%" v-model="form.oldPassword" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="新密码" prop="description">
              <a-textarea style="width: 100%" auto-size v-model="form.newPassword" />
            </a-form-model-item> 
        </a-col>
      </a-row>
     
    </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable */ 
import md5 from 'md5'
import {  changePassword  } from '@/api/manage'


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
      form: {
        "id":undefined,
        "oldPassword":undefined,
        "newPassword":undefined
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'change' },
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'change' },
        ]
      }
    }
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && (this.initForm())
    })
  },
  methods:{
    initForm(){
      this.form={...this.model}
    },
    resetForm(){
      this.form={
        "id":undefined,
        "oldPassword":undefined,
        "newPassword":undefined,
      }
    },
    
    submit(){
      let that =this
      this.confirmLoading = true

      this.$refs.form.validate(valid => {
        if (valid) {
            // 修改 e.g.
            changePassword({"id":that.form.id,"oldPassword":that.form.oldPassword,"newPassword":that.form.newPassword} ).then(res => {
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('修改成功')
              this.$emit('ok') 
            })
        } else {
            that.confirmLoading = false
        }
      })

    },
    cancel(){
        this.resetForm()
        this.$emit('cancel') 
    }
  }
}
</script>