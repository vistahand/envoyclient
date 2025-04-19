import { useState, useEffect } from "react";
import { useShipment } from "../context/ShipmentContext";
import { useNotifications } from "../context/NotificationContext";
import { HiOutlineArrowRight } from "react-icons/hi";
import { FiSearch } from "react-icons/fi";
import { TiArrowSortedDown } from "react-icons/ti";
import { SectionWrapper } from "../hoc";
import toast from "react-hot-toast";
import { pickup } from "../services/api";

const PickupLocation = ({ onNext, onPrev, selectedTab, senderTab }) => {
  const currentTab = selectedTab;
  const [countries, setCountries] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const {
    shipmentData,
    selectPickupLocation,
    loading: shipmentLoading,
  } = useShipment();
  const { addNotification } = useNotifications();

  // States for Nigeria
  const stateOptions = [
    { value: "", label: "All States" },
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

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        const sortedCountries = [...data].sort((a, b) =>
          a.name.common.localeCompare(b.name.common)
        );
        setCountries(sortedCountries);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };

    fetchCountries();
  }, []);

  // Fetch pickup locations
  useEffect(() => {
    const fetchPickupLocations = async () => {
      setLoading(true);
      try {
        console.log("Starting");
        pickup.fetchPickupLocation().then((response) => {
          console.log("Pickup locations response:", response);
          if (response && response.items) {
            // Transform the data structure to match component expectations
            const transformedLocations = response.items.map((item) => ({
              _id: item._id,
              name: item.name,
              address: item.address.street,
              city: item.address.city,
              state: item.address.state,
              country: item.address.country,
              postalCode: item.address.zipCode,
              contactPhone: item.contactPhone,
              contactEmail: item.contactEmail,
              operatingHours: formatOperatingHours(item.operatingHours),
              notes: item.notes,
            }));

            setLocations(transformedLocations);
            setFilteredLocations(transformedLocations);
          } else {
            throw new Error("Invalid response format");
          }
        });
      } catch (error) {
        console.error("Error fetching pickup locations:", error);
        toast.error("Error fetching pickup locations");
      } finally {
        setLoading(false);
      }
    };

    fetchPickupLocations();
  }, []); // Remove locations dependency to prevent infinite loop

  // Format operating hours for display
  const formatOperatingHours = (hours) => {
    if (!hours) return "Hours not specified";

    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const openDays = days.filter(
      (day) => hours[day]?.open && hours[day]?.close
    );

    if (openDays.length === 0) return "Hours not specified";

    if (
      openDays.length === 7 &&
      openDays.every(
        (day) =>
          hours[day].open === hours.monday.open &&
          hours[day].close === hours.monday.close
      )
    ) {
      return `Daily: ${hours.monday.open} - ${hours.monday.close}`;
    }

    // Just return monday hours as example
    if (hours.monday?.open && hours.monday?.close) {
      return `Mon: ${hours.monday.open} - ${hours.monday.close}`;
    }

    return "Hours vary";
  };

  // Filter locations based on search and filters
  useEffect(() => {
    let filtered = [...locations];

    // Filter by country
    if (selectedCountry) {
      filtered = filtered.filter((location) => {
        // First try to match directly
        if (location.country === selectedCountry) return true;

        // Then check if country code matches
        const countryObj = countries.find(
          (country) => country.cca2 === selectedCountry
        );
        if (countryObj && location.country === countryObj.name.common)
          return true;

        // Also check the other way around (location has name but we're filtering by code)
        const locationCountryObj = countries.find(
          (country) => country.name.common === location.country
        );
        if (locationCountryObj && locationCountryObj.cca2 === selectedCountry)
          return true;

        return false;
      });
    }

    // Filter by state
    if (selectedState) {
      filtered = filtered.filter((location) => {
        const locationState = location.state?.toLowerCase() || "";
        const searchState = selectedState.toLowerCase();

        // Exact match or contains
        if (
          locationState === searchState ||
          locationState.includes(searchState)
        )
          return true;

        // Check for other variations (with/without "State" suffix)
        if (
          locationState.includes(searchState + " state") ||
          searchState.includes(locationState + " state")
        )
          return true;

        // Check for state names that might be formatted differently
        if (
          locationState
            .replace(/\s+/g, "")
            .includes(searchState.replace(/\s+/g, ""))
        )
          return true;

        return false;
      });
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.address.toLowerCase().includes(query) ||
          loc.city.toLowerCase().includes(query)
      );
    }

    setFilteredLocations(filtered);
  }, [locations, selectedCountry, selectedState, searchQuery]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLocation) {
      addNotification({
        type: "error",
        title: "Error",
        message: "Please select a pickup location first.",
      });
      return;
    }

    try {
      if (!shipmentData?.id) {
        addNotification({
          type: "error",
          title: "Error",
          message: "No shipment ID found. Please try again from step 1.",
        });
        return;
      }

      // Structure data to match server schema - only sending location ID
      const pickupData = {
        pickup: {
          locationId: selectedLocation._id,
        },
      };

      const response = await selectPickupLocation(shipmentData?.id, pickupData);
      console.log(response);
      if (response?.success && response?.data?.shipment?._id) {
        addNotification({
          type: "success",
          title: "Success",
          message: "Pickup location selected successfully",
        });
        onNext(currentTab, senderTab);
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (err) {
      addNotification({
        type: "error",
        title: "Error",
        message: err.message || "Failed to update pickup location",
      });
    }
  };

  const handlePrevious = () => {
    onPrev(currentTab, senderTab);
  };

  const PickupLocationCard = ({ location, isSelected, onSelect }) => {
    return (
      <div
        className={`border rounded-lg p-4 cursor-pointer transition-all ${
          isSelected
            ? "border-primary bg-primary/5 shadow-md"
            : "border-main6 hover:border-primary/50"
        }`}
        onClick={() => onSelect(location)}
      >
        <div className="flex justify-between items-start">
          <div className="flex flex-col">
            <h3 className="font-semibold text-[16px] text-main2">
              {location.name}
            </h3>
            <p className="text-[14px] text-main6 mt-1">
              {location.address}, {location.city}
            </p>
            <p className="text-[14px] text-main6">
              {location.state},{" "}
              {countries.find(
                (country) =>
                  country.cca2 === location.country ||
                  country.name.common === location.country
              )?.name.common || location.country}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] text-main6">{location.operatingHours}</p>
            <p className="text-[13px] text-primary mt-1">
              {location.contactPhone}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="w-full flex md:min-h-[500px] ss:min-h-[450px] min-h-[600px]">
      <div className="flex items-center w-full flex-col">
        <div className="w-full flex flex-col gap-1.5 items-center">
          <h1 className="text-primary font-bold md:text-[40px] ss:text-[35px] text-[33px] tracking-tighter md:leading-[3.7rem] ss:leading-[3.5rem] leading-[2.5rem] text-center">
            Select a pickup location
          </h1>

          <p className="text-main6 md:text-[17px] ss:text-[16px] text-[15px] md:leading-[1.4rem] ss:leading-[1.4rem] leading-[1.2rem] tracking-tight font-medium text-center">
            Choose from our available pickup stations
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="md:w-[85%] w-full md:mt-8 ss:mt-8 mt-6"
        >
          {/* Filters */}
          <div className="grid md:grid-cols-3 ss:grid-cols-2 grid-cols-1 gap-4 mb-6">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="md:py-3.5 py-3 pl-10 pr-3.5 outline rounded-lg outline-[1px] outline-main6 focus:outline-primary w-full md:text-[14px] ss:text-[14px] text-[12px]"
              />
              <FiSearch className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-main6" />
            </div>

            {/* Country Filter */}
            <div className="relative">
              <div className="relative flex items-center">
                {selectedCountry && (
                  <img
                    src={
                      countries.find(
                        (country) => country.cca2 === selectedCountry
                      )?.flags?.png
                    }
                    alt="flag"
                    className="absolute md:left-3.5 left-3 w-10 h-[1.4rem] rounded-sm"
                  />
                )}
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className={`md:py-3.5 py-3 md:px-3.5 px-3 outline text-main2 rounded-lg
                      cursor-pointer md:text-[14px] font-bold ss:text-[14px] text-[12px] 
                      focus:outline-primary bg-transparent w-full custom-select outline-[1px] outline-main6
                      ${selectedCountry ? "md:pl-[3.8rem] pl-[3.6rem]" : ""}`}
                >
                  <option value="">All Countries</option>
                  {countries.map((country) => (
                    <option key={country.cca2} value={country.cca2}>
                      {country.name.common}
                    </option>
                  ))}
                </select>
                <div className="absolute md:right-3.5 right-3">
                  <TiArrowSortedDown className="text-main md:text-[16px] ss:text-[18px] text-[16px]" />
                </div>
              </div>
            </div>

            {/* State Filter - Only shown if Nigeria is selected */}
            {selectedCountry === "NG" && (
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="md:py-3.5 py-3 md:px-3.5 px-3 outline text-main2 rounded-lg
                      cursor-pointer md:text-[14px] ss:text-[14px] text-[12px] 
                      focus:outline-primary bg-transparent w-full custom-select outline-[1px] outline-main6"
                >
                  {stateOptions.map((state, index) => (
                    <option key={index} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
                <div className="absolute md:right-3.5 right-3">
                  <TiArrowSortedDown className="text-main md:text-[16px] ss:text-[18px] text-[16px]" />
                </div>
              </div>
            )}
          </div>

          {/* Locations List */}
          <div className="w-full">
            <h2 className="text-main2 font-bold md:text-[18px] ss:text-[16px] text-[15px] mb-4">
              Available Pickup Locations ({filteredLocations.length})
            </h2>

            {loading ? (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="text-center py-8 text-main6">
                No pickup locations found for your criteria. Please try
                different filters.
              </div>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                {filteredLocations.map((location) => (
                  <PickupLocationCard
                    key={location._id}
                    location={location}
                    isSelected={selectedLocation?._id === location._id}
                    onSelect={setSelectedLocation}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex w-full items-center justify-center md:gap-5 ss:gap-5 gap-3 md:flex-row ss:flex-row flex-col">
            <button
              type="button"
              className="bg-none text-[13px] py-3.5 px-14
                      text-primary rounded-full grow2 cursor-pointer
                      items-center justify-center border border-primary
                      md:flex ss:flex hidden"
              onClick={handlePrevious}
            >
              <p className="font-semibold">Go back</p>
            </button>

            <button
              type="submit"
              className="bg-primary text-[13px] py-3.5 px-14 flex
                      text-white rounded-full grow4 cursor-pointer
                      items-center justify-center gap-3 mobbut"
              disabled={shipmentLoading || !selectedLocation}
            >
              <p>{shipmentLoading ? "Processing..." : "Next"}</p>
              {!shipmentLoading && (
                <HiOutlineArrowRight className="text-[14px]" />
              )}
            </button>

            <button
              type="button"
              className="bg-none text-[13px] py-3.5 px-14
                      text-primary rounded-full grow2 cursor-pointer
                      items-center justify-center border border-primary
                      md:hidden ss:hidden flex mobbut"
              onClick={handlePrevious}
            >
              <p className="font-semibold">Go back</p>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SectionWrapper(PickupLocation, "");
