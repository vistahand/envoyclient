
const renderFormFields = () => (
    <div className="flex flex-col gap-4">
      {renderItemTypeSelector()}
      
      <FormField label="Item Name">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="py-2 px-3 w-full border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </FormField>

      {/* TV Size dropdown - only show when TV is selected */}
      {formData.name === "TV" && (
        <SelectField
          label="TV Size (inches)"
          name="tvSize"
          value={formData.tvSize}
          onChange={handleInputChange}
          options={tvSizes.map(size => ({ value: size, label: `${size}"` }))}
        />
      )}

      {/* Car details - only show when Car is selected */}
      {formData.name === "Car" && (
        <>
          <InputField
            label="Car Make"
            name="carMake"
            value={formData.carMake}
            onChange={handleInputChange}
          />
          <InputField
            label="Car Model"
            name="carModel"
            value={formData.carModel}
            onChange={handleInputChange}
          />
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Price"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          disabled={formData.isQuotable || formData.isCustom || formData.name === "TV" || formData.name === "Car"}
        />

        <SelectField
          label="Currency"
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          options={currencyOptions}
        />
      </div>

      {/* Hide additional options when TV or Car is selected */}
      {formData.name !== "TV" && formData.name !== "Car" && (
        <>
          <div className="grid grid-cols-2 gap-4">
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-requiresSize`}
              name="requiresSize"
              checked={formData.requiresSize}
              onChange={handleInputChange}
              label="Requires Size"
            />
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-requiresDetails`}
              name="requiresDetails"
              checked={formData.requiresDetails}
              onChange={handleInputChange}
              label="Requires Details"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-isCustom`}
              name="isCustom"
              checked={formData.isCustom}
              onChange={handleInputChange}
              label="Custom Package"
            />
            <CheckboxField
              id={`${showEditModal ? "edit" : "add"}-isQuotable`}
              name="isQuotable"
              checked={formData.isQuotable}
              onChange={handleInputChange}
              label="Requires Quote"
            />
          </div>
        </>
      )}

      {/* Conditionally show info messages without duplication */}
      {formData.name === "Car" && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>Car items will require a quote. Team will contact the customer. Price will be set to 0.</p>
        </div>
      )}
      
      {formData.name === "TV" && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>TV items will be treated as custom packages. Price will be set to 0.</p>
        </div>
      )}
      
      {formData.name !== "Car" && formData.name !== "TV" && formData.isQuotable && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>This item will show "Team will contact you" to the customer. Price will be set to 0.</p>
        </div>
      )}

      {formData.name !== "Car" && formData.name !== "TV" && formData.isCustom && (
        <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-800 border border-blue-200">
          <p>This item will be treated as a custom package. Price will be set to 0.</p>
        </div>
      )}
    </div>
  );
