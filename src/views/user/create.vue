<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {NForm, NFormItem, NInput, NButton,NRadioButton, NRadioGroup, NSelect, useMessage} from 'naive-ui'
import userApi from "@/api/user.js"
import roleApi from "@/api/role.js"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton,NRadioButton, NRadioGroup, NSelect, useMessage, reactive
  },
  setup() {
    const message = useMessage()
    const formRef = ref(null);
    const model = reactive({
      username: '',
      userpass: '',
      phone: '',
      email: '',
      nickname: '',
      role_id: '',
      status: '0',
    });
    const router =useRouter()
    const roleList = ref([])
    onMounted(() => {
      roleApi.list({length:100}).then(function (resp) {
        if (resp.data.code === 0) {
          let data = []
          let rootList = resp.data.data.list
          for (let r in rootList) {
            data.push({label: rootList[r]['name'], value: rootList[r]['id']})
          }
          roleList.value = data
        }
      })
    })

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
            } else if (value.length < 4 || value.length > 100) {
              return new Error('账号长度不合法')
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
            } else if (value.length < 4 || value.length > 100) {
              return new Error('密码长度不合法')
            }
            return true
          },
        },
        email: {
          required: true,
          trigger: ["blur", "input"],
          message: '请输入email',
        },
        nickname: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {
              return new Error('请输入 昵称')
            } else if (value.length < 1 || value.length > 50) {
              return new Error('昵称长度不合法')
            }
            return true
          },
        },
        role_id: {
          required: true,
          trigger: ["blur", "input"],
          message: '请输入角色',
        },
        status: {
          required: true,
          trigger: ["blur", "input"],
          message: '请勾选状态',
        },
      },
      generalOptions:roleList,
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.loading('正在提交...', {duration: 5000})
            userApi.create(model).then(function (resp) {
              message.destroyAll()
              if (resp.data.code == 1) {
                message.error('create error:' + resp.data.message)
                return
              }
              message.success('create success!wait for jump..')

              setTimeout(function (){
                message.destroyAll()
                router.push({path:"/user/list"})
              },1500);

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
    <n-form
        ref="formRef" :model="model" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging"
        :style="{
      maxWidth: '640px'
    }"
    >
      <h1>创建管理员</h1>
      <n-form-item label="账号" path="username">
        <n-input v-model:value="model.username" placeholder="请输入账号"/>
      </n-form-item>
      <n-form-item label="密码" path="userpass">
        <n-input type="password" v-model:value="model.userpass" placeholder="请输入密码"/>
      </n-form-item>
      <n-form-item label="手机" path="phone">
        <n-input v-model:value="model.phone" placeholder="请输入手机"/>
      </n-form-item>
      <n-form-item label="email" path="email">
        <n-input v-model:value="model.email" type="email" placeholder="请输入email"/>
      </n-form-item>
      <n-form-item label="昵称" path="nickname">
        <n-input v-model:value="model.nickname" placeholder="请输入昵称"/>
      </n-form-item>
      <n-form-item label="角色" path="role_id">
        <n-select
            v-model:value="model.role_id"
            placeholder="Select"
            :options="generalOptions"
        />
      </n-form-item>
      <n-form-item label="状态" path="status">
        <n-radio-group v-model:value="model.status" name="status">
          <n-radio-button value="0">
            启用
          </n-radio-button>
          <n-radio-button value="1">
            禁用
          </n-radio-button>
        </n-radio-group>
      </n-form-item>

      <n-form-item>
        <div style="margin-left: 3rem">
          <n-button round type="primary" @click="handleValidateClick">
            提交
          </n-button>
        </div>
        <div style="margin-left: 1rem">
          <router-link to="/role/list">
            <n-button round type="primary" secondary>
              返回
            </n-button>
          </router-link>
        </div>
      </n-form-item>
    </n-form>
  </div>
</template>

<style scoped>

</style>
