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
         ref="planForm"
        :model="form"
        :rules="rules"
        layout='vertical'
        >
        <a-row :gutter="16">
          <a-col span="12">
            <a-form-model-item label="名称" prop="name">
              <a-input style="width: 100%" v-model="form.name" />
            </a-form-model-item>
          </a-col>
          <a-col span="12">
            <a-form-model-item label="周期类型" prop="cycleType">
              <a-select style="width: 100%" v-model="form.cycleType" >
                  <a-select-option :value="0">日</a-select-option>
                  <a-select-option :value="1">周</a-select-option>
              </a-select>
            </a-form-model-item>
        </a-col>
      </a-row>
      <a-row :gutter="16">
          <a-col span="24">
            <a-form-model-item label="描述" prop="description">
              <a-textarea style="width: 100%" auto-size v-model="form.description" />
            </a-form-model-item>
          </a-col>
      </a-row>
      <a-divider>选择排课的日期范围</a-divider>
      <a-row :gutter="16">
          <a-col span="24">
            <a-form-model-item label="上课日期" prop="courseTime">
              <a-range-picker style="width: 100%"  v-model="form.courseTime"  @change="onCourseTimeChange" />
            </a-form-model-item>
          </a-col>
      </a-row>
      <a-divider>过滤掉不需要上课的日期</a-divider>
      <a-card>
      <a-table
        :columns="excludeRulecolumns"
        :dataSource="excludeRuleData"
        :pagination="false"
        key="key"
      >
        <span slot="excludeType" slot-scope="text,record">
              <a-select :value="text" style="width: 100%"  @change="e => handleExcludeRuleChange(e, record.key, 'excludeType')">
                  <a-select-option :value=30011>每周</a-select-option>
                  <a-select-option :value=30012>时间段</a-select-option>
              </a-select>
        </span>

        <span slot="excludeDate" slot-scope="text,record">
              <template v-if="record.excludeType==30012">
                 <a-range-picker style="width: 100%" :value="text"   @change="handleExcludeRuleChange($event,record.key,'excludeDate')" />
              </template>
              <template v-else>
                <a-select style="width: 100%" :value="text" mode="multiple"  @change="e => handleExcludeRuleChange(e, record.key, 'excludeDate')">
                  <a-select-option value="周一">周一</a-select-option>
                  <a-select-option value="周二">周二</a-select-option>
                  <a-select-option value="周三">周三</a-select-option>
                  <a-select-option value="周四">周四</a-select-option>
                  <a-select-option value="周五">周五</a-select-option>
                  <a-select-option value="周六">周六</a-select-option>
                  <a-select-option value="周日">周日</a-select-option>
              </a-select>
              </template>
        </span>

        <template slot="operation" slot-scope="text, record">
          <span >
            <a-popconfirm title="是否要删除此行？" @confirm="deleteExcludeRule(record.key)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newExcludeRule">新增规则</a-button>
    </a-card>
    </a-form-model>
    </a-spin>
  </a-modal>
</template>

<script>
/* eslint-disable */ 
import pick from 'lodash.pick'
import Moment from 'moment'
import {  createCoursePlan, updateCoursePlan } from '@/api/coursePlan'

import { filterEmpty } from '@/components/_util/util'
// 表单字段

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
        "name":undefined,
        "description":undefined,
        "startTime":undefined,
        "endTime":undefined,
        "excludeRule":undefined,
      },
      rules: {
        name: [
          { required: true, message: '请输入计划名称', trigger: 'blur' },
        ],
        courseTime: [
          { required: true, message: '请选择上课日期', trigger: 'change' },
        ],
      },
      confirmLoading: false,
      excludeRulecolumns:[
      {
          title: '排除类型',
          dataIndex: 'excludeType',
          key: 'excludeType',
          width: '40%',
          scopedSlots: { customRender: 'excludeType' }
        },
        {
          title: '日期',
          dataIndex: 'excludeDate',
          key: 'excludeDate',
          width: '40%',
          scopedSlots: { customRender: 'excludeDate' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      excludeRuleData:[],
      subjectTimeTableColumn:[
        {
          title: '科目',
          dataIndex: 'subjectId',
          key: 'subjectId',
          width: '40%',
          scopedSlots: { customRender: 'subjectId' }
        },
        {
          title: '年级',
          dataIndex: 'gradeId',
          key: 'gradeId',
          width: '40%',
          scopedSlots: { customRender: 'gradeId' }
        },
        {
          title: '人数',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: '40%',
          scopedSlots: { customRender: 'studentNum' }
        },
        {
          title: '课程时间',
          dataIndex: 'studentNum',
          key: 'studentNum',
          width: '40%',
          scopedSlots: { customRender: 'studentNum' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ]

    }
  },
  beforeCreate() {
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && (this.initForm())
      this.model && this.setExcudeRule(this.model)
    })
  },
  methods:{

    initForm(){
      this.form={...this.model,
        "courseTime":[this.model.startTime,this.model.endTime],
      }
    },
    resetForm(){
      this.form={
        "id":undefined,
        "name":undefined,
        "description":undefined,
        "startTime":undefined,
        "endTime":undefined,
        "excludeRule":undefined, 
        "version":undefined
      }
    },
    onCourseTimeChange(v,str){
      this.form.startTime=str[0]
      this.form.endTime=str[1]
    },
    setExcudeRule(model){
      let oldExcludRule =this.form.excludeRule||[]
      for (let i=0;i<oldExcludRule.length;i++){
        this.excludeRuleData.push({"key":i,...oldExcludRule[i]})
      }
    },
    newExcludeRule () {
      this.excludeRuleData.push({
        key:this.excludeRuleData.length,
        excludeType:30012 ,
        excludeDate:[],
      })
    },
    handleExcludeRuleChange(value, key, column) {
      const newData = [...this.excludeRuleData];
      const target = newData.find(item => key == item.key)
      if (target) {
        if (column=="excludeDate"){
          if (value[0] instanceof Moment){
              target[column]=[value[0].format('YYYY-MM-DD'),value[1].format('YYYY-MM-DD')]
            }else{
             target[column] = value;
            }
        }else{

            target[column] = value;
        }
        this.excludeRuleData=newData
      }
    },
    deleteExcludeRule(key){
     this.excludeRuleData.splice(key,1)
    },
    submit(){
      let that =this
      this.confirmLoading = true

      let excludeRule = this.excludeRuleData.filter(rule=>rule.excludeDate&&rule.excludeDate.length>0)
      that.form["excludeRule"]=excludeRule

      this.$refs.planForm.validate(valid => {
        if (valid) {
          if (that.form.id) {
            // 修改 e.g.
            updateCoursePlan(that.form.id, that.form).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('修改成功')
              this.$emit('ok') 
            })
          } else {
            // 新增
            createCoursePlan(that.form).then(res => {
              this.visible = false
              this.confirmLoading = false
              // 重置表单数据
              that.resetForm()
              this.$message.info('新增成功')
              this.$emit('ok') 
            })
          }
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