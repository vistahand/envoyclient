import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, X, Search, Filter, Loader2, Menu } from "lucide-react";
import { HiOutlineDotsHorizontal, HiOutlineSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// Mobile-Optimized LocationSelectorFilter Component
const LocationSelectorFilter = ({ onFilterChange, shipments }) => {
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
  const [isFilterCollapsed, setIsFilterCollapsed] = useState(
    window.innerWidth < 768
  );

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

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsFilterCollapsed(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Extract available countries from shipments data
  useEffect(() => {
    if (!shipments || !Array.isArray(shipments)) {
      console.error("Invalid shipments data");
      return;
    }

    // Extract unique countries from shipments
    const extractedCountries = new Map();

    shipments.forEach((shipment) => {
      const country = shipment.origin?.country;
      if (country && !extractedCountries.has(country)) {
        extractedCountries.set(country, {
          code: country,
          name: country,
          flag: `https://flagcdn.com/w20/${country.toLowerCase()}.png`,
        });
      }
    });

    const countryList = Array.from(extractedCountries.values());
    setCountries(countryList.sort((a, b) => a.name.localeCompare(b.name)));
    setLoadingCountries(false);
  }, [shipments]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target)
      ) {
        setCountryDropdownOpen(false);
      }
      if (
        stateDropdownRef.current &&
        !stateDropdownRef.current.contains(event.target)
      ) {
        setStateDropdownOpen(false);
      }
      if (
        pickupDropdownRef.current &&
        !pickupDropdownRef.current.contains(event.target)
      ) {
        setPickupDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Extract states when a country is selected
  useEffect(() => {
    if (!selectedCountry || !shipments || !Array.isArray(shipments)) return;

    setLoadingStates(true);

    try {
      // Extract unique states for the selected country
      const stateSet = new Set();

      shipments.forEach((shipment) => {
        if (
          shipment.origin?.country === selectedCountry.code &&
          shipment.pickup?.address?.state
        ) {
          stateSet.add(shipment.pickup.address.state);
        }
      });

      const extractedStates = Array.from(stateSet).map((state) => ({
        name: state,
        code: state.replace(/\s+/g, "").substring(0, 3).toUpperCase(),
      }));

      if (extractedStates.length > 0) {
        setStates(extractedStates.sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        // Fallback to sample states
        const sampleStates = getSampleStatesForCountry(selectedCountry.code);
        setStates(sampleStates);
      }
    } catch (err) {
      console.error("Error extracting states:", err);
      const sampleStates = getSampleStatesForCountry(selectedCountry.code);
      setStates(sampleStates);
    } finally {
      setLoadingStates(false);
    }
  }, [selectedCountry, shipments]);

  // Extract pickup locations when a state is selected
  useEffect(() => {
    if (
      !selectedCountry ||
      !selectedState ||
      !shipments ||
      !Array.isArray(shipments)
    )
      return;

    setLoadingPickups(true);

    try {
      const stateName =
        typeof selectedState === "object" ? selectedState.name : selectedState;

      // Find unique pickup locations for the selected country and state
      const pickupSet = new Set();

      shipments.forEach((shipment) => {
        if (
          shipment.origin?.country === selectedCountry.code &&
          shipment.pickup?.address?.state === stateName &&
          shipment.pickup?.address?.city
        ) {
          pickupSet.add(shipment.pickup.address.city);
        }

        // Also check pickup name if available
        if (
          shipment.origin?.country === selectedCountry.code &&
          shipment.pickup?.address?.state === stateName &&
          shipment.pickup?.name
        ) {
          pickupSet.add(shipment.pickup.name);
        }
      });

      const extractedPickups = Array.from(pickupSet);

      if (extractedPickups.length > 0) {
        setPickupLocations(extractedPickups.sort());
      } else {
        // Fallback to sample pickup locations
        const sampleLocations = getSamplePickupLocations(
          selectedCountry.code,
          stateName
        );
        setPickupLocations(sampleLocations);
      }
    } catch (err) {
      console.error("Error extracting pickup locations:", err);
      const sampleLocations = getSamplePickupLocations(
        selectedCountry.code,
        typeof selectedState === "object" ? selectedState.name : selectedState
      );
      setPickupLocations(sampleLocations);
    } finally {
      setLoadingPickups(false);
    }
  }, [selectedCountry, selectedState, shipments]);

  // Helper functions for sample data
  const getSampleStatesForCountry = (countryCode) => {
    const statesByCountry = {
      NG: [
        { name: "Lagos", code: "LAG" },
        { name: "Abuja", code: "FCT" },
        { name: "Rivers", code: "RIV" },
        { name: "Imo", code: "IMO" },
      ],
      IE: [
        { name: "Dublin", code: "D" },
        { name: "Cork", code: "C" },
      ],
      GB: [
        { name: "London", code: "LDN" },
        { name: "Manchester", code: "MAN" },
      ],
      US: [
        { name: "California", code: "CA" },
        { name: "New York", code: "NY" },
      ],
    };

    return (
      statesByCountry[countryCode] || [
        { name: "State 1", code: "S1" },
        { name: "State 2", code: "S2" },
      ]
    );
  };

  const getSamplePickupLocations = (countryCode, stateName) => {
    const normalizedStateName =
      typeof stateName === "string"
        ? stateName.toLowerCase().replace(/\s+/g, "")
        : "";

    const pickupLocations = {
      NG: {
        lagos: ["Ikeja", "Victoria Island", "Lekki"],
        abuja: ["Garki", "Maitama", "Wuse"],
      },
      IE: {
        dublin: ["City Center", "Docklands", "Rathmines"],
      },
      GB: {
        london: ["Central London", "Canary Wharf", "Camden"],
      },
      US: {
        california: ["Los Angeles", "San Francisco", "San Diego"],
      },
    };

    if (countryCode in pickupLocations) {
      const stateLocations = Object.keys(pickupLocations[countryCode]).find(
        (key) =>
          key.includes(normalizedStateName) || normalizedStateName.includes(key)
      );

      if (stateLocations) {
        return pickupLocations[countryCode][stateLocations];
      }
    }

    return ["Downtown", "Airport", "Main Office"];
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
      pickup: "",
    });
  };

  // Handle state selection
  const handleStateSelect = (state) => {
    const stateName = typeof state === "object" ? state.name : state;
    setSelectedState(state);
    setSelectedPickup("");
    setStateDropdownOpen(false);
    setStateSearch("");

    // Update parent component with filter change
    onFilterChange({
      country: selectedCountry.name,
      state: stateName,
      pickup: "",
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
      state:
        typeof selectedState === "object" ? selectedState.name : selectedState,
      pickup: pickup,
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
      pickup: "",
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
      pickup: "",
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
      pickup: "",
    });
  };

  // Clear pickup filter only
  const handleClearPickup = (e) => {
    if (e) e.stopPropagation();
    setSelectedPickup("");

    // Update parent component with cleared filters
    onFilterChange({
      country: selectedCountry?.name || "",
      state:
        typeof selectedState === "object" ? selectedState.name : selectedState,
      pickup: "",
    });
  };

  // Filter countries by search term
  const filteredCountries = countrySearch
    ? countries.filter((country) =>
        country.name.toLowerCase().includes(countrySearch.toLowerCase())
      )
    : countries;

  // Filter states by search term
  const filteredStates = stateSearch
    ? states.filter((state) => {
        const stateName = typeof state === "object" ? state.name : state;
        return stateName.toLowerCase().includes(stateSearch.toLowerCase());
      })
    : states;

  // Filter pickup locations by search term
  const filteredPickups = pickupSearch
    ? pickupLocations.filter((pickup) =>
        pickup.toLowerCase().includes(pickupSearch.toLowerCase())
      )
    : pickupLocations;

  // Check if any filter is active
  const isAnyFilterActive = selectedCountry || selectedState || selectedPickup;

  return (
    <div className="w-full bg-white p-3 md:p-4 rounded-lg border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => setIsFilterCollapsed(!isFilterCollapsed)}
          className="flex items-center gap-2 text-base font-medium md:hidden"
        >
          <Filter className="h-4 w-4 text-gray-500" />
          <h2 className="text-sm">Location Filter</h2>
          <ChevronDown
            className={`h-4 w-4 text-gray-400 transition-transform ${
              isFilterCollapsed ? "" : "transform rotate-180"
            }`}
          />
        </button>

        <div className="hidden md:flex items-center space-x-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <h2 className="text-base font-medium">Location Filter</h2>
        </div>

        {isAnyFilterActive && (
          <button
            onClick={handleClearAll}
            className="text-primary text-xs md:text-sm hover:bg-blue-50 px-2 py-1 rounded-md flex items-center"
          >
            <X className="h-3 w-3 md:h-4 md:w-4 mr-1" />
            <span className="hidden sm:inline">Clear all filters</span>
            <span className="sm:hidden">Clear</span>
          </button>
        )}
      </div>

      {/* Filter content - collapsible on mobile */}
      <div className={`${isFilterCollapsed ? "hidden" : "block"} md:block`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {/* Country Selector */}
          <div className="relative" ref={countryDropdownRef}>
            <div
              className="flex items-center justify-between p-2 md:p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-primary transition-colors"
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
            >
              <div className="flex items-center space-x-2 truncate">
                {selectedCountry ? (
                  <>
                    <img
                      src={selectedCountry.flag}
                      alt={`${selectedCountry.name} flag`}
                      className="w-4 h-3 md:w-5 md:h-4 rounded-sm object-cover"
                    />
                    <span className="truncate text-gray-800 text-sm md:text-base">
                      {selectedCountry.name}
                    </span>
                    {selectedCountry && (
                      <button
                        onClick={handleClearCountry}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-3 w-3 md:h-4 md:w-4" />
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500 text-sm md:text-base">
                    Select Country
                  </span>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${
                  countryDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {countryDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search countries..."
                      className="w-full p-1.5 md:p-2 pl-6 md:pl-8 border border-gray-200 rounded-md text-xs md:text-sm"
                      value={countrySearch}
                      onChange={(e) => setCountrySearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Search className="absolute left-1.5 md:left-2 top-2 md:top-2.5 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                  </div>
                </div>

                <div className="p-1">
                  {loadingCountries ? (
                    <div className="flex items-center justify-center p-3 md:p-4 text-gray-500 text-xs md:text-sm">
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                      <span>Loading countries...</span>
                    </div>
                  ) : filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <div
                        key={country.code}
                        className="flex items-center space-x-2 p-1.5 md:p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                        onClick={() => handleCountrySelect(country)}
                      >
                        <img
                          src={country.flag}
                          alt={`${country.name} flag`}
                          className="w-4 h-3 md:w-5 md:h-4 rounded-sm object-cover"
                        />
                        <span className="text-xs md:text-sm">
                          {country.name}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 md:p-3 text-center text-gray-500 text-xs md:text-sm">
                      No matching countries found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* State Selector */}
          <div className="relative" ref={stateDropdownRef}>
            <div
              className={`flex items-center justify-between p-2 md:p-3 border rounded-lg ${
                selectedCountry
                  ? "border-gray-200 cursor-pointer hover:border-primary transition-colors"
                  : "border-gray-100 bg-gray-50 cursor-not-allowed"
              }`}
              onClick={() =>
                selectedCountry && setStateDropdownOpen(!stateDropdownOpen)
              }
            >
              <div className="flex items-center space-x-2 truncate">
                {selectedState ? (
                  <>
                    <span className="truncate text-gray-800 text-sm md:text-base">
                      {typeof selectedState === "object"
                        ? selectedState.name
                        : selectedState}
                    </span>
                    <button
                      onClick={handleClearState}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm md:text-base">
                    {selectedCountry ? "Select State" : "Select country first"}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${
                  stateDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {stateDropdownOpen && selectedCountry && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search states..."
                      className="w-full p-1.5 md:p-2 pl-6 md:pl-8 border border-gray-200 rounded-md text-xs md:text-sm"
                      value={stateSearch}
                      onChange={(e) => setStateSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Search className="absolute left-1.5 md:left-2 top-2 md:top-2.5 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                  </div>
                </div>

                <div className="p-1">
                  {loadingStates ? (
                    <div className="flex items-center justify-center p-3 md:p-4 text-gray-500 text-xs md:text-sm">
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                      <span>Loading states...</span>
                    </div>
                  ) : filteredStates.length > 0 ? (
                    filteredStates.map((state, index) => (
                      <div
                        key={index}
                        className="p-1.5 md:p-2 hover:bg-gray-50 rounded-md cursor-pointer text-xs md:text-sm"
                        onClick={() => handleStateSelect(state)}
                      >
                        {typeof state === "object" ? state.name : state}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 md:p-3 text-center text-gray-500 text-xs md:text-sm">
                      No states available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pickup Location Selector */}
          <div className="relative" ref={pickupDropdownRef}>
            <div
              className={`flex items-center justify-between p-2 md:p-3 border rounded-lg ${
                selectedState
                  ? "border-gray-200 cursor-pointer hover:border-primary transition-colors"
                  : "border-gray-100 bg-gray-50 cursor-not-allowed"
              }`}
              onClick={() =>
                selectedState && setPickupDropdownOpen(!pickupDropdownOpen)
              }
            >
              <div className="flex items-center space-x-2 truncate">
                {selectedPickup ? (
                  <>
                    <span className="truncate text-gray-800 text-sm md:text-base">
                      {selectedPickup}
                    </span>
                    <button
                      onClick={handleClearPickup}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-3 w-3 md:h-4 md:w-4" />
                    </button>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm md:text-base">
                    {!selectedCountry
                      ? "Select country first"
                      : !selectedState
                      ? "Select state first"
                      : "Select pickup location"}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${
                  pickupDropdownOpen ? "transform rotate-180" : ""
                }`}
              />
            </div>

            {pickupDropdownOpen && selectedState && (
              <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 md:max-h-60 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white p-2 border-b border-gray-100">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search pickup locations..."
                      className="w-full p-1.5 md:p-2 pl-6 md:pl-8 border border-gray-200 rounded-md text-xs md:text-sm"
                      value={pickupSearch}
                      onChange={(e) => setPickupSearch(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Search className="absolute left-1.5 md:left-2 top-2 md:top-2.5 h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                  </div>
                </div>

                <div className="p-1">
                  {loadingPickups ? (
                    <div className="flex items-center justify-center p-3 md:p-4 text-gray-500 text-xs md:text-sm">
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5 mr-2 animate-spin" />
                      <span>Loading pickup locations...</span>
                    </div>
                  ) : filteredPickups.length > 0 ? (
                    filteredPickups.map((pickup, index) => (
                      <div
                        key={index}
                        className="p-1.5 md:p-2 hover:bg-gray-50 rounded-md cursor-pointer text-xs md:text-sm"
                        onClick={() => handlePickupSelect(pickup)}
                      >
                        {pickup}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 md:p-3 text-center text-gray-500 text-xs md:text-sm">
                      No pickup locations available
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {isAnyFilterActive && (
        <div
          className={`${
            isFilterCollapsed ? "block" : "mt-3"
          } md:mt-4 pt-2 md:pt-3 ${
            isFilterCollapsed ? "" : "border-t border-gray-100"
          }`}
        >
          <div className="text-xs md:text-sm font-medium text-gray-600 mb-1 md:mb-2">
            Active filters:
          </div>
          <div className="flex flex-wrap gap-1 md:gap-2">
            {selectedCountry && (
              <div className="bg-blue-50 text-primary px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm flex items-center">
                <img
                  src={selectedCountry.flag}
                  alt={`${selectedCountry.name} flag`}
                  className="w-3 h-2 md:w-4 md:h-3 mr-1 md:mr-2 rounded-sm object-cover"
                />
                <span className="truncate max-w-20 md:max-w-full">
                  {selectedCountry.name}
                </span>
                <button
                  onClick={handleClearCountry}
                  className="ml-1 md:ml-2 text-gray-500 hover:text-primary"
                >
                  <X className="h-2 w-2 md:h-3 md:w-3" />
                </button>
              </div>
            )}

            {selectedState && (
              <div className="bg-blue-50 text-primary px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm flex items-center">
                <span className="truncate max-w-20 md:max-w-full">
                  {typeof selectedState === "object"
                    ? selectedState.name
                    : selectedState}
                </span>
                <button
                  onClick={handleClearState}
                  className="ml-1 md:ml-2 text-gray-500 hover:text-primary"
                >
                  <X className="h-2 w-2 md:h-3 md:w-3" />
                </button>
              </div>
            )}

            {selectedPickup && (
              <div className="bg-blue-50 text-primary px-2 md:px-3 py-1 md:py-1.5 rounded-full text-xs md:text-sm flex items-center">
                <span className="truncate max-w-20 md:max-w-full">
                  {selectedPickup}
                </span>
                <button
                  onClick={handleClearPickup}
                  className="ml-1 md:ml-2 text-gray-500 hover:text-primary"
                >
                  <X className="h-2 w-2 md:h-3 md:w-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 text-xs md:text-sm text-red-600 bg-red-50 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default LocationSelectorFilter;
