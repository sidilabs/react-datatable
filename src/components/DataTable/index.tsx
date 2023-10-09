import { ReactNode, useState } from 'react';

import SorterIndicator from './SorterIndicator';

import style from './style.module.scss';

type HtmlProps = { [key: string]: string | number | { [key: string]: string | number } };

type Field = {
  key: string;
  label?: ReactNode;
  filter?: boolean;
  sorter?: boolean;
  _td?: HtmlProps;
  _th?: HtmlProps;
  _thFilter?: HtmlProps;
  _style?: { [key: string]: string | number };
};

type SorterValue = {
  column: string;
  asc: boolean;
};
const emptyJson = {};
type SimpleObject = typeof emptyJson;

type DataTableProps<T> = {
  border?: boolean;
  fields: Field[] | string[];
  items: T[];
  hover?: boolean;
  striped?: boolean;
  columnFilter?: boolean;
  columnFilterSlot?: { [key: string]: ReactNode };
  sorter?: boolean;
  onSorterValueChange?: (value: SorterValue) => void;
  clickableRows?: boolean;
  onRowClick?: (item: T, index: number, evt: React.MouseEvent) => void;
  scopedSlots?: { [key: string]: (item: T) => ReactNode };
  addTableClasses?: string | string[];
  rowPropsFn?: (item: T) => SimpleObject;
};

const emptyFn = () => {
  /**/
};

export const DataTable = function <T>({
  fields,
  items,
  columnFilter = false,
  border = true,
  columnFilterSlot = {},
  sorter = false,
  onSorterValueChange = emptyFn,
  scopedSlots = {},
  clickableRows = false,
  onRowClick = undefined,
  rowPropsFn,
}: DataTableProps<T>) {
  const [sorterValue, setSorterValue] = useState<SorterValue>({ column: '', asc: true });

  function handleSorterValueChange(value: SorterValue) {
    setSorterValue(value);
    onSorterValueChange(value);
  }

  function getLabelKey(key: string) {
    const words = key
      .replace(/([A-Z][a-z])/g, ' $1')
      .replace(/\./g, ' ')
      .trim()
      .split(' ');
    return words.reduce((previous, current) => previous + ' ' + capitalizeFirst(current), '').trim();
  }

  function capitalizeFirst(word: string) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  function getValue(value: ReactNode) {
    if (typeof value === 'boolean') {
      return value + '';
    }
    return value;
  }

  return (
    <div className={style.scrollTable}>
      <table className={`table table-striped table-hover ${border && 'table-bordered'}`}>
        <thead>
          <tr className={style.rowHeader + ` ${!sorter ? style.noFilter : ''}`}>
            {fields.map((_field) => {
              const field = typeof _field === 'string' ? { key: _field, label: getLabelKey(_field) } : _field;
              const shouldShowSorter = sorter && field.sorter !== false;
              return (
                <th key={'header-' + field.key} {...(field._th || {})}>
                  <div style={{ height: !shouldShowSorter ? '36px' : '' }}>
                    <div className="d-inline">{field.label || capitalizeFirst(field.key)}</div>
                    {shouldShowSorter && (
                      <SorterIndicator
                        disabled={!items || (items && items.length === 0)}
                        name={field.key}
                        asc={sorterValue.column == field.key ? sorterValue.asc : null}
                        onSorterValueChange={(asc: boolean) => handleSorterValueChange({ column: field.key, asc })}
                      />
                    )}
                  </div>
                </th>
              );
            })}
          </tr>
          {columnFilter && Object.keys(columnFilterSlot).length > 0 && (
            <tr className={style.rowFilter}>
              {fields.map((_field) => {
                const field = typeof _field === 'string' ? { key: _field, label: getLabelKey(_field) } : _field;
                return (
                  <th key={'filter-' + field.key} {...(field._thFilter || {})}>
                    {columnFilterSlot[field.key] || ''}
                  </th>
                );
              })}
            </tr>
          )}
        </thead>
        <tbody style={clickableRows && items?.length ? { cursor: 'pointer' } : {}}>
          {items?.length ? (
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            items.map((item: any, rowIndex) => (
              <tr
                key={JSON.stringify(item)}
                onClick={
                  onRowClick
                    ? (e: React.MouseEvent) => {
                        onRowClick(item as T, rowIndex, e);
                      }
                    : undefined
                }
                {...(rowPropsFn ? rowPropsFn(item as T) : {})}
              >
                {fields.map((_field) => {
                  const field = typeof _field === 'string' ? { key: _field, label: getLabelKey(_field) } : _field;
                  const _td = field._td || {};
                  return (
                    <td key={'data-' + field.key} {..._td}>
                      {getValue(scopedSlots[field.key] ? scopedSlots[field.key](item as T) : item[field.key])}
                    </td>
                  );
                })}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Object.keys(fields).length}>
                <div className="text-center my-5">
                  <h2>
                    No items
                    <svg
                      width="30"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      className="c-icon c-icon-custom-size text-danger mb-2"
                      role="img"
                    >
                      <path
                        fill="var(--ci-primary-color, currentColor)"
                        d="M425.706,86.294A240,240,0,0,0,86.294,425.705,240,240,0,0,0,425.706,86.294ZM256,48A207.1,207.1,0,0,1,391.528,98.345L98.345,391.528A207.1,207.1,0,0,1,48,256C48,141.309,141.309,48,256,48Zm0,416a207.084,207.084,0,0,1-134.986-49.887l293.1-293.1A207.084,207.084,0,0,1,464,256C464,370.691,370.691,464,256,464Z"
                        className="ci-primary"
                      ></path>
                    </svg>
                  </h2>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
