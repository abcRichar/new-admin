import { useRouter } from "vue-router";

/** 用于获取当前页面名 */
export const getRouteName = (): string => {
  const router = useRouter();
  const { currentRoute } = router;
  return currentRoute.value.name as any;
};
