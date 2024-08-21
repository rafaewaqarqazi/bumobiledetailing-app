import { useEffect, useMemo, useState } from "react";
import { IService, serviceCrud } from "@/utils/crud/service.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useServices = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<IService[]>([]);
  const fetchServices = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    serviceCrud
      .list(_props)
      .then((response) => {
        setServices(response.data.data.res);
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
    fetchServices(props);
  }, []);
  return useMemo(
    () => ({ loading, services, refetch: fetchServices }),
    [loading, services],
  );
};

export const useService = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [service, setService] = useState<IService | null>(null);
  const params = useParams();
  const fetchService = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    serviceCrud
      .getById(_id)
      .then((response) => {
        setService(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchService(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({ loading, service, refetch: fetchService, setService }),
    [loading, service],
  );
};
