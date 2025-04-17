import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

// Helper function to get authentication token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

// Updated LocationSelectorMgt component with API integration
const LocationSelectorMgt = ({ onFilterChange }) => {
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [showStateDropdown, setShowStateDropdown] = useState(false);

  const [pickupStations, setPickupStations] = useState([]);
  const [selectedPickup, setSelectedPickup] = useState("");
  const [showPickupDropdown, setShowPickupDropdown] = useState(false);
  
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingPickups, setLoadingPickups] = useState(false);
  const [error, setError] = useState(null);

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        // Try using the API endpoint if available
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/countries`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.items)) {
              // Format for our internal use
              const formattedCountries = data.items.map(country => ({
                cca2: country.code,
                name: { common: country.name },
                flags: { png: country.flagUrl || `https://flagcdn.com/w20/${country.code.toLowerCase()}.png` }
              }));
              
              const sortedCountries = formattedCountries.sort((a, b) => 
                a.name.common.localeCompare(b.name.common)
              );
              
              setCountries(sortedCountries);
              
              // Set default countries (IE or NG if available)
              const defaultCountry = sortedCountries.find(c => c.cca2 === "IE") || 
                                    sortedCountries.find(c => c.cca2 === "NG") ||
                                    (sortedCountries.length > 0 ? sortedCountries[0] : null);
              
              if (defaultCountry) {
                setSelectedCountry(defaultCountry);
                onFilterChange({
                  country: defaultCountry.name.common,
                  state: "",
                  pickup: ""
                });
              }
              
              return; // Exit if we successfully got data from our API
            }
          }
        } catch (apiError) {
          console.warn("Could not fetch countries from API, falling back to RestCountries:", apiError);
        }
        
        // Fallback to RestCountries API
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = data.sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
        
        // Start with Ireland as default
        const ireland = sortedCountries.find((c) => c.cca2 === "IE");
        if (ireland) {
          setSelectedCountry(ireland);
          
          // Notify parent about initial filter
          onFilterChange({
            country: ireland.name.common,
            state: "",
            pickup: ""
          });
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoadingCountries(false);
      }
    };
    
    fetchCountries();
  }, []);

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    
    // Reset state and pickup when country changes
    setSelectedState("");
    setSelectedPickup("");
    setPickupStations([]);
    
    // Update filter
    onFilterChange({
      country: country.name.common,
      state: "",
      pickup: ""
    });
  };

  // Fetch states when country changes
  useEffect(() => {
    const fetchStates = async () => {
      if (!selectedCountry) return;
      
      setLoadingStates(true);
      setStates([]);
      
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        // Try using the API endpoint if available
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/states`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ 
              countryCode: selectedCountry.cca2 
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.items)) {
              // Format states for our internal use
              const formattedStates = data.items.map(state => ({
                name: state.name,
                code: state.code
              }));
              
              setStates(formattedStates);
              return; // Exit if we successfully got data from our API
            }
          }
        } catch (apiError) {
          console.warn("Could not fetch states from API, falling back to alternate source:", apiError);
        }
        
        // Fallback to CountriesNow API
        const response = await fetch(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ country: selectedCountry.name.common }),
          }
        );
        const data = await response.json();
        if (data?.data?.states) {
          setStates(data.data.states);
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error("Error fetching states:", error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    
    fetchStates();
  }, [selectedCountry]);

  // Handle state selection
  const handleStateSelect = (state) => {
    const stateName = typeof state === 'object' ? state.name : state;
    setSelectedState(stateName);
    setShowStateDropdown(false);
    setSelectedPickup(""); // Reset pickup when state changes
    
    // Update filter when state changes
    onFilterChange({
      country: selectedCountry?.name.common || "",
      state: stateName,
      pickup: ""
    });
  };

  // Fetch pickup locations when state changes
  useEffect(() => {
    const fetchPickupLocations = async () => {
      if (!selectedCountry || !selectedState) return;
      
      setLoadingPickups(true);
      setPickupStations([]);
      
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.");
        }
        
        // Try using the API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/pickup-cities`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            country: selectedCountry.cca2,
            state: selectedState
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data && Array.isArray(data.cities)) {
            setPickupStations(data.cities);
          } else {
            // Fallback to static data if API returns empty
            setPickupStationsFromStaticData();
          }
        } else {
          // Fallback to static data if API fails
          setPickupStationsFromStaticData();
        }
      } catch (error) {
        console.error("Error fetching pickup locations:", error);
        // Fallback to static data
        setPickupStationsFromStaticData();
      } finally {
        setLoadingPickups(false);
      }
    };
    
    // Helper function for static pickup data
    const setPickupStationsFromStaticData = () => {
      const pickupData = {
        lagos: ["Ikeja", "Victoria Island", "Lekki"],
        abuja: ["Garki", "Maitama", "Wuse"],
        rivers: ["Port Harcourt", "Bonny Island", "Eleme"],
        dublin: ["City Center", "Docklands", "Rathmines"],
        belfast: ["City Center", "Titanic Quarter", "Queens Quarter"],
        cork: ["City Center", "Blackpool", "Douglas"],
        london: ["Central London", "Canary Wharf", "Camden"],
        manchester: ["City Center", "Northern Quarter", "Salford"],
        imo: ["Owerri", "Orlu", "Okigwe"],
        adamawa: ["Yola", "Mubi", "Numan"],
        "akwa-ibom": ["Uyo", "Eket", "Ikot Ekpene"],
      };
      
      const formattedState = selectedState.toLowerCase().replace(/\s+/g, '_');
      const stations = pickupData[formattedState] || [];
      setPickupStations(stations);
    };
    
    fetchPickupLocations();
  }, [selectedCountry, selectedState]);

  // Handle pickup selection
  const handlePickupChange = (pickup) => {
    setSelectedPickup(pickup);
    setShowPickupDropdown(false);
    
    onFilterChange({
      country: selectedCountry?.name.common || "",
      state: selectedState,
      pickup: pickup
    });
  };

  if (loadingCountries) {
    return <div className="w-full py-4 text-gray-500">Loading location filters...</div>;
  }

  if (error) {
    return <div className="w-full py-4 text-red-500">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl">
      <h2 className="text-base font-medium mb-4">Filter shipments by location</h2>
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4">
        {/* Country Selector */}
        <div className="relative w-full sm:w-1/3">
          <div
            onClick={() => setShowCountryDropdown(!showCountryDropdown)}
            className="flex items-center justify-between border p-3 cursor-pointer rounded-md"
          >
            <div className="flex items-center gap-2">
              {selectedCountry && (
                <img
                  src={selectedCountry.flags?.png}
                  alt="flag"
                  className="w-6 h-4 rounded"
                />
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
                  onClick={() => handleCountrySelect(country)}
                >
                  <img
                    src={country.flags?.png}
                    alt="flag"
                    className="w-6 h-4 rounded"
                  />
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
            <span>{selectedState || "Select State"}</span>
            <ChevronDown className="h-5 w-5" />
          </div>

          {showStateDropdown && (
            <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {loadingStates ? (
                <div className="px-4 py-2 text-gray-500">Loading states...</div>
              ) : states.length > 0 ? (
                states.map((state, idx) => (
                  <div
                    key={idx}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleStateSelect(state.name)}
                  >
                    {state.name}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No states available</div>
              )}
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

          {showPickupDropdown && (
            <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
              {loadingPickups ? (
                <div className="px-4 py-2 text-gray-500">Loading pickup stations...</div>
              ) : pickupStations.length > 0 ? (
                pickupStations.map((station, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePickupChange(station)}
                  >
                    {station}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2 text-gray-500">No pickup stations available for this location</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {selectedCountry && (
        <div className="mt-6">
          <div className="w-full flex gap-6 items-center flex-wrap">
            <div className="rounded-lg px-6 py-4 bg-gray-100 flex gap-2 items-center">
              <img
                src={selectedCountry.flags?.png}
                alt={`${selectedCountry.name.common} flag`}
                className="w-10 h-5 rounded"
              />
              <p className="text-sm font-bold text-gray-800">
                {selectedCountry.name.common}
              </p>
            </div>
            {selectedState && (
              <div className="rounded-lg px-6 py-4 bg-gray-100 flex gap-2 items-center">
                <p className="text-sm font-bold text-gray-800">{selectedState}</p>
              </div>
            )}
            {selectedPickup && (
              <div className="rounded-lg px-6 py-4 bg-gray-100 flex gap-2 items-center">
                <p className="text-sm font-semibold text-gray-800">
                  Pickup: {selectedPickup}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelectorMgt;