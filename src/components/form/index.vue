<template>
  <a-form-model
    :layout="formLayout || 'horizontal'"
    ref="form"
    :model="formData"
    :label-col="labelCol || null"
    :wrapper-col="wrapperCol || null"
  >
    <a-form-model-item
      v-for="item in formItem"
      :key="item.name"
      :prop="item.name"
      :label="item.label"
      :rules="item.rules"
    >
      <!--Input-->
      <a-input
        v-if="item.type === 'input'"
        :placeholder="`${type_msg[item.type]}${item.label}`"
        :readOnly="item.readOnly"
        v-model="formData[item.name]"
      ></a-input>
      <a-textarea
        v-if="item.type === 'textarea'"
        :placeholder="`${type_msg[item.type]}${item.label}`"
        :rows="item.rows"
        :readOnly="item.readOnly"
        v-model="formData[item.name]"
      ></a-textarea>
      <a-checkbox-group
        v-if="item.type === 'checkbox'"
        :readOnly="item.readOnly"
        v-model="formData[item.name]"
        :options="item.options"
      >
      </a-checkbox-group>
      <a-radio-group
        v-if="item.type === 'radio'"
        v-model="formData[item.name]"
        :options="item.options"
        :readOnly="item.readOnly"
      >
      </a-radio-group>

      <a-select v-if="item.type === 'select'" v-model="formData[item.name]" :readOnly="item.readOnly">
        <a-select-option v-for="x in item.option" :key="x.value">
          {{ x.label }}
        </a-select-option>
      </a-select>
      <a-cascader
        v-if="item.type === 'cascader'"
        :options="item.options"
        :placeholder="`${type_msg[item.type]}${item.label}`"
        v-model="formData[item.name]"
        :display-render="displayRender"
        :readOnly="item.readOnly"
      />
      <div v-if="item.type === 'picker'">
        <a-date-picker
          :format="item.format"
          :placeholder="`${type_msg[item.type]}${item.startTimeLabel}`"
          v-model="formData[item.startTime]"
          :readOnly="item.readOnly"
        />
        ~
        <a-date-picker
          :format="item.format"
          :placeholder="`${type_msg[item.type]}${item.endTimeLabel}`"
          v-model="formData[item.endTime]"
          :readOnly="item.readOnly"
        />
      </div>
      <!-- {{item.options}} -->
    </a-form-model-item>

    <!--按钮-->
    <a-form-item :wrapper-col="formLayout == 'inline' ? {} : { span: 14, offset: 6 }">
      <a-button
        v-for="item in formHandler"
        :loading="item.loading"
        :key="item.key"
        :type="item.type"
        @click="item.handler && item.handler()"
        style="margin-right: 10px"
        >{{ item.label }}</a-button
      >
    </a-form-item>
  </a-form-model>
</template>

<script>
export default {
  // props: {
  //   formItem: {
  //     type: Array,
  //     default: () => []
  //   },
  //   //按钮
  //   formHandler: {
  //     type: Array,
  //     default: () => []
  //   },
  //   formData: {
  //     type: Object,
  //     default: () => {}
  //   },
  //   labelCol: {
  //     type: Object,
  //     default: () => {}
  //   },
  //   wrapperCol: {
  //     type: Object,
  //     default: () => {}
  //   },
  //   formLayout: {
  //     type: String,
  //     default: () => 'horizontal'
  //   }
  // },
  props: ['formItem', 'formHandler', 'formData', 'labelCol', 'wrapperCol', 'formLayout'],
  data() {
    return {
      //是否存在必填规则
      type_msg: {
        input: '请填写',
        select: '请选择',
        textarea: '请填写',
        picker: '请选择',
        cascader: '请选择',
        checkbox: '请选择'
      }
      // formLayout: 'horizontal'
    }
  },
  methods: {
    initFormData() {
      this.formItem.forEach(item => {
        //rules规则
        if (item.required) {
          this.rules(item)
        }
        //自定义规则
        if (item.validator) {
          item.rules = item.validator
        }
      })
    },
    rules(item) {
      const requestRules = [
        {
          required: true,
          message: `${this.type_msg[item.type]}${item.label}`,
          trigger: 'change'
        }
      ]
      //其他的rules的规则
      if (item.rules && item.rules.length > 0) {
        item.rules = requestRules.concat(item.rules)
      } else {
        item.rules = requestRules
      }
      console.log(item.rules)
    },
    displayRender({ labels }) {
      return labels.join('.')
    }
  },
  watch: {
    formItem: {
      handler(newValue) {
        console.log('newValue', newValue)
        this.initFormData()
      },
      immediate: true,
      deep: true
    },
    formHandler: {
      handler(newValue) {
        console.log(newValue, 'newValue')
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style></style>
