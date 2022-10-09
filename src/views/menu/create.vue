<script>
import {defineComponent, ref, reactive, onMounted} from "vue";
import {NForm, NFormItem, NInput, NButton, NRadioButton, NRadioGroup, NSelect, useMessage} from 'naive-ui'
import menuAPi from "@/api/menu.js"
import {useRouter} from 'vue-router'

export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, NRadioButton, NRadioGroup, NSelect, useMessage, reactive
  },
  setup() {
    const message = useMessage()
    const formRef = ref(null);
    const model = reactive({
      name: '',
      parent_id: '0',
      menu_type: '1',
      sort_by: '100',
      style: '',
      router: '',
      mark: '',
      status: '0',
    });
    const menuList = ref([])
    const router = useRouter()
    onMounted(() => {
      menuAPi.list({}).then(function (resp) {
        if (resp.data.code === 0) {
          let data = []
          data.push({label: '顶级分类', value: '0'})
          let rootList = resp.data.data.list.rootList
          for (let r in rootList) {
            data.push({label: rootList[r]['name'], value: rootList[r]['id']})
          }
          console.log(data)
          menuList.value = data
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
              return new Error('请输入 菜单名称')
            } else if (value.length < 4 || value.length > 100) {
              return new Error('名称长度不合法')
            }
            return true
          },
        },
        parent_id: {required: true},
        menu_type: {required: true},
        status: {required: true},
        sort_by: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (!value) {
              return new Error('请填写 排序')
            } else if (!/^\d*$/.test(value)) {
              return new Error('排序字段应该为整数')
            } else if (Number(value) > 65535 || Number(value) < 0) {
              return new Error('排序长度不合法')
            }
            return true
          },
        },
        router: {
          required: true,
          trigger: ["blur", "input"],
          validator(rule, value) {
            if (value.length > 50 || value.length < 3) {
              return new Error('router长度不合法')
            }
            return true
          },
        },
      },
      generalOptions:menuList,
      handleValidateClick(e) {
        e.preventDefault()
        formRef.value?.validate((errors) => {
          if (!errors) {
            message.loading('正在提交...', {duration: 5000})
            menuAPi.create(model).then(function (resp) {
              message.destroyAll()
              if (resp.data.code == 1) {
                message.error('create error:' + resp.data.message)
                return
              }
              message.success('create success!wait for jump..')

              setTimeout(function () {
                message.destroyAll()
                router.push({path: "/menu/list"})
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
      <h1>创建菜单</h1>
      <n-form-item label="名称" path="name">
        <n-input v-model:value="model.name" placeholder="请输入名称"/>
      </n-form-item>
      <n-form-item label="所属分类" path="parent_id">
        <n-select
            v-model:value="model.parent_id"
            placeholder="Select"
            :options="generalOptions"
        />
      </n-form-item>
      <n-form-item label="菜单类型" path="menu_type">
        <n-radio-group v-model:value="model.menu_type" name="menu_type">
          <n-radio-button value="1">
            普通菜单
          </n-radio-button>
          <n-radio-button value="2">
            权限菜单
          </n-radio-button>
        </n-radio-group>
      </n-form-item>
      <n-form-item label="排序" path="sort_by">
        <n-input v-model:value="model.sort_by" placeholder="请输入排序"/>
      </n-form-item>
      <n-form-item label="样式" path="style">
        <n-input v-model:value="model.style" placeholder="请输入样式"/>
      </n-form-item>
      <n-form-item label="路径" path="router">
        <n-input v-model:value="model.router" placeholder="请输入路径"/>
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
          <router-link to="/menu/list">
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
