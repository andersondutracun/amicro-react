import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export const useCheckCnpjExists = (cnpj) => {
  const [exists, setExists] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkCnpjExists = async () => {
      setLoading(true);

      try {
        const q = query(collection(db, "empresas"), where("cnpj", "==", cnpj));
        const querySnapshot = await getDocs(q);

        setExists(querySnapshot.size > 0);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }

      setLoading(false);
    };

    if (cnpj) {
      checkCnpjExists();
    }
  }, [cnpj]);

  return { exists, loading, error };
};
