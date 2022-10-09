<script>
import {defineComponent, ref, reactive} from "vue";
import {NForm, NFormItem, NInput, NButton, useMessage, NMessageProvider} from 'naive-ui'
import userAPi from "@/api/user.js"
import {useTokenStore} from "@/stores/useTokenStore"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, useMessage, NMessageProvider, reactive
  },
  setup() {
    const message = useMessage()
    const formRef = ref(null);
    const model = reactive({
      username: 'test4',
      userpass: 'test4',
    });

    const router = useRouter()
    const tokener = useTokenStore()

    return {
      formRef,
      model,
      rules: {
        username: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {
              return new Error('请输入 账号')
            } else if (value.length < 4 || value.length > 20) {
              return new Error('账号格式不合法')
            }
            return true
          },
        },
        userpass: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {
              return new Error('请输入 密码')
            } else if (value.length < 4 || value.length > 20) {
              return new Error('密码格式不合法')
            }
            return true
          },
        },
      },
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.loading('正在提交...', {duration: 5000})
            userAPi.login(model).then(function (resp) {
              message.destroyAll()
              if (resp.data.code == 1 || resp.data['token'] == undefined) {
                message.error('login error:' + resp.data.message)
                return
              }
              console.log(resp.data, "xxx")
              tokener.setToken(resp.data.token)
              message.success('login success!wait for jump..')

              setTimeout(function () {
                message.destroyAll()
                let path = router.currentRoute.value.query.redirect ?? '/welcome'
                router.push({path: path})
              }, 1500);

            }).catch(function (err) {
              console.log(err)
            })
          } else {

          }
        }).catch((er) => {
        })
      }
    }
  }
})
</script>

<template>
  <div class="login-box">
    <n-form
        ref="formRef" :model="model" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging"
        :style="{
      maxWidth: '640px'
    }"
    >
      <h3>please login</h3>
      <n-form-item label="账号" path="username">
        <n-input v-model:value="model.username" placeholder="请输入账号"/>
      </n-form-item>
      <n-form-item path="userpass" label="密码">
        <n-input v-model:value="model.userpass" type="password" placeholder="请输入密码"/>
      </n-form-item>
      <n-form-item>
        <div style="margin-left: 3rem">
          <n-button round type="primary" @click="handleValidateClick">
            登录
          </n-button>
        </div>
      </n-form-item>
    </n-form>
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