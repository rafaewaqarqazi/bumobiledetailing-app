import { useEffect, useMemo, useState } from "react";
import { ICustomer, customerCrud } from "@/utils/crud/customer.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useCustomers = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<ICustomer[]>([]);
  const fetchCustomers = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    customerCrud
      .list(_props)
      .then((response) => {
        setCustomers(response.data.data.res);
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
    fetchCustomers(props);
  }, []);
  return useMemo(
    () => ({ loading, customers, refetch: fetchCustomers }),
    [loading, customers],
  );
};

export const useCustomer = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState<ICustomer | null>(null);
  const params = useParams();
  const fetchCustomer = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    customerCrud
      .getById(_id)
      .then((response) => {
        setCustomer(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchCustomer(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({
      loading,
      customer,
      refetch: fetchCustomer,
      setCustomer,
    }),
    [loading, customer],
  );
};
