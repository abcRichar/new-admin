import dayjs from "dayjs";
import editForm from "../form.vue";
import { handleTree } from "@/utils/tree";
import { message } from "@/utils/message";
import { ElMessageBox } from "element-plus";
// import { usePublicHooks } from "../../hooks";
// import { transformI18n } from "@/plugins/i18n";
import { addDialog } from "@/components/ReDialog";
import type { FormItemProps } from "../utils/types";
import { useChangePage } from "@/hooks/useChangePage";
import { getKeyList, deviceDetection } from "@pureadmin/utils";
import { getRulesTree } from "@/router/utils";

// import { getRoleList, getRoleMenu, getRoleMenuIds } from "@/api/system";
import { menuList, menuAdd, menuById, menuDelete, menuEdit } from "@/api/authority";
import { getAsyncRoutes } from "@/api/routes";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch } from "vue";
import { pid } from "node:process";

export function useData() {
  const form = reactive({
    menu_name: ""
  });
  const curRow = ref();
  const formRef = ref();
  const tableData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const { handleSizeChange, handleCurrentChange, pagination } = useChangePage(onSearch);

  const columns: TableColumnList = [
    {
      label: "菜单名称",
      prop: "menu_name",
      minWidth: 200,
      align: "left",
      headerAlign: "center"
    },
    {
      label: "菜单组件",
      prop: "menu_url",
      minWidth: 200
    },

    {
      label: "状态",
      prop: "status",
      formatter: ({ status }) => {
        return status === 1 ? "显示" : "隐藏";
      }
    },
    {
      label: "排序",
      prop: "sort"
    },
    {
      label: "创建时间",
      prop: "create_time",
      minWidth: 160
    },
    {
      label: "更新时间",
      prop: "update_time",
      minWidth: 160
    },
    {
      label: "操作",
      fixed: "right",
      width: 210,
      slot: "operation"
    }
  ];

  function handleDelete(row) {
    ElMessageBox.confirm(`确认要<strong>删除</strong><strong style='color:var(--el-color-primary)'>${row.menu_name}</strong>吗?`, "系统提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
      dangerouslyUseHTMLString: true,
      draggable: true
    })
      .then(() => {
        menuDelete({
          id: row.id
        })
          .then(res => {
            message(`成功删除`, { type: "success" });
            onSearch();
          })
          .catch(err => {
            message(err.msg, { type: "error" });
          });
      })
      .catch(err => {});
  }

  const allMenuList = ref([]);
  const getMenuList = () => {
    getAsyncRoutes()
      .then(res => {
        allMenuList.value = getRulesTree(res.data, 0, []);
        (allMenuList.value as Array<any>).unshift({
          id: 0,
          menu_name: "无"
        });
      })
      .catch(err => {
        allMenuList.value = [];
      });
  };

  async function onSearch() {
    loading.value = true;
    await menuList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...form
    })
      .then(res => {
        console.log(res.data, getRulesTree(res.data, 0, []));
        tableData.value = getRulesTree(res.data, 0, []);
        pagination.total = res.total;
        loading.value = false;
      })
      .catch(err => {
        tableData.value = [];
        pagination.total = 0;
        loading.value = false;
      });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  /** 获取详情 */
  // const getNoticeById = (row?: FormItemProps) => {
  //   menuById({
  //     id: row.id
  //   })
  //     .then(res => {
  //       openDialog("编辑", res.data);
  //     })
  //     .catch(err => {
  //       message(err.msg, { type: "error" });
  //     });
  // };

  function openDialog(title = "新增", row?: FormItemProps) {
    addDialog({
      title: `${title}`,
      props: {
        formInline: {
          id: row?.id,
          menu_name: row?.menu_name || "",
          menu_url: row?.menu_url || "",
          sort: row?.sort || 0,
          pid: row?.pid || 0,
          icon: row?.icon || "",
          status: row?.status || 1,
          allMenuList: allMenuList.value
        }
      },
      width: "40%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;
        function chores() {
          message(`成功`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }
        FormRef.validate(valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              menuAdd({
                pid: curData.pid,
                menu_name: curData.menu_name,
                menu_url: curData.menu_url,
                status: curData.status,
                icon: curData.icon,
                sort: curData.pid
              })
                .then(res => {
                  chores();
                })
                .catch(err => {
                  message(err.msg, { type: "error" });
                });
              // 实际开发先调用新增接口，再进行下面操作
            } else if (title === "编辑") {
              // 实际开发先调用修改接口，再进行下面操作
              menuEdit({
                id: curData.id,
                title: curData.title,
                content: curData.content,
                status: curData.status
              })
                .then(res => {
                  chores();
                })
                .catch(err => {
                  message(err.msg, { type: "error" });
                });
            }
          }
        });
      }
    });
  }

  onMounted(async () => {
    onSearch();
    getMenuList();
  });

  return {
    form,
    isShow,
    curRow,
    loading,
    columns,
    tableData,
    pagination,
    // buttonClass,
    onSearch,
    resetForm,
    openDialog,
    handleDelete,
    // handleDatabase,
    handleSizeChange,
    handleCurrentChange
  };
}
