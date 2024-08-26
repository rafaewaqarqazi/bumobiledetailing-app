import { useEffect, useMemo, useState } from "react";
import { IBooking, bookingCrud } from "@/utils/crud/booking.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useBookings = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const fetchBookings = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    bookingCrud
      .list(_props)
      .then((response) => {
        setBookings(response.data.data.res);
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
    fetchBookings(props);
  }, []);
  return useMemo(
    () => ({ loading, bookings, refetch: fetchBookings }),
    [loading, bookings],
  );
};

export const useBooking = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState<IBooking | null>(null);
  const params = useParams();
  const fetchBooking = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    bookingCrud
      .getById(_id)
      .then((response) => {
        setBooking(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchBooking(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({
      loading,
      booking,
      refetch: fetchBooking,
      setBooking,
    }),
    [loading, booking],
  );
};
