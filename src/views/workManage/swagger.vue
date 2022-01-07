<template>
  <iframe  :id="id" :src="url" frameborder="0" width="100%" height="800px" scrolling="auto" style="background-color: #fff;"></iframe>
</template>

<script>
export default {
  name: "swagger.vue",
  data () {
    return {
      url: "http://fzzt.fzjhdn.com:18050/swagger-ui.html?urls.primaryName=%E5%BC%80%E5%8F%91%E8%80%85web%E6%9C%8D%E5%8A%A1#/%E5%BC%80%E5%85%B3%E8%80%85web%E8%B5%84%E6%BA%90%E7%AE%A1%E7%90%86/addImgUsingPOST"
    }
  },
}
</script>

<style scoped>

</style>