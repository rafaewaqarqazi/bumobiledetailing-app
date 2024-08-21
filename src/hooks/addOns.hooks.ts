import { useEffect, useMemo, useState } from "react";
import { IAddOn, addOnCrud } from "@/utils/crud/addOn.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useAddOns = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [addOns, setAddOns] = useState<IAddOn[]>([]);
  const fetchAddOns = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    addOnCrud
      .list(_props)
      .then((response) => {
        setAddOns(response.data.data.res);
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
    fetchAddOns(props);
  }, []);
  return useMemo(
    () => ({ loading, addOns, refetch: fetchAddOns }),
    [loading, addOns],
  );
};

export const useAddOn = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [addOn, setAddOn] = useState<IAddOn | null>(null);
  const params = useParams();
  const fetchAddOn = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    addOnCrud
      .getById(_id)
      .then((response) => {
        setAddOn(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchAddOn(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({ loading, addOn, refetch: fetchAddOn, setAddOn }),
    [loading, addOn],
  );
};
