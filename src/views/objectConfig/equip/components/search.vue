<template>
  <div>
    <a-form :form="form" layout="inline">
      <a-form-item label="类型" v-show="show">
        <a-select
          style="width: 200px"
          @change="handleChange"
          placeholder="请选择类型"
          v-decorator="['actType', { initialValue: formData.actType }]"
        >
          <a-select-option value="">
            全部
          </a-select-option>
          <!-- <a-select-option value="移动监测仪器">
            移动监测仪器
          </a-select-option>
          <a-select-option value="预埋设监测仪器">
            预埋设监测仪器
          </a-select-option>
          <a-select-option value="移动监测配件">
            移动监测配件
          </a-select-option>
          <a-select-option value="预埋设监测配件">
            预埋设监测配件
          </a-select-option> -->
          <a-select-option v-for="item in getTypeData" :key="item.key" :value="item.key">{{
            item.value
          }}</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="名称"
        ><a-input placeholder="请输入名称" v-decorator="['name', { initialValue: formData.name }]"></a-input
      ></a-form-item>

      <!-- <a-form-item label="更新时间"><a-range-picker show-time> </a-range-picker></a-form-item> -->
      <a-form-item label="时间">
        <a-date-picker
          placeholder="开始时间"
          format="YYYY-MM-DD"
          v-decorator="['startTime', { initialValue: formData.startTime }]"
          allow-clear
        />
        ~
        <a-date-picker
          placeholder="结束时间"
          format="YYYY-MM-DD"
          v-decorator="['endTime', { initialValue: formData.endTime }]"
          allow-clear
        />
      </a-form-item>
      <a-form-item><a-button @click="search" :loading="loading_but">查询</a-button></a-form-item>
    </a-form>
  </div>
</template>

<script>
import { editDateForSearch } from '@/utils/util'

export default {
  props: ['show', 'getTypeData'],
  data() {
    return {
      form: this.$form.createForm(this),
      formData: {
        name: '',
        startTime: null,
        endTime: null,
        actType: ''
      },
      loading_but: false
    }
  },
  methods: {
    search() {
      this.form.validateFields((err, values) => {
        if (!(values = editDateForSearch(values))) {
          this.$message.error('开始时间不能晚于结束时间！')
          return
        }
        this.$emit('search', editDateForSearch(values))
      })
    },
    handleChange(value) {
      console.log(`selected ${value}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
