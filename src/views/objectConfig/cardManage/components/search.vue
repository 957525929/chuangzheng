<template>
  <div>
    <a-form :form="form" layout="inline">
      <a-form-item label="所属类型">
        {{ sourceData.type | type }}
      </a-form-item>
      <a-form-item label="对象名称">
        {{ sourceData.name }}
      </a-form-item>
    </a-form>
    <a-form :form="form" layout="inline">
      <a-form-item label="知识名称"
        ><a-input placeholder="请输入知识名称" v-decorator="['name', { initialValue: formData.name }]"></a-input
      ></a-form-item>
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
  props: ['sourceData'],
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
  filters: {
    type(type) {
      var name = '场景'
      switch (type) {
        case 2:
          name = '测项'
          break
        case 3:
          name = '监测方法'
          break
        case 4:
          name = '活动'
          break
        case 5:
          name = '仪器'
          break
      }
      return name
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
