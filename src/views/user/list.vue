<style scoped>
</style>
<template>
  <div class="list-box">
    <h1>管理员管理 <span> <router-link to="/user/create"><n-button dashed>创建</n-button></router-link></span></h1>
    <n-form
        ref="formRef"
        inline
        label-placement="left"
        :label-width="80"
        :model="formValue"
    >
      <n-form-item label="关键字" path="user.name">
        <n-input v-model:value="formValue.keyword" placeholder="请输入关键字"/>
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" @click="handleValidateClick">
          搜索
        </n-button>
      </n-form-item>
    </n-form>

    <n-data-table
        remote
        ref="table"
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        :row-key="rowKey"
        @update:page="handlePageChange"
    />
  </div>
</template>

<script>
import {NButton, NForm, NFormItem, NInput, NDataTable, useMessage} from 'naive-ui'
import {defineComponent, reactive, ref, onMounted, h} from "vue";
import userAPi from "@/api/user.js"
import {RouterLink} from "vue-router";

const columns = ({del}) => {
  return [
    {
      type: "selection"
    },
    {
      title: '账户',
      key: 'username',
      render(row) {
        return h(
            RouterLink,
            {
              to: {
                name: "user_update",
                query: {
                  id: row.id,
                }
              }
            },
            {default: () => row.username}
        )
      }
    },
    {
      title: '手机号码',
      key: 'phone',
    },
    {
      title: 'email',
      key: 'email',
    },
    {
      title: '昵称',
      key: 'nick_name',
    },
    {
      title: '角色',
      key: 'role_str',
    },
    {
      title: '状态',
      key: 'status_str',
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
    },
  ]
}

function query(page, pageSize = 10, query = {}) {
  let start = (page - 1) * pageSize
  let data = {
    start: start <= 0 ? 0 : start, length: pageSize,
  }
  if (query["keyword"]) {
    data['username'] = query["keyword"]
  }
  if (query["id"]) {
    data['id'] = query["id"]
  }
  if (query["status"]) {
    data['status'] = query["status"]
  }
  return userAPi.list(data);
}


export default defineComponent({
  components: {
    NForm, NFormItem, NInput, NButton, useMessage, NDataTable
  },
  setup() {
    const dataRef = ref([])
    const loadingRef = ref(true)
    const paginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      prefix({itemCount}) {
        return `Total： ${itemCount}`
      }
    })
    onMounted(() => {
      query(
          paginationReactive.page, paginationReactive.pageSize, formValue.value
      ).then((resp) => {
        if (resp.data.code === 0) {
          let data = resp.data.data
          dataRef.value = data.list??[]
          paginationReactive.pageCount = Math.ceil(data.total / paginationReactive.pageSize)
          paginationReactive.itemCount = data.total * 1
          loadingRef.value = false
        }
      })
    })


    const formRef = ref(null);
    const formValue = ref({
      keyword: ""
    })
    const message = useMessage();
    return {
      formRef,
      formValue: formValue,
      handleValidateClick(e) {
        e.preventDefault();
        //search
        paginationReactive.page = 1
        query(
            paginationReactive.page, paginationReactive.pageSize, formValue.value
        ).then((resp) => {
          if (resp.data.code === 0) {
            let data = resp.data.data
            dataRef.value = data.list??[]
            paginationReactive.pageCount = Math.ceil(data.total / paginationReactive.pageSize)
            paginationReactive.itemCount = data.total * 1
            loadingRef.value = false
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
      pagination: paginationReactive,
      loading: loadingRef,
      rowKey(rowData) {
        return rowData.id
      },
      handlePageChange(currentPage) {
        if (!loadingRef.value) {
          loadingRef.value = true
          query(
              currentPage, paginationReactive.pageSize, formValue.value
          ).then((resp) => {
            if (resp.data.code === 0) {
              let data = resp.data.data
              dataRef.value = data.list??[]
              paginationReactive.page = currentPage
              paginationReactive.pageCount = Math.ceil(data.total / paginationReactive.pageSize)
              paginationReactive.itemCount = data.total * 1
              loadingRef.value = false
            }
          })
        }
      }

    };
  }
});
</script>