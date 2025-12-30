import { useState, useEffect, useRef } from "react";
import styles from "./option-dropdown.module.css";
import { IoChevronDown } from "react-icons/io5";

interface OptionDropdownProps {
  options: string[];
  selectedOption: string;
  onSelectOption: (option: string) => void;
  placeholder?: string;
}

export function OptionDropdown({
  options,
  selectedOption,
  onSelectOption,
  placeholder = "Selecione uma opção",
}: OptionDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span>{selectedOption || placeholder}</span>
        <IoChevronDown
          size={20}
          className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`}
        />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            <button
              key={index}
              className={styles.dropdownItem}
              onClick={() => {
                onSelectOption(option);
                setIsOpen(false);
              }}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
