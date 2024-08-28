import { useEffect, useMemo, useState } from "react";
import { IEmployee, employeeCrud } from "@/utils/crud/employee.crud";
import { useParams } from "next/navigation";
import { IHooksList } from "@/hooks/index";

export const useEmployees = ({ setPagination, ...props }: IHooksList) => {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const fetchEmployees = (_props: Partial<IHooksList>) => {
    setLoading(true);
    delete _props.total;
    employeeCrud
      .list(_props)
      .then((response) => {
        setEmployees(response.data.data.res);
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
    fetchEmployees(props);
  }, []);
  return useMemo(
    () => ({ loading, employees, refetch: fetchEmployees }),
    [loading, employees],
  );
};

export const useEmployee = (id?: number) => {
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<IEmployee | null>(null);
  const params = useParams();
  const fetchEmployee = (_id: number) => {
    if (!_id) return;
    setLoading(true);
    employeeCrud
      .getById(_id)
      .then((response) => {
        setEmployee(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchEmployee(id || +params.id);
  }, [params.id, id]);
  return useMemo(
    () => ({
      loading,
      employee,
      refetch: fetchEmployee,
      setEmployee,
    }),
    [loading, employee],
  );
};
