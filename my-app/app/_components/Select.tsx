interface SelectProps<T> {
  label?: string;
  items: string[] | number[] | { [key: string]: string | number }[];
  onChange: (value: T) => void;
  value?: T | null;
}

const termMap: { [key: string]: string } = {
  FA: "Fall",
  SP: "Spring",
  SU: "Summer",
};

// simple select component for now, generalizes object so that it can iterate through it like
// a list and ignore the key name...
// takes in a label, list of objects used to display each option, and an onChange function
// which will just be a useState and change the associated state to the selected value
export default function Select<T>({
  label, // label for select box
  items, // list of options
  onChange, // callback when selection changes
  value, // currently selected value
}: SelectProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      <label>{label}</label>
      <select
        className="border w-80"
        value={String(value ?? "")}
        onChange={(e) => {
          onChange(e.target.value as T);
        }}
      >
        {items.length <= 0 ? (
          <option key={"none"} value={""}>
            No options available
          </option>
        ) : (
          items.map((item, index) => {
            let val;
            if (typeof item == "string" || typeof item == "number") {
              val = item;
            } else if (item && typeof item == "object") {
              val = Object.values(item)[0];
            } else {
              return null;
            }
            //?? means if val is null default to index as key
            //conditional rendering if label is "Terms", map value to full term name otherwise just show value
            return (
              <option key={String(val ?? index)} value={String(val)}>
                {label == "Terms" ? termMap[String(val)] : String(val)}
              </option>
            );
          })
        )}
      </select>
    </div>
  );
}
