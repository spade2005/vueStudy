<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {NForm, NFormItem, NInput, NButton, NRadioButton, NRadioGroup, NSelect, useMessage,
  NCard, NTabs, NTabPane} from 'naive-ui'
import userApi from "@/api/user.js"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, NRadioButton, NRadioGroup, NSelect,
    NCard, NTabs, NTabPane,
    useMessage, reactive
  },
  setup() {
    const message = useMessage()
    const formRef = ref(null);
    const router = useRouter()
    const roleList = ref([])
    const model = reactive({
      username: '',
      phone: '',
      email: '',
      nickname: '',
      role_id: '',
      status: '0',
      oldpass: '',
      newpass: '',
      newpass_repeat: '',
    });


    onMounted(async () => {
      message.loading("load data...")
      userApi.currentUser().then(function (resp){
        message.destroyAll()
        console.log(resp.data,'===');
        // if (resp.data.code === 0) {
          let data=resp.data.data;
          console.log(data,"+==")
          model.username=data.username
          model.nickname=data.nick_name
          model.role_id=data.role_id
          model.status=data.status
        // }
      })
    })

    return {
      formRef,
      model,
      rules: {
        password: {
          required: false,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {

            } else if (value.length < 4 || value.length > 100) {
              return new Error('密码长度不合法')
            }
            return true
          },
        },
      },
      generalOptions: roleList,
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.loading('正在提交...', {duration: 5000})
            userApi.updatePassword({}).then(function (resp) {
              message.destroyAll()
              if (resp.data.code == 1) {
                message.error('update error:' + resp.data.message)
                return
              }
              message.success('update success!wait for jump..')

              setTimeout(function () {
                message.destroyAll()
                router.push({path: "/user/list"})
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
  <div class="create-box">

    <n-card title="个人信息" style="margin-bottom: 16px">
      <n-tabs type="line" animated default-value="userInfo"
      >
        <n-tab-pane name="userInfo" tab="我的资料">
          <n-form ref="formRef"
              label-placement="left" label-width="auto" require-mark-placement="right-hanging"
          >
          <n-form-item label="账号：" path="username" >
            {{model.username}}
          </n-form-item>
          <n-form-item label="手机：" path="phone">
            {{model.phone}}
          </n-form-item>
          <n-form-item label="email：" path="email">
            {{model.email}}
          </n-form-item>
          <n-form-item label="昵称：" path="nickname">
            {{model.nickname}}
          </n-form-item>
          <n-form-item label="角色：" path="role_id">
            {{model.role_id}}
          </n-form-item>
          <n-form-item label="状态：" path="status">
            <n-radio-group v-model:value="model.status" name="status" disabled>
              <n-radio-button value="0">
                启用
              </n-radio-button>
              <n-radio-button value="1">
                禁用
              </n-radio-button>
            </n-radio-group>
          </n-form-item>
          </n-form>
        </n-tab-pane>
        <n-tab-pane name="userPass" tab="更改密码">
          <n-form
              ref="formRef" :model="model" :rules="rules"
              label-placement="left" label-width="auto" require-mark-placement="right-hanging"
              :style="{
      maxWidth: '640px'
    }"
          >
            <n-form-item label="旧密码" path="password">
              <n-input type="password" v-model:value="model.oldpass" placeholder="请输入旧密码"/>
            </n-form-item>

            <n-form-item label="新密码" path="password">
              <n-input type="password" v-model:value="model.newpass" placeholder="请输入新密码"/>
            </n-form-item>
            <n-form-item label="确认密码" path="password">
              <n-input type="password" v-model:value="model.newpass_repeat" placeholder="请输入确认密码"/>
            </n-form-item>

            <n-form-item>
              <div style="margin-left: 3rem">
                <n-button round type="primary" @click="handleValidateClick">
                  更新密码
                </n-button>
              </div>
            </n-form-item>
          </n-form>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<style scoped>
</style>
