import { createContext, useEffect, useState }  from "react";

export const CoinContext = createContext();

const CoinContextProvider = (props) => {
  const [allCoin, setAllCoin] = useState([]);
  const [currency, setCurrency] = useState({
    name: "usd",
    symbol: "$",
  });
  const [error, setError] = useState(null);

  const fetchAllcoin = async () => {
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        "x-cg-demo-api-key": "CG-DjbKt5E7tYVbf9AcmC7oJgF7",
      },
    };

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency.name}`,
        options
      );
      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }
      const data = await response.json();
      setAllCoin(data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAllcoin();
  }, [currency]);

  const contextValue = {
    allCoin,
    currency,
    setCurrency,
    error,
  };

  return (
    <CoinContext.Provider value={contextValue}>
      {props.children}
    </CoinContext.Provider>
  );
};

export default CoinContextProvider;