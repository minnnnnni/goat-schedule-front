import { useEffect, useState } from 'react';
import { Employee, getEmployees } from '@/services/employeeApi';

const DEFAULT_STORE_ID = 1;

export function useEmployees(storeId: number = DEFAULT_STORE_ID) {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;
    async function getEmployeesApi() {
      setLoading(true);
      setError(null);
      try {
        const data = await getEmployees(storeId);
        if (mounted) {
          setEmployees(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err as Error);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    getEmployeesApi();

    return () => {
      mounted = false;
    };
  }, [storeId]);

  return { employees, loading, error };
}
