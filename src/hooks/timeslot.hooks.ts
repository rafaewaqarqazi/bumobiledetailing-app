import { useEffect, useMemo, useState } from "react";
import { ITimeslot, timeslotCrud } from "@/utils/crud/timeslot.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useTimeslots = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [timeslots, setTimeslots] = useState<ITimeslot[]>([]);
  const fetchTimeslots = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    timeslotCrud
      .list(_props)
      .then((response) => {
        setTimeslots(response.data.data.res);
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
    fetchTimeslots(props);
  }, []);
  return useMemo(
    () => ({ loading, timeslots, refetch: fetchTimeslots }),
    [loading, timeslots],
  );
};

export const useTimeslot = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [timeslot, setTimeslot] = useState<ITimeslot | null>(null);
  const params = useParams();
  const fetchTimeslot = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    timeslotCrud
      .getById(_id)
      .then((response) => {
        setTimeslot(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchTimeslot(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({
      loading,
      timeslot,
      refetch: fetchTimeslot,
      setTimeslot,
    }),
    [loading, timeslot],
  );
};
