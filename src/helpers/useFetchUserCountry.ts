import { useEffect } from "react";
import { Country } from "../types/detailsFormTypes";
import { UseFormSetValue } from "react-hook-form";
import { FormData } from "../types/detailsFormTypes";

const API_KEY = "49d1f46e493f4476bee8ad878df84506";

const useFetchUserCountry = (
  countries: Country[], 
  setSelectedCountry: (country: Country) => void, 
  setDelivery: (delivery: { method: string; price: number }) => void, 
  setValue: UseFormSetValue<FormData>
) => {
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        const response = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const userCountry = data.country_name;
        const country = countries.find((c) => c.name === userCountry);

        if (country) {
          setSelectedCountry(country);
          setDelivery({ method: "standard", price: country.delivery.standard });
          setValue("country", country.name);
        }
      } catch (error) {
        const fallbackCountry = countries.find((country) => country.fallback);
        
        if (fallbackCountry) {
          setSelectedCountry(fallbackCountry);
          setDelivery({ method: "standard", price: fallbackCountry.delivery.standard });
          setValue("country", fallbackCountry.name);
        }
        console.error("Error fetching user country:", error);
      }
    };

    if (countries.length > 0) {
      fetchUserCountry();
    }
  }, [countries, setSelectedCountry, setDelivery, setValue]);
};

export default useFetchUserCountry;
