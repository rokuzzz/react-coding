import React, { useState, useEffect } from 'react';
import AutocompleteTextbox from './helper-components/autocomplete-textbox';
import AutocompleteSuggestion from './helper-components/autocomplete-suggestion';
import apiClient from './helper-components/api-client';

const AutocompleteInput = () => {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    let isCancelled = false; // Flag to prevent state updates after component unmounts or input changes

    if (inputValue.trim() !== '') {
      const fetchSuggestions = async () => {
        try {
          const results = await apiClient.search(inputValue);
          if (!isCancelled) {
            setSuggestions(results);
          }
        } catch (error) {
          if (!isCancelled) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
          }
        }
      };

      fetchSuggestions();
    } else {
      // Clear suggestions when input is empty
      setSuggestions([]);
    }

    return () => {
      isCancelled = true; // Mark as cancelled if effect is cleaned up
    };
  }, [inputValue]);

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
