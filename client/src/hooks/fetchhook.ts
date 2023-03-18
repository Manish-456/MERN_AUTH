import axios from 'axios';
import { useEffect, useState } from 'react';
import { Data, UserData, getUsername, DecodedValue } from '../Helper/helper';

interface ApiData<T> {
  isLoading: boolean;
  apiData: UserData | null;
  status: number | null;
  serverError: T  | unknown;
}
axios.defaults.baseURL = "http://localhost:8080";
const useFetch = <T>(
  query: string
): [ApiData<T>, React.Dispatch<React.SetStateAction<ApiData<T>>>] => {
  const [data, setData] = useState<ApiData<T>>({
    isLoading: false,
    apiData: null,
    status: null,
    serverError:  null,
  });
 
 
  useEffect(() => {
    const fetchData = async () => {

      try {
        setData((prev) => ({ ...prev, isLoading: true }));
    
        let decodedValue = !query ? await getUsername() : null;
        let username = decodedValue?.username;
   
      
        if (typeof username !== 'undefined' && !query) {
          const { data, status }: Data = await axios.get(`/api/user/${username}`) 
            
          if (status === 200) {
            setData((prev) => ({
              ...prev,
              isLoading: false,
              apiData: data,
              status: status,
            }));
          }
        } else {
          const { data, status }: Data =  await axios.get(`/api/${query}`);
          if (status === 200 || status === 201) {
            setData((prev) => ({
              ...prev,
              isLoading: false,
              apiData: data,
              status: status,
            }));
          }
  }
          setData((prev) => ({ ...prev, isLoading: false }));
      
      } catch ({message}) {
        setData((prev) => ({ ...prev, isLoading: false, serverError: message }));
      }
    };
    fetchData();
  }, []);

  return [data, setData];
};

export default useFetch;
