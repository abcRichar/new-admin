import { reactive, onMounted } from "vue";
import type { PaginationProps } from "@pureadmin/table";

export function useChangePage(onSearch: () => void) {
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });

  function handleSizeChange(val: number) {
    pagination.pageSize = val;
    onSearch();
  }

  function handleCurrentChange(val: number) {
    pagination.currentPage = val;
    onSearch();
  }

  onMounted(() => {
    onSearch();
  });

  return {
    handleSizeChange,
    handleCurrentChange,
    pagination
  };
}
