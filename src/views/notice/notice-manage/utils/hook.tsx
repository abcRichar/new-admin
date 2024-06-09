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
// import { getRoleList, getRoleMenu, getRoleMenuIds } from "@/api/system";
import {
  noticeList,
  noticeAdd,
  noticeById,
  noticeDelete,
  noticeEdit
} from "@/api/notice-manage";
import { type Ref, reactive, ref, onMounted, h, toRaw, watch } from "vue";

export function useData() {
  const form = reactive({
    title: ""
  });
  const curRow = ref();
  const formRef = ref();
  const tableData = ref([]);
  const isShow = ref(false);
  const loading = ref(true);
  const { handleSizeChange, handleCurrentChange, pagination } =
    useChangePage(onSearch);

  const columns: TableColumnList = [
    {
      label: "编号",
      prop: "id"
    },
    {
      label: "标题",
      prop: "title"
    },
    {
      label: "内容",
      prop: "content"
    },
    {
      label: "状态",
      prop: "status",
      formatter: ({ status }) => {
        return status === 1 ? "显示" : "隐藏";
      }
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
    ElMessageBox.confirm(
      `确认要<strong>删除</strong><strong style='color:var(--el-color-primary)'>${row.title}</strong>吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(() => {
        noticeDelete({
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

  async function onSearch() {
    loading.value = true;
    await noticeList({
      page: pagination.currentPage,
      page_size: pagination.pageSize,
      ...form
    })
      .then(res => {
        tableData.value = res.data;
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
  //   noticeById({
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
          title: row?.title || "",
          content: row?.content || "",
          status: row?.status || 1
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
              noticeAdd({
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
              // 实际开发先调用新增接口，再进行下面操作
            } else if (title === "编辑") {
              // 实际开发先调用修改接口，再进行下面操作
              noticeEdit({
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
    // const { data } = await getRoleMenu();
    // treeIds.value = getKeyList(data, "id");
    // treeData.value = handleTree(data);
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
