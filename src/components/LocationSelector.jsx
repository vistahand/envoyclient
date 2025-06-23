/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";

const LocationSelector = ({ onSelection }) => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  // Refs for click outside detection
  const countryRef = useRef(null);
  const stateRef = useRef(null);

  // Effect for outside click detection
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryRef.current && !countryRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
      if (stateRef.current && !stateRef.current.contains(event.target)) {
        setShowStateDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const loadCountries = async () => {
      setIsLoading(true);
      try {
        // Import local countries data
        const countriesData = await import("../data/countries.json");
        const data = countriesData.default;

        const sorted = data
          .filter(
            (country) => country.name && country.name.common && country.flags
          ) // Filter out invalid entries
          .sort((a, b) => a.name.common.localeCompare(b.name.common));

        setCountries(sorted);
      } catch (error) {
        console.error("Failed to load countries", error);
        setCountries([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadCountries();
  }, []);

  const fetchStates = async (countryName) => {
    try {
      const res = await fetch(
        "https://countriesnow.space/api/v0.1/countries/states",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ country: countryName }),
        }
      );

      const data = await res.json();

      if (data.data?.states && Array.isArray(data.data.states)) {
        const sortedStates = data.data.states.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setStates(sortedStates);
      } else {
        setStates([]);
      }
    } catch (err) {
      console.error(`Failed to fetch states for ${countryName}`, err);
      setStates([]);
    }
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedState(null);
    setShowCountryDropdown(false);
    fetchStates(country.name.common);

    // Modified to match CreatePickupLocation's expected format
    if (onSelection)
      onSelection({
        origin: {
          country: country.name.common,
          state: null,
        },
      });
  };

  const handleStateSelect = (state) => {
    setSelectedState(state);
    setShowStateDropdown(false);

    // Modified to match CreatePickupLocation's expected format
    if (onSelection)
      onSelection({
        origin: {
          country: selectedCountry.name.common,
          state: state.name,
        },
      });
  };

  const renderCountryDropdown = () => {
    if (isLoading) {
      return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-center">
          Loading...
        </div>
      );
    }

    if (!countries || countries.length === 0) {
      return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          No countries available
        </div>
      );
    }

    return (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {countries.map((country) => {
          const countryName = country.name?.common || "Unknown";
          const flagUrl = country.flags?.png || country.flags?.svg;

          return (
            <div
              key={countryName}
              onClick={() => handleCountrySelect(country)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              {flagUrl && (
                <img
                  src={flagUrl}
                  alt={`${countryName} flag`}
                  className="w-6 h-4 object-cover rounded"
                  onError={(e) => (e.target.style.display = "none")}
                />
              )}
              <span>{countryName}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderStatesDropdown = () => {
    if (!states || states.length === 0) {
      return (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4">
          No states available for this country
        </div>
      );
    }

    return (
      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {states.map((state) => (
          <div
            key={state.name || `state-${Math.random()}`}
            onClick={() => handleStateSelect(state)}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          >
            {state.name}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h2 className="text-lg font-medium mb-4">Pickup Location</h2>

      <div className="flex gap-4 flex-col md:flex-row">
        {/* Country */}
        <div className="relative w-full" ref={countryRef}>
          <div
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="flex items-center justify-between border border-gray-300 rounded-md p-3 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {selectedCountry &&
                (selectedCountry.flags?.png || selectedCountry.flags?.svg) && (
                  <img
                    src={
                      selectedCountry.flags?.png || selectedCountry.flags?.svg
                    }
                    className="w-6 h-4 rounded"
                    alt="flag"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                )}
              <span>{selectedCountry?.name?.common || "Select country"}</span>
            </div>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
          {showCountryDropdown && renderCountryDropdown()}
        </div>

        {/* State */}
        <div className="relative w-full" ref={stateRef}>
          <div
            onClick={() =>
              selectedCountry && setShowStateDropdown(!showStateDropdown)
            }
            className={`flex items-center justify-between border border-gray-300 rounded-md p-3 ${
              selectedCountry
                ? "cursor-pointer"
                : "cursor-not-allowed bg-gray-100"
            }`}
          >
            <span>{selectedState?.name || "Select state"}</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </div>
          {showStateDropdown && renderStatesDropdown()}
        </div>
      </div>
    </div>
  );
};

export default LocationSelector;
