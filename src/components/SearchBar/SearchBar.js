import React from 'react';
import './SearchBar.css';

const brandColor = '#59A127';
const customStyles = {
    control: (base, state) => ({
        ...base,
        borderColor: state.isFocused ? brandColor : base.borderColor,
        boxShadow: state.isFocused ? null : null,
        '&:hover': {
            borderColor: state.isFocused ? brandColor : base.borderColor
        }
    })
};

const SearchBar = props => (
    <div className="SearchBar">

        onChange={selectedStation => props.onChange(selectedStation)}
        options={props.options}
        placeholder={props.placeholder}
        noOptionsMessage={props.noOptionsMessage}

        ignoreCase: true,
        ignoreAccents: false,
        matchFrom: 'start'

        styles={customStyles}

    </div>
);

export default SearchBar;