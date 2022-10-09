<style scoped>

</style>
<template>
  <div class="list-box">
    <h1>菜单管理 <span> <router-link to="/menu/create"><n-button dashed>创建</n-button></router-link></span></h1>
    <n-form
        ref="formRef"
        inline
        label-placement="left"
        :label-width="80"
        :model="formValue"
    >

      <n-radio-group v-model:value="formValue.menu_type" name="menu_type">
        <n-radio-button value="1">
          普通菜单
        </n-radio-button>
        <n-radio-button value="2">
          权限菜单
        </n-radio-button>
      </n-radio-group>

      <n-form-item style="margin-left: 2rem;">
        <n-button attr-type="button" type="primary" @click="handleValidateClick">
          搜索
        </n-button>
      </n-form-item>

    </n-form>

    <n-data-table
        v-if="expandAll"
        remote
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        :row-key="rowKey"
        :default-expand-all="true"
    />
  </div>
</template>

<script>
import {NButton, NForm, NFormItem, NInput, NDataTable, useMessage, NRadioButton, NRadioGroup} from 'naive-ui'
import {defineComponent, reactive, ref, onMounted, h} from "vue";
import menuAPi from "@/api/menu.js"
import {RouterLink} from "vue-router";

const columns = ({del}) => {
  return [
    {
      type: "selection"
    },
    {
      title: '名称',
      key: 'name',
      render(row) {
        return h(
            RouterLink,
            {
              to: {
                name: "menu_update",
                query: {
                  id: row.id,
                }
              }
            },
            {default: () => row.name}
        )
      }
    },
    {
      title: 'router',
      key: 'router',
    },
    {
      title: '样式',
      key: 'style',
    },
    {
      title: '状态',
      key: 'status_str',
    },
    {
      title: '排序',
      key: 'sort_by',
    },
    {
      title: '操作',
      key: 'id',
      render(row) {
        return h(
            NButton,
            {
              size: 'small',
              onClick: () => del(row)
            },
            {default: () => '删除'}
        )
      }
    }
  ]
}

function query(query = {}) {
  let start = 1
  let data = {
    start: start <= 0 ? 0 : start, length: 10,
    // keyword: "", id: "",
    menu_type: query["menu_type"] ?? 1
  }
  if (query["keyword"]) {
    data['name'] = query["keyword"]
  }
  if (query["id"]) {
    data['id'] = query["id"]
  }
  return menuAPi.list(data)
}


export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, useMessage, NDataTable, NRadioButton, NRadioGroup
  },
  setup() {
    const dataRef = ref([])
    const loadingRef = ref(true)
    const expandAllRef = ref(false)
    onMounted(() => {
      query(
          formValue.value
      ).then((resp) => {
        if (resp.data.code === 0) {
          let data = resp.data.data
          let rootList = data.list.rootList
          let subList = data.list.subList
          for (let r in rootList) {
            let kk = rootList[r].id
            if (subList['index_' + kk]) {
              rootList[r]['children'] = subList['index_' + kk]
            }
          }
          dataRef.value = rootList
          loadingRef.value = false
          expandAllRef.value = true
        }
      })
    })


    const formRef = ref(null);
    const formValue = ref({
      keyword: "", menu_type: "1"
    })
    const message = useMessage();
    return {
      formRef,
      formValue: formValue,
      handleValidateClick(e) {
        query(
            formValue.value
        ).then((resp) => {
          if (resp.data.code === 0) {
            let data = resp.data.data
            let rootList = data.list.rootList ?? []
            let subList = data.list.subList ?? []
            if (data.total * 1 > 0 && subList) {
              for (let r in rootList) {
                let kk = rootList[r].id
                if (subList['index_' + kk]) {
                  rootList[r]['children'] = subList['index_' + kk]
                }
              }
            }
            dataRef.value = rootList
            loadingRef.value = false
            expandAllRef.value = true
          }
        })
      },
      //table
      data: dataRef,
      columns: columns({
        del(row) {
          // console.log(row)
          message.info('暂不支持删除');
        }
      }),
      loading: loadingRef,
      expandAll: expandAllRef,
      rowKey(rowData) {
        return rowData.id
      }

    };
  }
});
</script>