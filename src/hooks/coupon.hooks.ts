import { useEffect, useMemo, useState } from "react";
import { ICoupon, couponCrud } from "@/utils/crud/coupon.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useCoupons = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState<ICoupon[]>([]);
  const fetchCoupons = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    couponCrud
      .list(_props)
      .then((response) => {
        setCoupons(response.data.data.res);
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
    fetchCoupons(props);
  }, []);
  return useMemo(
    () => ({ loading, coupons, refetch: fetchCoupons }),
    [loading, coupons],
  );
};

export const useCoupon = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState<ICoupon | null>(null);
  const params = useParams();
  const fetchCoupon = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    couponCrud
      .getById(_id)
      .then((response) => {
        setCoupon(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchCoupon(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({ loading, coupon, refetch: fetchCoupon, setCoupon }),
    [loading, coupon],
  );
};
