import { useEffect, useMemo, useState } from "react";
import { IPackage, packageCrud } from "@/utils/crud/package.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const usePackages = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<IPackage[]>([]);
  const fetchPackages = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    packageCrud
      .list(_props)
      .then((response) => {
        setPackages(response.data.data.res);
        if (setPagination) {
          setPagination({
            current: response.data.data.current,
            pageSize: response.data.data.pageSize,
            total: response.data.data.count,
          });
        }
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

export const usePackage = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [packageData, setPackageData] = useState<IPackage | null>(null);
  const params = useParams();
  const fetchPackage = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    packageCrud
      .getById(_id)
      .then((response) => {
        setPackageData(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchPackage(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({ loading, packageData, refetch: fetchPackage, setPackageData }),
    [loading, packageData],
  );
};
