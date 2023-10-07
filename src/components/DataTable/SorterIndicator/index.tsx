import { IoCaretUpSharp, IoCaretDownSharp } from 'react-icons/io5';

import style from './style.module.scss';

type SorterIndicatorProps = {
  disabled: boolean;
  asc: boolean | null;
  onSorterValueChange: (asc: boolean) => void;
  name: string;
};

const SorterIndicator = ({ disabled, asc, onSorterValueChange, name }: SorterIndicatorProps) => {
  function getClass() {
    if (!disabled) {
      if (asc === true) {
        return style.ASC;
      } else if (asc === false) {
        return style.DESC;
      }
    }
    return '';
  }

  function handleClickUp() {
    if (!disabled && asc != true) {
      onSorterValueChange(true);
    }
  }

  function handleClickDown() {
    if (!disabled && asc != false) {
      onSorterValueChange(false);
    }
  }

  return (
    <div className={style.indicatorGroup + ` ${getClass()}`}>
      <a role="button" onClick={handleClickUp} className="up" aria-label={name + ': sort ascending'}>
        <IoCaretUpSharp />
      </a>
      <a role="button" onClick={handleClickDown} className="down" aria-label={name + ': sort descending'}>
        <IoCaretDownSharp />
      </a>
    </div>
  );
};

export default SorterIndicator;
