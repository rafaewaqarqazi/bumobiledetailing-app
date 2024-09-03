import { useEffect, useMemo, useState } from "react";
import { IHooksList } from "@/hooks/index";
import { agentCrud } from "@/utils/crud/agent.crud";

export const useAgents = ({ setPagination, ...params }: IHooksList) => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);

  const refetch = (_params: IHooksList) => {
    setLoading(true);
    delete _params.total;
    agentCrud
      .getAgents(_params)
      .then((res) => {
        setAgents(res.data.data?.res);
        if (setPagination) {
          setPagination({
            current: res.data.data.current,
            pageSize: res.data.data.pageSize,
            total: res.data.data.count,
          });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    refetch(params);
  }, []);
  return useMemo(
    () => ({
      agents,
      loading,
      refetch,
    }),
    [agents, loading, refetch],
  );
};
