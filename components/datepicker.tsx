import { Field, FieldProps } from "formik";
import DateView from "react-datepicker";

interface MonthYearDatePickerProps {
  name: string;
}

export function MonthYearDatePicker({ name }: MonthYearDatePickerProps) {
  return (
    <Field name={name}>
      {({ form, field }: FieldProps) => {
        const { setFieldValue } = form;
        const { value } = field;

        return (
          <DateView
            {...field}
            selected={value}
            onChange={(val: Date) => setFieldValue(name, val)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            renderCustomHeader={({ date, changeYear }) => (
              <CustomYearDropdownPicker date={date} onChange={changeYear} />
            )}
          />
        );
      }}
    </Field>
  );
}

interface CustomYearDropdownPickerProps {
  date: Date;
  onChange: (year: number) => void;
}

function CustomYearDropdownPicker({
  date,
  onChange,
}: CustomYearDropdownPickerProps) {
  const currentYear = new Date().getFullYear();
  const years = rangeReverse(currentYear - 20, currentYear).map((y) => ({
    label: y.toString(),
    value: y,
  }));

  return (
    <select
      value={date.getFullYear()}
      onChange={(event) => {
        onChange(parseInt(event.target.value, 10));
      }}
    >
      {years.map((y) => {
        return (
          <option key={y.value} value={y.value}>
            {y.label}
          </option>
        );
      })}
    </select>
  );
}

function rangeReverse(start: number, end: number) {
  const arr = [];
  for (let i = end; i > start; i--) {
    arr.push(i);
  }
  return arr;
}
