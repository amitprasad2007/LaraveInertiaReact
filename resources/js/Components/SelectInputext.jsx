import React from 'react';
import Select from 'react-select';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        borderColor: state.isFocused ? 'indigo-500' : 'gray-300',
        boxShadow: state.isFocused ? '0 0 0 1px rgba(99, 102, 241, 0.5)' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? 'indigo-500' : 'gray-400',
        },
        backgroundColor: 'white',
        color: 'black',
        padding: '0.5rem', // Added padding for larger input area
        fontSize: '1rem', // Adjusted font size
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: 'white',
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? 'rgba(99, 102, 241, 0.5)' : 'white',
        color: state.isSelected ? 'white' : 'black',
        '&:hover': {
            backgroundColor: state.isSelected ? 'rgba(99, 102, 241, 0.5)' : 'rgba(229, 231, 235, 0.5)',
        },
    }),
    singleValue: (provided) => ({
        ...provided,
        color: 'black',
    }),
    input: (provided) => ({
        ...provided,
        color: 'black',
        padding: '0.5rem', // Added padding for larger input area
        fontSize: '1rem', // Adjusted font size
    }),
    placeholder: (provided) => ({
        ...provided,
        color: 'rgba(107, 114, 128, 0.5)',
    }),
    dropdownIndicator: (provided) => ({
        ...provided,
        color: 'rgba(107, 114, 128, 0.5)',
        '&:hover': {
            color: 'rgba(99, 102, 241, 0.5)',
        },
    }),
    indicatorSeparator: (provided) => ({
        ...provided,
        backgroundColor: 'rgba(229, 231, 235, 0.5)',
    }),
    clearIndicator: (provided) => ({
        ...provided,
        color: 'rgba(107, 114, 128, 0.5)',
        '&:hover': {
            color: 'rgba(99, 102, 241, 0.5)',
        },
    }),
};

const SelectInputext = ({ name, id, className, onChange, projects }) => {


    const options = projects.data.map(project => ({
        value: project.id,
        label: project.name
    }));
    const handleChange = selectedOption => {
        onChange({ target: { name, value: selectedOption ? selectedOption.value : '' } });
    };

    return (
        <Select
            id={id}
            name={name}
            options={options}
            onChange={handleChange}
            className={"mt-1 block w-full " + className}
            classNamePrefix="react-select"
            styles={customStyles}
        />
    );
};

export default SelectInputext;
