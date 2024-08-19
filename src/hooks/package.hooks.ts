import { useEffect, useMemo, useState } from "react";
import { IPackage, packageCrud } from "@/utils/crud/package.crud";

interface IUsePackages {
  setPagination: (pagination: any) => void;
  current?: number;
  pageSize?: number;
  total?: number;
}
export const usePackages = ({ setPagination, ...props }: IUsePackages) => {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const fetchPackages = (_props: Partial<IUsePackages>) => {
    setLoading(true);
    delete _props.total;
    packageCrud
      .list(_props)
      .then((response) => {
        setPackages(response.data.data.res);
        setPagination({
          current: response.data.data.current,
          pageSize: response.data.data.pageSize,
          total: response.data.data.count,
        });
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPackages(props);
  }, []);
  return useMemo(
    () => ({ loading, packages, refetch: fetchPackages }),
    [loading, packages],
  );
};
