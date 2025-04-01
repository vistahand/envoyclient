import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LocationSelector = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const NIGERIA_FLAG = "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg"; // Fixed Nigeria flag URL

  const stateOptions = [ { value: "abia", label: "Abia" }, { value: "adamawa", label: "Adamawa" }, { value: "akwa-ibom", label: "Akwa Ibom" }, { value: "anambra", label: "Anambra" }, { value: "bauchi", label: "Bauchi" }, { value: "bayelsa", label: "Bayelsa" }, 
    { value: "benue", label: "Benue" }, { value: "borno", label: "Borno" }, { value: "cross-river", label: "Cross River" }, { value: "delta", label: "Delta" }, { value: "ebonyi", label: "Ebonyi" }, { value: "edo", label: "Edo" }, { value: "ekiti", label: "Ekiti" }, 
    { value: "enugu", label: "Enugu" }, { value: "gombe", label: "Gombe" }, { value: "imo", label: "Imo" }, { value: "jigawa", label: "Jigawa" }, { value: "kaduna", label: "Kaduna" }, { value: "kano", label: "Kano" }, { value: "katsina", label: "Katsina" },
    { value: "kebbi", label: "Kebbi" }, { value: "kogi", label: "Kogi" }, { value: "kwara", label: "Kwara" }, { value: "lagos", label: "Lagos" }, { value: "nasarawa", label: "Nasarawa" }, { value: "niger", label: "Niger" }, { value: "ogun", label: "Ogun" },
    { value: "ondo", label: "Ondo" }, { value: "osun", label: "Osun" }, { value: "oyo", label: "Oyo" }, { value: "plateau", label: "Plateau" }, { value: "rivers", label: "Rivers" }, { value: "sokoto", label: "Sokoto" }, { value: "taraba", label: "Taraba" }, 
    { value: "yobe", label: "Yobe" }, { value: "zamfara", label: "Zamfara" }, { value: "fct", label: "Federal Capital Territory" }, 
];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);

        // Set the default selected country (e.g., Ireland)
        const defaultCountry = sortedCountries.find((country) => country.cca2 === "IE");
        setSelectedCountry(defaultCountry || sortedCountries[0]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedState(""); // Clear state when country changes
    setShowCountryDropdown(false);
  };

  const handleStateChange = (state) => {
    setSelectedState(state);
    setShowStateDropdown(false);
  };

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-lg font-medium mb-4">Select Location</h2>

      <div className="flex flex-row gap-4">
        {/* Country Selector */}
        <div className="relative w-full">
          <div
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="flex items-center justify-between border border-gray-300 rounded-md p-3 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              {selectedCountry && (
                <img
                  src={selectedCountry.flags?.png}
                  alt={`${selectedCountry.name.common} flag`}
                  className="w-6 h-4 object-cover rounded"
                />
              )}
              <span className="font-medium">{selectedCountry?.name?.common || "Select Country"}</span>
            </div>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>

          {showCountryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {countries.map((country) => (
                <div
                  key={country.cca2}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleCountryChange(country)}
                >
                  <img
                    src={country.flags?.png}
                    alt={`${country.name.common} flag`}
                    className="w-6 h-4 object-cover rounded"
                  />
                  <span>{country.name.common}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* State Selector */}
        <div className="relative w-full">
          <div
            onClick={() => setShowStateDropdown(!showStateDropdown)}
            className="flex items-center justify-between border border-gray-300 rounded-md p-3 cursor-pointer"
          >
            <span>{selectedState ? stateOptions.find((state) => state.value === selectedState)?.label : "Select a state/province"}</span>
            <ChevronDown className="h-5 w-5 text-gray-500" />
          </div>

          {showStateDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {stateOptions.map((state) => (
                <div
                  key={state.value}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
                  onClick={() => handleStateChange(state.value)}
                >
                  {/* Display Nigeria flag for state dropdown */}
                  {selectedCountry?.cca2 === "NG" && (
                    <img
                      src={NIGERIA_FLAG}
                      alt="Nigeria flag"
                      className="w-6 h-4 object-cover rounded"
                    />
                  )}
                  {state.label}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Preview of Selected Location */}
      {selectedCountry && selectedState && (
        <div className="mt-6">
          <div className="w-full flex gap-6 items-center">
            <div className="rounded-lg px-6 py-4 bg-gray-100 flex gap-2">
              <img
                src={selectedCountry.flags?.png}
                alt={`${selectedCountry.name.common} flag`}
                className="w-10 h-5 rounded"
              />
              <p className="text-sm font-bold text-gray-800">{selectedCountry.name.common}</p>
            </div>
            <p className="text-sm font-semibold text-gray-500">to</p>
            <div className="rounded-lg px-6 py-4 bg-gray-100 flex gap-2">
              <img
                src={NIGERIA_FLAG}
                alt="Nigeria flag"
                className="w-10 h-5 rounded"
              />
              <p className="text-sm font-bold text-gray-800">
                {stateOptions.find((state) => state.value === selectedState)?.label}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;
