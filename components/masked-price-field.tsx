import TextField from "@mui/material/TextField";
import { NumericFormat } from "react-number-format";

interface PriceFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function PriceField({ label, value, onChange }: PriceFieldProps) {
  return (
    <NumericFormat
      value={value}
      customInput={TextField}
      label={label}
      size="small"
      fullWidth
      thousandSeparator="."
      decimalSeparator=","
      prefix="R$ "
      allowNegative={false}
      // raw numeric string goes to parent
      onValueChange={(values) => onChange(values.value)} 
    />
  );
}
