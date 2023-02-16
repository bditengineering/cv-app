import { Field } from "formik";
import DateView from "react-datepicker";

export default function MonthYearDatePicker({ name, ...rest }: any) {
  return (
    <div>
      <Field name={name}>
        {({ form, field }: any) => {
          const { setFieldValue } = form;
          const { value } = field;

          return (
            <DateView
              {...field}
              {...rest}
              selected={value}
              onChange={(val: any) => setFieldValue(name, val)}
              dateFormat="MMMM yyyy"
              showMonthYearPicker
              renderCustomHeader={({ date, changeYear }) =>
                CustomYearDropdownPicker({ date, changeYear })
              }
            />
          );
        }}
      </Field>
    </div>
  );
}

function CustomYearDropdownPicker({ date, changeYear }: any) {
  const currentYear = new Date().getFullYear();
  const years = range(currentYear - 20, currentYear).map((y) => ({
    label: y.toString(),
    value: y,
  }));

  return (
    <select
      value={date.getFullYear()}
      onChange={(event) => {
        changeYear(event.target.value);
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

function range(start: number, end: number) {
  const arr = [];
  for (let i = start; i <= end; i++) {
    arr.push(i);
  }
  return arr.reverse();
}
