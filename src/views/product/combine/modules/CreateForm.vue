<template>
    <a-modal
    :title="title"
    :width="850"
    :visible="visible"
    :confirmLoading="loading"
    @ok="submit"
    @cancel="() => { $emit('cancel')}">
    <a-card class="card" title="基本信息" :bordered="false">
      <a-form-model :model="form" class="form" :rules="rules">
      <a-row class="form-row" :gutter="16">
        <a-col span="12">
        <a-form-model-item label="名称" prop="name">
          <a-input v-model="form.name" placeholder="请输入套餐名称" />
        </a-form-model-item>
        </a-col>
      <a-col span="12">
        <a-form-model-item label="编码" prop="code">
          <a-input v-model="form.code" placeholder="请输入套餐编码" />
        </a-form-model-item>
      </a-col>
      </a-row>
      <a-row class="form-row" :gutter="16">
        <a-col span="12">
        <a-form-model-item label="价格" prop="price">
          <a-input-number
          v-model="form.price"
          placeholder="请输入价格"
          :min="0"
          :step="0.1"
          :max="99999"
          style="width: 100%;"
          />
        </a-form-model-item>
      </a-col>
      <a-col span="12">
        <a-form-model-item label="备注" prop="description">
          <a-input v-model="form.description" placeholder="请输入套餐备注" />
        </a-form-model-item>
      </a-col>
    </a-row>
      </a-form-model>
    </a-card>
    <!-- table -->
    <a-card title="单品明细">
      <a-table
        :columns="columns"
        :dataSource="data"
        key="key"
        :pagination="false"
        :loading="memberLoading"
      >
      <template  slot="skuName" slot-scope="text, record,index">
        <a-select
           v-if="record.editable"
           show-search
           placeholder="输入单品名称"
           :default-active-first-option="false"
           :show-arrow="false"
           :value="record.skuId"
           style="width: 100%;"
           :filter-option="false"
           :not-found-content="null"
           @search="handleSkuSearch"
           @change="(k,n)=>handleSkuChange(k,n,index)"
          >
            <a-select-option v-for="d in skuList" :key="d.id" :price="d.price" :code="d.code" :name="d.name">
            {{ d.name }}
            </a-select-option>
          </a-select>
        <span v-else>
          {{ record.skuName }}
        </span>
      </template>
        <template v-for="(col, i) in [ 'skuCode', 'skuPrice']" :slot="col" slot-scope="text, record">
            <a-input
            :key="col"
            v-if="record.editable"
            style="margin: -5px 0"
            :value="text"
            :placeholder="columns[i].title"
            disabled
          />
          <template v-else>{{ text }}</template>
        </template>
        <template  slot="skuQuantity" slot-scope="text, record">
          <a-input-number
          key="skuQuantity"
          v-if="record.editable"
          style="margin: -5px 0"
          :value="text"
          :min="0"
          :max="99999"
          @change="e => handleChange(e, record.key, 'skuQuantity')"
        />
        <template v-else>{{ text }}</template>
      </template>

        <template slot="operation" slot-scope="text, record,index">
          <template v-if="record.editable">
            <span v-if="record.isNew">
              <a @click="saveRow(record)">添加</a>
              <a-divider type="vertical" />
              <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key,record)">
                <a>删除</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a @click="saveRow(record)">保存</a>
            </span>
          </template>
          <span v-else>
            <a @click="toggle(record.key,index)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm title="是否要删除此行？" @confirm="remove(record.key,record)">
              <a>删除</a>
            </a-popconfirm>
          </span>
        </template>
      </a-table>
      <a-button style="width: 100%; margin-top: 16px; margin-bottom: 8px" type="dashed" icon="plus" @click="newMember">新增单品</a-button>
    </a-card>
    </a-modal>
</template>

<script>
/* eslint-disable */
import { v4 as uuidv4 } from 'uuid'
import { createCombineSku,updateCombineSku,deleteCombineSkuItem,  listCombineSkuItem, listSku } from '@/api/product'
// import RepositoryForm from './RepositoryForm'
import FooterToolBar from '@/components/FooterToolbar'
import { baseMixin } from '@/store/app-mixin'

const fieldLabels = {
  name: '仓库名',
  url: '仓库域名',
  owner: '仓库管理员',
  approver: '审批人',
  dateRange: '生效日期',
  type: '仓库类型',
  name2: '任务名',
  url2: '任务描述',
  owner2: '执行人',
  approver2: '责任人',
  dateRange2: '生效日期',
  type2: '任务类型'
}

export default {
  name: 'AdvancedForm',
  props: {
    visible: {
      type: Boolean,
      required: true
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
  mixins: [baseMixin],
  components: {
    FooterToolBar,
    // RepositoryForm
  },
  data () {
    return {
      loading:false,
      memberLoading: false,
      rules: {
         name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
        ],
         code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
        ],
         price: [
          { required: true, message: '请输入价格', trigger: 'blur' },
        ],
      },
      form: {
        "id":undefined,
        "code":undefined,
        "price":undefined,
        "description":undefined
      },
      // table
      columns: [
        {
          title: '单品名称',
          dataIndex: 'skuName',
          key: 'skuName',
          width: '20%',
          scopedSlots: { customRender: 'skuName' }
        },
        {
          title: '单品编码',
          dataIndex: 'skuCode',
          key: 'skuCode',
          width: '20%',
          scopedSlots: { customRender: 'skuCode' }
        },
        {
          title: '单品单价',
          dataIndex: 'skuPrice',
          key: 'skuPrice',
          width: '20%',
          scopedSlots: { customRender: 'skuPrice' }
        },
        {
          title: '数量',
          dataIndex: 'skuQuantity',
          key: 'skuQuantity',
          width: '20%',
          scopedSlots: { customRender: 'skuQuantity' }
        },
        {
          title: '操作',
          key: 'action',
          scopedSlots: { customRender: 'operation' }
        }
      ],
      data: [],
      skuList:[],
      errors: []
    }
  },
  created () {
    // 当 model 发生改变时，为表单设置值
    this.$watch('model', () => {
      this.model && (this.init())
    })
  },
  methods: {
    init(){
      this.form={...this.model}

      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [
            { 'column': 'combine_id', 'value': this.model.id, 'op': '=' },
          ]
        }
        const newObj = { "pageSize":999,"pageNo":1, 'expr': JSON.stringify(expr) }
        listCombineSkuItem(newObj).then(res => {
          this.data=res.data.map(ele=>{return {...ele,"key":ele.id}})
        })

        this.handleSkuSearch()

    },
    handleSubmit (e) {
      e.preventDefault()
    },
    newMember () {
      this.data.push({
        key: uuidv4(),
        skuName: '',
        skuCode: '1',
        skuPrice: 0,
        editable: true,
        isNew: true
      })
    },
    remove (key,record) {
      const newData = this.data.filter(item => item.key !== key)
      this.data = newData
      if(record.id>0){
        deleteCombineSkuItem(record.id).then(res=>{
          this.$message.info('删除成功')
        })
      }
    },
    saveRow (record) {
      this.memberLoading = true
      const { key, skuName, skuQuantity} = record
      if (!skuName || !skuQuantity ) {
        this.memberLoading = false
        this.$message.error('请填写完整单品信息。')
        return
      }
      const target = this.data.find(item => item.key === key)
        target.editable = false
        target.isNew = false
        this.memberLoading = false
      // // 模拟网络请求、卡顿 800ms
      // new Promise((resolve) => {
      //   setTimeout(() => {
      //     resolve({ loop: false })
      //   }, 800)
      // }).then(() => {
      //   const target = this.data.find(item => item.key === key)
      //   target.editable = false
      //   target.isNew = false
      //   this.memberLoading = false
      // })
    },
    toggle (key,index) {
      const target = this.data.find(item => item.key === key)
      target._originalData = { ...target }
      // target.editable = !target.editable
       target.editable = true
      this.data.splice(index,1,target)
    },
    getRowByKey (key, newData) {
      const data = this.data
      return (newData || data).find(item => item.key === key)
    },
    cancel (key) {
      const target = this.data.find(item => item.key === key)
      Object.keys(target).forEach(key => { target[key] = target._originalData[key] })
      target._originalData = undefined
    },
    handleChange (value, key, column) {
      const newData = [...this.data]
      const target = newData.find(item => key === item.key)
      if (target) {
        target[column] = value
        this.data = newData
      }
    },

    // 最终全页面提交
    validate () {
      const { $refs: { repository, task }, $notification } = this
      const repositoryForm = new Promise((resolve, reject) => {
        repository.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })
      const taskForm = new Promise((resolve, reject) => {
        task.form.validateFields((err, values) => {
          if (err) {
            reject(err)
            return
          }
          resolve(values)
        })
      })

      // clean this.errors
      this.errors = []
      Promise.all([repositoryForm, taskForm]).then(values => {
        $notification['error']({
          message: 'Received values of form:',
          description: JSON.stringify(values)
        })
      }).catch(() => {
        const errors = Object.assign({}, repository.form.getFieldsError(), task.form.getFieldsError())
        const tmp = { ...errors }
        this.errorList(tmp)
      })
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return
      }
      this.errors = Object.keys(errors)
        .filter(key => errors[key])
        .map(key => ({
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }))
    },
    scrollToField (fieldKey) {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`)
      if (labelNode) {
        labelNode.scrollIntoView(true)
      }
    },
    handleSkuSearch(value){
      let that =this
      var expr = {
          'op': 'and',
          'isLogic': true,
          'subExpr': [{
            'column': 'name',
            'value': value || null,
            'op': 'like'
          },{
            'column': 'status',
            'value':[20081] ,
            'op': 'in'
          }
        ]
        }
      const newObj = { pageSize:999, 'expr': JSON.stringify(expr) }
      console.log('loadData request parameters:', newObj) 
      listSku(newObj).then(res=>{
        that.skuList = res.data
      })
    },
    handleSkuChange(k,n,index){
      // this.value = value;
      // this.queryParam.planId=node.key
      this.data[index].skuId=k
      this.data[index].skuCode=n.data.attrs.code
      this.data[index].skuPrice=n.data.attrs.price
      this.data[index].skuName=n.data.attrs.name
    },
    submit(){
      let that=this
      debugger
      if (this.form.id>0){
        updateCombineSku(this.form.id, {...this.form,"itemList":this.data}).then(res=>{
          that.$emit("ok")
        })
      }else{
        createCombineSku({...this.form,"itemList":this.data}).then(res=>{
          that.$emit("ok")
        })
      }
    }
    
  }
}
</script>

<style lang="less" scoped>
  .card{
    margin-bottom: 24px;
  }
  .popover-wrapper {
    :deep(.antd-pro-pages-forms-style-errorPopover .ant-popover-inner-content) {
      min-width: 256px;
      max-height: 290px;
      padding: 0;
      overflow: auto;
    }
  }
  .antd-pro-pages-forms-style-errorIcon {
    user-select: none;
    margin-right: 24px;
    color: #f5222d;
    cursor: pointer;
    i {
          margin-right: 4px;
    }
  }
  .antd-pro-pages-forms-style-errorListItem {
    padding: 8px 16px;
    list-style: none;
    border-bottom: 1px solid #e8e8e8;
    cursor: pointer;
    transition: all .3s;

    &:hover {
      background: #e6f7ff;
    }
    .antd-pro-pages-forms-style-errorIcon {
      float: left;
      margin-top: 4px;
      margin-right: 12px;
      padding-bottom: 22px;
      color: #f5222d;
    }
    .antd-pro-pages-forms-style-errorField {
      margin-top: 2px;
      color: rgba(0,0,0,.45);
      font-size: 12px;
    }
  }
</style>
