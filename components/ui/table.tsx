import { cva } from "class-variance-authority";

interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

interface TableCellProps extends BaseComponentProps {
  align?: "left" | "center" | "right";
  header?: boolean;
}

export const tableContainerClasses = cva(
  "w-full my-4 border bg-white border-gray-200 rounded-xl overflow-hidden shadow-sm",
);

export const TableContainer = ({ children, className }: BaseComponentProps) => (
  <div className={tableContainerClasses({ className })}>{children}</div>
);

export const Table = ({ children }: BaseComponentProps) => (
  <table className="w-full border-0">{children}</table>
);

export const tableRowClasses = cva("border-b border-b-gray-200", {
  variants: {
    header: {
      true: "bg-gray-50",
      false: "[&:last-child]:border-b-0",
    },
  },
});

export const TableRow = ({
  children,
  className,
  header = false,
}: BaseComponentProps & { header?: boolean }) => (
  <tr className={tableRowClasses({ className, header })}>{children}</tr>
);

export const tableCellClasses = cva(
  "px-6 border-0 text-gray-600 leading-normal",
  {
    variants: {
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      header: {
        true: "py-3 text-sm font-medium",
        false: "py-4 text-base",
      },
    },
    defaultVariants: {
      header: false,
    },
  },
);

export const TableCell = ({
  children,
  className,
  header,
  align = header === true ? "center" : "left",
}: TableCellProps) => (
  <td className={tableCellClasses({ align, className, header })}>{children}</td>
);
