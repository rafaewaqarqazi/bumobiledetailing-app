import { useEffect, useMemo, useState } from "react";
import {
  IAddOnCategory,
  addOnCategoryCrud,
} from "@/utils/crud/addOn.category.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useAddOnCategories = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [addOnCategories, setAddOnCategories] = useState<IAddOnCategory[]>([]);
  const fetchAddOnCategories = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    addOnCategoryCrud
      .list(_props)
      .then((response) => {
        setAddOnCategories(response.data.data.res);
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
    fetchAddOnCategories(props);
  }, []);
  return useMemo(
    () => ({ loading, addOnCategories, refetch: fetchAddOnCategories }),
    [loading, addOnCategories],
  );
};

export const useAddOnCategory = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [addOnCategory, setAddOn] = useState<IAddOnCategory | null>(null);
  const params = useParams();
  const fetchAddOn = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    addOnCategoryCrud
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
    () => ({
      loading,
      addOnCategory,
      refetch: fetchAddOn,
      setAddOn,
    }),
    [loading, addOnCategory],
  );
};
