<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {NForm, NFormItem, NInput, NButton, useMessage} from 'naive-ui'
import roleAPi from "@/api/role.js"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, useMessage, reactive
  },
  setup() {
    const message = useMessage()
    const formRef = ref(null);
    const router = useRouter()
    const model = reactive({
      name: '',
      mark: '',
      id: router.currentRoute.value.query.id,
    });

    onMounted(() => {
      roleAPi.one({"id": model.id}).then(function (resp) {
        if (resp.data.code === 0) {
          model.name = resp.data.data.name
          model.mark = resp.data.data.mark
        }
      })
    })

    return {
      formRef,
      model,
      rules: {
        name: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {
              return new Error('请输入 名称')
            } else if (value.length < 4 || value.length > 100) {
              return new Error('名称长度不合法')
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
            roleAPi.update(model).then(function (resp) {
              message.destroyAll()
              if (resp.data.code == 1) {
                message.error('update error:' + resp.data.message)
                return
              }
              message.success('update success!wait for jump..')

              setTimeout(function () {
                message.destroyAll()
                router.push({path: "/role/list"})
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
    <n-form
        ref="formRef" :model="model" :rules="rules"
        label-placement="left" label-width="auto" require-mark-placement="right-hanging"
        :style="{
      maxWidth: '640px'
    }"
    >
      <h1>更新角色信息</h1>
      <n-form-item label="名称" path="name">
        <n-input v-model:value="model.name" placeholder="请输入名称"/>
      </n-form-item>
      <n-form-item label="备注" path="mark">
        <n-input
            v-model:value="model.mark"
            placeholder="备注"
            type="textarea"
            :autosize="{
          minRows: 3,
          maxRows: 5
        }"
        />
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

<style scoped>

</style>
