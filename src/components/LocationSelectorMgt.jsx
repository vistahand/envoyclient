import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Search, Filter, Loader2 } from "lucide-react";

// Helper function to get authentication token
const getAuthToken = () => {
  return localStorage.getItem("authToken");
};

const LocationSelectorFilter = ({ onFilterChange }) => {
  // Filter states
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState("");
  const [selectedPickup, setSelectedPickup] = useState("");
  
  // Data states
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [pickupLocations, setPickupLocations] = useState([]);
  
  // UI states
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [pickupDropdownOpen, setPickupDropdownOpen] = useState(false);
  
  // Search states
  const [countrySearch, setCountrySearch] = useState("");
  const [stateSearch, setStateSearch] = useState("");
  const [pickupSearch, setPickupSearch] = useState("");
  
  // Loading states
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingPickups, setLoadingPickups] = useState(false);
  
  // Error state
  const [error, setError] = useState(null);

  // Refs for dropdown click-outside handling
  const countryDropdownRef = useRef(null);
  const stateDropdownRef = useRef(null);
  const pickupDropdownRef = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL ;

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setCountryDropdownOpen(false);
      }
      if (stateDropdownRef.current && !stateDropdownRef.current.contains(event.target)) {
        setStateDropdownOpen(false);
      }
      if (pickupDropdownRef.current && !pickupDropdownRef.current.contains(event.target)) {
        setPickupDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch countries on component mount
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        // Try to fetch from our API first
        try {
          const response = await fetch(`${apiUrl}/api/admin/countries`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.items)) {
              // Format countries for internal use
              const formattedCountries = data.items.map(country => ({
                code: country.code,
                name: country.name,
                flag: country.flagUrl || `https://flagcdn.com/w20/${country.code.toLowerCase()}.png`
              }));
              
              setCountries(formattedCountries.sort((a, b) => a.name.localeCompare(b.name)));
              setError(null);
              return;
            }
          }
        } catch (apiError) {
          console.warn("Failed to fetch countries from API, falling back to backup source");
        }
        
        // Fallback to RestCountries API
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,flags');
        const data = await response.json();
        
        const formattedCountries = data.map(country => ({
          code: country.cca2,
          name: country.name.common,
          flag: country.flags.png
        }));
        
        setCountries(formattedCountries.sort((a, b) => a.name.localeCompare(b.name)));
        setError(null);
        
      } catch (err) {
        console.error("Error fetching countries:", err);
        setError("Failed to load countries. Please try again later.");
      } finally {
        setLoadingCountries(false);
      }
    };
    
    fetchCountries();
  }, [apiUrl]);

  // Fetch states when a country is selected
  useEffect(() => {
    if (!selectedCountry) return;

    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        // Try API endpoint first
        try {
          const response = await fetch(`${apiUrl}/api/admin/states`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ countryCode: selectedCountry.code })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.items)) {
              setStates(data.items.map(state => ({
                name: state.name,
                code: state.code
              })));
              return;
            }
          }
        } catch (apiError) {
          console.warn("Failed to fetch states from API, using fallback");
        }
        
        // Fallback to CountriesNow API
        const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ country: selectedCountry.name })
        });
        
        const data = await response.json();
        
        if (data.error === false && data.data && Array.isArray(data.data.states)) {
          setStates(data.data.states);
        } else {
          // If that fails too, use sample data based on common states
          const sampleStates = getSampleStatesForCountry(selectedCountry.code);
          setStates(sampleStates);
        }
        
      } catch (err) {
        console.error("Error fetching states:", err);
        // Provide sample states as fallback
        const sampleStates = getSampleStatesForCountry(selectedCountry.code);
        setStates(sampleStates);
      } finally {
        setLoadingStates(false);
      }
    };
    
    fetchStates();
  }, [selectedCountry, apiUrl]);

  // Fetch pickup locations when a state is selected
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;

    const fetchPickupLocations = async () => {
      setLoadingPickups(true);
      try {
        const token = getAuthToken();
        
        if (!token) {
          throw new Error("Authentication token not found");
        }
        
        // Try API endpoint
        try {
          const response = await fetch(`${apiUrl}/api/admin/pickup-cities`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              country: selectedCountry.code,
              state: typeof selectedState === 'object' ? selectedState.name : selectedState
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data && Array.isArray(data.cities)) {
              setPickupLocations(data.cities);
              return;
            }
          }
        } catch (apiError) {
          console.warn("Failed to fetch pickup locations from API, using fallback");
        }
        
        // Fallback to sample data
        const sampleLocations = getSamplePickupLocations(
          selectedCountry.code, 
          typeof selectedState === 'object' ? selectedState.name : selectedState
        );
        setPickupLocations(sampleLocations);
        
      } catch (err) {
        console.error("Error fetching pickup locations:", err);
        const sampleLocations = getSamplePickupLocations(
          selectedCountry.code, 
          typeof selectedState === 'object' ? selectedState.name : selectedState
        );
        setPickupLocations(sampleLocations);
      } finally {
        setLoadingPickups(false);
      }
    };
    
    fetchPickupLocations();
  }, [selectedCountry, selectedState, apiUrl]);

  // Helper function for sample states data
  const getSampleStatesForCountry = (countryCode) => {
    const statesByCountry = {
      'NG': [
        { name: 'Lagos', code: 'LAG' }, 
        { name: 'Abuja', code: 'FCT' }, 
        { name: 'Rivers', code: 'RIV' },
        { name: 'Imo', code: 'IMO' },
        { name: 'Abia', code: 'ABI' },
        { name: 'Enugu', code: 'ENU' },
        { name: 'Kaduna', code: 'KAD' },
        { name: 'Kano', code: 'KAN' }
      ],
      'IE': [
        { name: 'Dublin', code: 'D' },
        { name: 'Cork', code: 'C' },
        { name: 'Galway', code: 'G' },
        { name: 'Limerick', code: 'L' }
      ],
      'GB': [
        { name: 'London', code: 'LDN' },
        { name: 'Manchester', code: 'MAN' },
        { name: 'Birmingham', code: 'BIR' },
        { name: 'Liverpool', code: 'LIV' }
      ],
      'US': [
        { name: 'California', code: 'CA' },
        { name: 'New York', code: 'NY' },
        { name: 'Texas', code: 'TX' },
        { name: 'Florida', code: 'FL' }
      ]
    };
    
    return statesByCountry[countryCode] || 
      [{ name: 'State 1', code: 'S1' }, { name: 'State 2', code: 'S2' }, { name: 'State 3', code: 'S3' }];
  };

  // Helper function for sample pickup locations
  const getSamplePickupLocations = (countryCode, stateName) => {
    const normalizedStateName = typeof stateName === 'string' ? 
      stateName.toLowerCase().replace(/\s+/g, '') : '';
    
    const pickupLocations = {
      'NG': {
        'lagos': ['Ikeja', 'Victoria Island', 'Lekki', 'Surulere', 'Yaba'],
        'abuja': ['Garki', 'Maitama', 'Wuse', 'Asokoro', 'Gwarinpa'],
        'rivers': ['Port Harcourt', 'Bonny Island', 'Eleme', 'Okrika'],
        'imo': ['Owerri', 'Orlu', 'Okigwe', 'Mbaise', 'Oguta']
      },
      'IE': {
        'dublin': ['City Center', 'Docklands', 'Rathmines', 'Ballsbridge'],
        'cork': ['City Center', 'Blackpool', 'Douglas', 'Ballincollig']
      },
      'GB': {
        'london': ['Central London', 'Canary Wharf', 'Camden', 'Kensington'],
        'manchester': ['City Center', 'Northern Quarter', 'Salford', 'Didsbury']
      },
      'US': {
        'california': ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento'],
        'newyork': ['Manhattan', 'Brooklyn', 'Queens', 'Bronx']
      }
    };
    
    // Try to find pickup locations for this country and state
    if (countryCode in pickupLocations) {
      const stateLocations = Object.keys(pickupLocations[countryCode])
        .find(key => key.includes(normalizedStateName) || normalizedStateName.includes(key));
      
      if (stateLocations) {
        return pickupLocations[countryCode][stateLocations];
      }
    }
    
    // Default pickup locations if nothing specific found
    return ['Downtown', 'Airport', 'Main Office', 'Shopping Center', 'Business District'];
  };

  // Handle country selection
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setSelectedState("");
    setSelectedPickup("");
    setCountryDropdownOpen(false);
    setCountrySearch("");
    
    // Update parent component with filter change
    onFilterChange({
      country: country.name,
      state: "",
      pickup: ""
    });
  };

  // Handle state selection
  const handleStateSelect = (state) => {
    const stateName = typeof state === 'object' ? state.name : state;
    setSelectedState(state);
    setSelectedPickup("");
    setStateDropdownOpen(false);
    setStateSearch("");
    
    // Update parent component with filter change
    onFilterChange({
      country: selectedCountry.name,
      state: stateName,
      pickup: ""
    });
  };

  // Handle pickup location selection
  const handlePickupSelect = (pickup) => {
    setSelectedPickup(pickup);
    setPickupDropdownOpen(false);
    setPickupSearch("");
    
    // Update parent component with filter change
    onFilterChange({
      country: selectedCountry.name,
      state: typeof selectedState === 'object' ? selectedState.name : selectedState,
      pickup: pickup
    });
  };

  // Clear all filters
  const handleClearAll = () => {
    setSelectedCountry(null);
    setSelectedState("");
    setSelectedPickup("");
    setCountrySearch("");
    setStateSearch("");
    setPickupSearch("");
    
    // Update parent component with cleared filters
    onFilterChange({
      country: "",
      state: "",
      pickup: ""
    });
  };

  // Clear country filter and its dependent filters
  const handleClearCountry = (e) => {
    if (e) e.stopPropagation();
    setSelectedCountry(null);
    setSelectedState("");
    setSelectedPickup("");
    
    // Update parent component with cleared filters
    onFilterChange({
      country: "",
      state: "",
      pickup: ""
    });
  };

  // Clear state filter and pickup filter
  const handleClearState = (e) => {
    if (e) e.stopPropagation();
    setSelectedState("");
    setSelectedPickup("");
    
    // Update parent component with cleared filters
    onFilterChange({
      country: selectedCountry?.name || "",
      state: "",
      pickup: ""
    });
  };

  // Clear pickup filter only
  const handleClearPickup = (e) => {
    if (e) e.stopPropagation();
    setSelectedPickup("");
    
    // Update parent component with cleared filters
    onFilterChange({
      country: selectedCountry?.name || "",
      state: typeof selectedState === 'object' ? selectedState.name : selectedState,
      pickup: ""
    });
  };

  // Filter countries by search term
  const filteredCountries = countrySearch
    ? countries.filter(country => 
        country.name.toLowerCase().includes(countrySearch.toLowerCase()))
    : countries;

  // Filter states by search term
  const filteredStates = stateSearch
    ? states.filter(state => {
        const stateName = typeof state === 'object' ? state.name : state;
        return stateName.toLowerCase().includes(stateSearch.toLowerCase());
      })
    : states;

  // Filter pickup locations by search term
  const filteredPickups = pickupSearch
    ? pickupLocations.filter(pickup => 
        pickup.toLowerCase().includes(pickupSearch.toLowerCase()))
    : pickupLocations;

  // Check if any filter is active
  const isAnyFilterActive = selectedCountry || selectedState || selectedPickup;

  return (
    <div className="w-full bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-medium">Location Filter</h2>
        </div>
        
        {isAnyFilterActive && (
          <button 
            onClick={handleClearAll}
            className="text-primary text-sm hover:bg-blue-50 px-3 py-1 rounded-md flex items-center space-x-1"
          >
            <X className="h-4 w-4" />
            <span>Clear all filters</span>
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Country Selector */}
        <div className="relative" ref={countryDropdownRef}>
          <div 
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors"
            onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
          >
            <div className="flex items-center space-x-2 truncate">
              {selectedCountry ? (
                <>
                  <img 
                    src={selectedCountry.flag} 
                    alt={`${selectedCountry.name} flag`} 
                    className="w-5 h-4 rounded-sm object-cover"
                  />
                  <span className="truncate text-gray-800">{selectedCountry.name}</span>
                  {selectedCountry && (
                    <button
                      onClick={handleClearCountry}
                      className="text-gray-400 hover:text-gray-600 ml-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </>
              ) : (
                <span className="text-gray-500">Select Country</span>
              )}
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${countryDropdownOpen ? "transform rotate-180" : ""}`} />
          </div>
          
          {countryDropdownOpen && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search countries..."
                    className="w-full p-2 pl-8 border border-gray-200 rounded-md text-sm"
                    value={countrySearch}
                    onChange={(e) => setCountrySearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="p-1">
                {loadingCountries ? (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Loading countries...</span>
                  </div>
                ) : filteredCountries.length > 0 ? (
                  filteredCountries.map(country => (
                    <div
                      key={country.code}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleCountrySelect(country)}
                    >
                      <img
                        src={country.flag}
                        alt={`${country.name} flag`}
                        className="w-5 h-4 rounded-sm object-cover"
                      />
                      <span className="text-sm">{country.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No matching countries found</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* State Selector */}
        <div className="relative" ref={stateDropdownRef}>
          <div 
            className={`flex items-center justify-between p-3 border rounded-lg ${
              selectedCountry 
                ? "border-gray-200 cursor-pointer hover:border-primary transition-colors" 
                : "border-gray-100 bg-gray-50 cursor-not-allowed"
            }`}
            onClick={() => selectedCountry && setStateDropdownOpen(!stateDropdownOpen)}
          >
            <div className="flex items-center space-x-2 truncate">
              {selectedState ? (
                <>
                  <span className="truncate text-gray-800">
                    {typeof selectedState === 'object' ? selectedState.name : selectedState}
                  </span>
                  <button
                    onClick={handleClearState}
                    className="text-gray-400 hover:text-gray-600 ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <span className="text-gray-500">
                  {selectedCountry ? "Select State" : "Select country first"}
                </span>
              )}
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${stateDropdownOpen ? "transform rotate-180" : ""}`} />
          </div>
          
          {stateDropdownOpen && selectedCountry && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search states..."
                    className="w-full p-2 pl-8 border border-gray-200 rounded-md text-sm"
                    value={stateSearch}
                    onChange={(e) => setStateSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="p-1">
                {loadingStates ? (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Loading states...</span>
                  </div>
                ) : filteredStates.length > 0 ? (
                  filteredStates.map((state, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handleStateSelect(state)}
                    >
                      {typeof state === 'object' ? state.name : state}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No states available</div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Pickup Location Selector */}
        <div className="relative" ref={pickupDropdownRef}>
          <div 
            className={`flex items-center justify-between p-3 border rounded-lg ${
              selectedState 
                ? "border-gray-200 cursor-pointer hover:border-primary transition-colors" 
                : "border-gray-100 bg-gray-50 cursor-not-allowed"
            }`}
            onClick={() => selectedState && setPickupDropdownOpen(!pickupDropdownOpen)}
          >
            <div className="flex items-center space-x-2 truncate">
              {selectedPickup ? (
                <>
                  <span className="truncate text-gray-800">{selectedPickup}</span>
                  <button
                    onClick={handleClearPickup}
                    className="text-gray-400 hover:text-gray-600 ml-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <span className="text-gray-500">
                  {!selectedCountry 
                    ? "Select country first"
                    : !selectedState
                      ? "Select state first"
                      : "Select pickup location"}
                </span>
              )}
            </div>
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${pickupDropdownOpen ? "transform rotate-180" : ""}`} />
          </div>
          
          {pickupDropdownOpen && selectedState && (
            <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-100">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search pickup locations..."
                    className="w-full p-2 pl-8 border border-gray-200 rounded-md text-sm"
                    value={pickupSearch}
                    onChange={(e) => setPickupSearch(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>
              
              <div className="p-1">
                {loadingPickups ? (
                  <div className="flex items-center justify-center p-4 text-gray-500">
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    <span>Loading pickup locations...</span>
                  </div>
                ) : filteredPickups.length > 0 ? (
                  filteredPickups.map((pickup, index) => (
                    <div
                      key={index}
                      className="p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                      onClick={() => handlePickupSelect(pickup)}
                    >
                      {pickup}
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-gray-500">No pickup locations available</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Active Filters Display */}
      {isAnyFilterActive && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-sm font-medium text-gray-600 mb-2">Active filters:</div>
          <div className="flex flex-wrap gap-2">
            {selectedCountry && (
              <div className="bg-blue-50 text-primary px-3 py-1.5 rounded-full text-sm flex items-center">
                <img
                  src={selectedCountry.flag}
                  alt={`${selectedCountry.name} flag`}
                  className="w-4 h-3 mr-2 rounded-sm object-cover"
                />
                <span>{selectedCountry.name}</span>
                <button 
                  onClick={handleClearCountry}
                  className="ml-2 text-gray-500 hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {selectedState && (
              <div className="bg-blue-50 text-primary px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>State: {typeof selectedState === 'object' ? selectedState.name : selectedState}</span>
                <button 
                  onClick={handleClearState}
                  className="ml-2 text-gray-500 hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            {selectedPickup && (
              <div className="bg-blue-50 text-primary px-3 py-1.5 rounded-full text-sm flex items-center">
                <span>Pickup: {selectedPickup}</span>
                <button 
                  onClick={handleClearPickup}
                  className="ml-2 text-gray-500 hover:text-primary"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="mt-2 p-2 text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationSelectorFilter;