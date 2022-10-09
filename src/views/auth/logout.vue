<script>
import {defineComponent} from "vue";
import userAPi from "@/api/user.js"
import {useTokenStore} from "@/stores/useTokenStore"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {},
  setup() {
    const router =useRouter()
    const tokener = useTokenStore()
    userAPi.logout().then(function (resp) {
      console.log(resp.data)
    }).catch(function (err) {
      console.log(err)
    }).finally(function (f) {
      tokener.setToken('')
      setTimeout(function (){
        router.push({path:"/login"})
      },1500);
    })
  }
})
</script>

<template>
  <div class="login-box">
    <h3>您已退出系统！</h3>
  </div>
</template>

<style scoped>
.login-box {
  width: 700px;
  margin: 10rem auto;
  border: 1px solid #E1E1E1;
  padding: 2rem;
}
</style>