import React, { useEffect, useState } from "react";
import "./App.css";

type FetchState<T> =
  | { stage: "loading" }
  | { stage: "loaded"; value: T }
  | { stage: "error"; message: string };

interface Restaurant {
  id: string;
  name: string;
}

const App = ({ apiEndpoint }: { apiEndpoint: URL }): React.ReactElement => {
  const [restaurants, setRestaurants] = useState<FetchState<Restaurant[]>>({
    stage: "loading",
  });

  useEffect(() => {
    const load = async () => {
      const response = await fetch(new URL("/restaurants/", apiEndpoint));
      if (response.status !== 200) {
        setRestaurants({
          stage: "error",
          message: "Failed to fetch restaurants from server",
        });
        return;
      }

      const res = (await response.json()) as Restaurant[];
      setRestaurants({ stage: "loaded", value: res });
    };
    load();
  });

  return (
    <>
      {restaurants.stage === "loading" && (
        <>
          <p>Loading...</p>
        </>
      )}
      {restaurants.stage === "loaded" && (
        <>
          <p>Restaurants:</p>
          <ul data-testid="restaurant-list">
            {restaurants.value.map((restaurant) => (
              <li key={restaurant.id}>{restaurant.name}</li>
            ))}
          </ul>
        </>
      )}
      {restaurants.stage === "error" && (
        <>
          <p>Error: {restaurants.message}</p>
        </>
      )}
    </>
  );
};

export default App;
