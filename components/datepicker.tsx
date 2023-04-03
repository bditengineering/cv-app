import { inputClasses } from "@ui/input";
import { Field } from "formik";
import DateView from "react-datepicker";

export function MonthYearDatePicker({ name, ...rest }: any) {
  return (
    <Field name={name}>
      {({ form, field }: any) => {
        const { setFieldValue } = form;
        const { value } = field;

        return (
          <DateView
            {...field}
            {...rest}
            className={inputClasses({ className: "w-auto text-gray-900" })}
            selected={value}
            onChange={(val: any) => setFieldValue(name, val)}
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

function CustomYearDropdownPicker({ date, onChange }: any) {
  const currentYear = new Date().getFullYear();
  const years = rangeReverse(currentYear - 20, currentYear).map((y) => ({
    label: y.toString(),
    value: y,
  }));

  return (
    <select
      value={date.getFullYear()}
      onChange={(event) => {
        onChange(event.target.value);
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
