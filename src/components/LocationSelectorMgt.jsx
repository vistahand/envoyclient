import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const LocationSelectorMgt = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedState, setSelectedState] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const [pickupStations, setPickupStations] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);

  const NIGERIA_FLAG = "https://upload.wikimedia.org/wikipedia/commons/7/79/Flag_of_Nigeria.svg";

  const stateOptions = [
    { value: "abia", label: "Abia" },
    { value: "adamawa", label: "Adamawa" },
    { value: "akwa-ibom", label: "Akwa Ibom" },
    { value: "anambra", label: "Anambra" },
    { value: "bauchi", label: "Bauchi" },
    { value: "bayelsa", label: "Bayelsa" },
    { value: "benue", label: "Benue" },
    { value: "borno", label: "Borno" },
    { value: "cross-river", label: "Cross River" },
    { value: "delta", label: "Delta" },
    { value: "ebonyi", label: "Ebonyi" },
    { value: "edo", label: "Edo" },
    { value: "ekiti", label: "Ekiti" },
    { value: "enugu", label: "Enugu" },
    { value: "gombe", label: "Gombe" },
    { value: "imo", label: "Imo" },
    { value: "jigawa", label: "Jigawa" },
    { value: "kaduna", label: "Kaduna" },
    { value: "kano", label: "Kano" },
    { value: "katsina", label: "Katsina" },
    { value: "kebbi", label: "Kebbi" },
    { value: "kogi", label: "Kogi" },
    { value: "kwara", label: "Kwara" },
    { value: "lagos", label: "Lagos" },
    { value: "nasarawa", label: "Nasarawa" },
    { value: "niger", label: "Niger" },
    { value: "ogun", label: "Ogun" },
    { value: "ondo", label: "Ondo" },
    { value: "osun", label: "Osun" },
    { value: "oyo", label: "Oyo" },
    { value: "plateau", label: "Plateau" },
    { value: "rivers", label: "Rivers" },
    { value: "sokoto", label: "Sokoto" },
    { value: "taraba", label: "Taraba" },
    { value: "yobe", label: "Yobe" },
    { value: "zamfara", label: "Zamfara" },
    { value: "fct", label: "Federal Capital Territory" },
  ];

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = data.sort((a, b) => a.name.common.localeCompare(b.name.common));
        setCountries(sortedCountries);
        setSelectedCountry(sortedCountries.find(c => c.cca2 === "IE") || sortedCountries[0]);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const pickupData = {
        lagos: ["Ikeja", "Victoria Island", "Lekki"],
        abuja: ["Garki", "Maitama", "Wuse"],
        rivers: ["Port Harcourt", "Bonny Island", "Eleme"],
      };
      setPickupStations(pickupData[selectedState] || []);
      setSelectedPickup("");
    }
  }, [selectedState]);

  return (
    <div className="w-full max-w-4xl">
  <h2 className="text-base font-medium mb-4">Select origin</h2>

  {/* Parent Container with Flexbox */}
  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
    {/* Country Selector */}
    <div className="relative w-full sm:w-1/3">
      <div
        onClick={() => setShowCountryDropdown(!showCountryDropdown)}
        className="flex items-center justify-between border p-3 cursor-pointer rounded-md"
      >
        <div className="flex items-center gap-2">
          {selectedCountry && (
            <img src={selectedCountry.flags?.png} alt="flag" className="w-6 h-4 rounded" />
          )}
          <span>{selectedCountry?.name?.common || "Select Country"}</span>
        </div>
        <ChevronDown className="h-5 w-5" />
      </div>

      {showCountryDropdown && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {countries.map((country) => (
            <div
              key={country.cca2}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => {
                setSelectedCountry(country);
                setShowCountryDropdown(false);
              }}
            >
              <img src={country.flags?.png} alt="flag" className="w-6 h-4 rounded" />
              <span>{country.name.common}</span>
            </div>
          ))}
        </div>
      )}
    </div>

    {/* State Selector */}
    <div className="relative w-full sm:w-1/3">
      <div
        onClick={() => setShowStateDropdown(!showStateDropdown)}
        className="flex items-center justify-between border p-3 cursor-pointer rounded-md"
      >
        <span>{selectedState ? stateOptions.find(s => s.value === selectedState)?.label : "Select State"}</span>
        <ChevronDown className="h-5 w-5" />
      </div>

      {showStateDropdown && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {stateOptions.map((state) => (
            <div
              key={state.value}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedState(state.value);
                setShowStateDropdown(false);
              }}
            >
              {state.label}
            </div>
          ))}
        </div>
      )}
    </div>

    {/* Pickup Station Selector */}
    <div className="relative w-full sm:w-1/3">
      <div
        onClick={() => setShowPickupDropdown(!showPickupDropdown)}
        className="flex items-center justify-between border p-3 cursor-pointer rounded-md"
      >
        <span>{selectedPickup || "Select Pickup Station"}</span>
        <ChevronDown className="h-5 w-5" />
      </div>

      {showPickupDropdown && pickupStations.length > 0 && (
        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          {pickupStations.map((station, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setSelectedPickup(station);
                setShowPickupDropdown(false);
              }}
            >
              {station}
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
        {selectedPickup && (
          <p className="text-sm font-semibold text-gray-500">Pickup at: {selectedPickup}</p>
        )}
      </div>
    </div>
  )}
</div>

  );
};

export default LocationSelectorMgt;
