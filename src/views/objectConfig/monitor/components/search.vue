<template>
  <div>
    <a-form :form="form" layout="inline">
      <a-form-item label="场景">
        <a-select
          default-value="全部"
          style="width: 120px"
          @change="handleChange"
          v-decorator="['sceneId', { initialValue: formData.sceneId }]"
        >
          <a-select-option value=""> 全部 </a-select-option>
          <a-select-option v-for="item in sceneOption" :key="item.key" :value="item.key">
            {{ item.value }}
          </a-select-option>
          <!-- <a-select-option value="html"> 建筑基坑监测 </a-select-option>
          <a-select-option value="jpg"> 边坡监测 </a-select-option> -->
        </a-select>
      </a-form-item>
      <a-form-item label="名称"
        ><a-input placeholder="请输入名称" v-decorator="['name', { initialValue: formData.name }]"></a-input
      ></a-form-item>
      <!-- <a-form-item label="更新时间"
        ><a-range-picker show-time v-decorator="['updateTime', { initialValue: formData.updateTime }]"> </a-range-picker
      ></a-form-item> -->
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
  props: ['sceneOption'],
  data() {
    return {
      form: this.$form.createForm(this),
      formData: {
        sceneId: '',
        name: '',
        startTime: null,
        endTime: null
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
      // console.log(`selected ${value}`)
    }
  }
}
</script>

<style lang="scss" scoped></style>
