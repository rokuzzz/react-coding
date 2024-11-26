import React, { useState } from 'react';
import AutocompleteTextbox from './helper-components/autocomplete-textbox';
import AutocompleteSuggestion from './helper-components/autocomplete-suggestion';
import apiClient from './helper-components/api-client';

const AutocompleteInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (value.trim() !== '') {
      try {
        const results = await apiClient.search(value);
        setSuggestions(results);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div>
      <AutocompleteTextbox
        onChange={handleInputChange}
        value={inputValue}
        aria-label='Search for an option'
      />
      {suggestions.length > 0 && (
        <div role='listbox' className='suggestions-list'>
          {suggestions.map((suggestion, index) => (
            <AutocompleteSuggestion key={index} role='option'>
              {suggestion}
            </AutocompleteSuggestion>
          ))}
        </div>
      )}
    </div>
  );
};

export default AutocompleteInput;
