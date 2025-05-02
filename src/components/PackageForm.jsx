import React, { forwardRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { TiArrowSortedDown } from "react-icons/ti";
import { TbTrashX } from "react-icons/tb";
import { packageOptions } from "../constants";
import PackageCard from "./PackageCard";

const PackageForm = forwardRef(
  (
    {
      onCalculateCost,
      onSubmit,
      onPrev,
      isCalculating,
      calculatedCost,
      meetsMinimumPayment,
      currentTab,
      loading,
    },
    ref
  ) => {
    const formik = useFormik({
      initialValues: {
        packages: [
          {
            packageType: "",
            customPackageType: "",
            weight: "",
            length: "",
            width: "",
            height: "",
            isFragile: false,
            isPerishable: false,
            isHazardous: false,
          },
        ],
      },
      validationSchema: Yup.object().shape({
        packages: Yup.array().of(
          Yup.object().shape({
            packageType: Yup.string().required("Package type is required"),
            customPackageType: Yup.string().when("packageType", {
              is: "other",
              then: () =>
                Yup.string().required("Please specify the package type"),
              otherwise: () => Yup.string(),
            }),
            weight: Yup.number()
              .typeError("Package weight must be a number")
              .required("Package weight is required")
              .positive("Weight must be greater than 0"),
            length: Yup.number()
              .typeError("Package length must be a number")
              .required("Package length is required")
              .positive("Length must be greater than 0"),
            width: Yup.number()
              .typeError("Package width must be a number")
              .required("Package width is required")
              .positive("Width must be greater than 0"),
            height: Yup.number()
              .typeError("Package height must be a number")
              .required("Package height is required")
              .positive("Height must be greater than 0"),
          })
        ),
      }),
      onSubmit: (values) => onSubmit(values.packages),
    });

    const addPackage = () => {
      formik.setFieldValue("packages", [
        ...formik.values.packages,
        {
          packageType: "",
          customPackageType: "",
          weight: "",
          length: "",
          width: "",
          height: "",
          isFragile: false,
          isPerishable: false,
          isHazardous: false,
        },
      ]);
    };

    const removePackage = (index) => {
      formik.setFieldValue(
        "packages",
        formik.values.packages.filter((_, i) => i !== index)
      );
    };

    return (
      <form
        ref={ref}
        onSubmit={formik.handleSubmit}
        className="md:w-[70%] w-full md:mt-5 ss:mt-4 mt-3"
      >
        <div className="flex flex-col w-full items-center gap-8">
          {formik.values.packages.map((pkg, index) => (
            <div
              key={index}
              className="flex flex-col w-full items-center gap-4"
            >
              <div className="w-full flex justify-between items-center">
                <h2 className="text-main2 font-semibold md:text-[20px] ss:text-[20px] text-[17px] tracking-tight">
                  Package {index + 1}
                </h2>

                {formik.values.packages.length > 1 && (
                  <div
                    className="flex items-center md:gap-2 ss:gap-2 gap-1.5 cursor-pointer grow6"
                    onClick={() => removePackage(index)}
                  >
                    <TbTrashX className="md:text-[20px] ss:text-[20px] text-[17px] text-realRed" />
                    <p className="md:text-[15px] ss:text-[15px] text-[12px] font-semibold text-realRed">
                      Remove Package
                    </p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-3 ss:grid-cols-3 grid-cols-2 md:gap-5 ss:gap-5 gap-4 w-full">
                <div className="relative flex flex-col col-span-2">
                  <div className="relative flex items-center">
                    <div className="w-full relative">
                      <select
                        name={`packages[${index}].packageType`}
                        value={pkg.packageType}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className={`md:py-3.5 py-3 md:px-3.5 px-3 outline 
                          md:rounded-lg rounded-md cursor-pointer md:text-[14px] 
                          ss:text-[14px] text-[12px] focus:outline-primary
                          bg-transparent w-full custom-select outline-[1px] 
                          ${
                            formik.touched.packages &&
                            formik.errors.packages &&
                            formik.touched.packages[index] &&
                            formik.errors.packages[index] &&
                            formik.touched.packages[index].packageType &&
                            formik.errors.packages[index].packageType
                              ? "outline-mainRed"
                              : "outline-main6"
                          }`}
                      >
                        <option value="" disabled>
                          Select the type of package
                        </option>
                        {packageOptions.map((option, optionIndex) => (
                          <option key={optionIndex} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="absolute md:right-3.5 right-3">
                      <TiArrowSortedDown className="text-main md:text-[16px] ss:text-[18px] text-[16px]" />
                    </div>
                  </div>

                  <p className="text-mainRed md:text-[12px] flex justify-end ss:text-[12px] text-[11px] mt-1 font-medium">
                    {formik.touched.packages &&
                      formik.errors.packages &&
                      formik.touched.packages[index] &&
                      formik.errors.packages[index] &&
                      formik.touched.packages[index].packageType &&
                      formik.errors.packages[index].packageType}
                  </p>
                </div>

                {pkg.packageType === "other" && (
                  <div className="relative flex flex-col col-span-2">
                    <input
                      type="text"
                      name={`packages[${index}].customPackageType`}
                      placeholder="Specify Package Type"
                      value={pkg.customPackageType || ""}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="md:py-3.5 py-3 md:px-3.5 px-3 outline outline-[1px] outline-main6 text-black md:rounded-lg rounded-md md:text-[14px] ss:text-[14px] text-[12px] focus:outline-primary bg-transparent w-full"
                    />
                  </div>
                )}

                <div className="relative flex flex-col">
                  <input
                    type="text"
                    name={`packages[${index}].weight`}
                    placeholder="Weight (kg)"
                    value={pkg.weight}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="md:py-3.5 py-3 md:px-3.5 px-3 outline outline-[1px] outline-main6 text-black md:rounded-lg rounded-md md:text-[14px] ss:text-[14px] text-[12px] focus:outline-primary bg-transparent w-full"
                  />
                </div>

                {/* Add similar inputs for length, width, and height */}
              </div>
            </div>
          ))}

          <div className="w-full">
            <button
              type="button"
              onClick={addPackage}
              className="inline-flex items-center gap-3 grow8 cursor-pointer"
            >
              Add Another Package
            </button>
          </div>

          <div className="w-full flex justify-center mt-6">
            <button
              type="button"
              onClick={() => onCalculateCost(formik.values.packages)}
              disabled={isCalculating}
              className="bg-primary text-[13px] py-3.5 px-8 text-white rounded-full grow4 cursor-pointer flex items-center justify-center"
            >
              {isCalculating ? "Calculating..." : "Calculate Shipping Cost"}
            </button>
          </div>

          {calculatedCost !== null && (
            <div className="w-full flex flex-col items-center bg-primary1 p-5 rounded-xl">
              <h3 className="font-bold text-[18px] text-main2 mb-2">
                Estimated Shipping Cost
              </h3>
              <p className="text-primary md:text-[25px] ss:text-[25px] text-[22px] font-bold">
                {currentTab === "international" ? "€" : "₦"}{" "}
                {calculatedCost.toLocaleString()}.00
              </p>
            </div>
          )}

          <div className="w-full flex justify-center mt-6">
            <button
              type="submit"
              disabled={loading}
              className={`bg-primary text-[13px] py-3.5 px-14 flex
                text-white rounded-full grow4
                items-center justify-center gap-3 w-full md:w-auto
                ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                <>
                  <p>Continue</p>
                  <HiOutlineArrowRight className="text-[14px]" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    );
  }
);

export default PackageForm;
