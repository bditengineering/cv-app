import { cx } from "class-variance-authority";
import Button from "@ui/button";
import { TrashCan } from "@ui/icons";

interface RemoveInputActionProps {
  disabled?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}

const RemoveInputAction = ({ disabled, onClick }: RemoveInputActionProps) => (
  <Button
    className={cx([
      // add left border and remove radius
      // + add 1px margin (width of border) so container's border is not overlapped on hover and focus
      "m-px rounded-l-none border-l border-l-gray-300",
      "focus:m-0 focus:border focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
    ])}
    disabled={disabled}
    onClick={onClick}
    prefix={<TrashCan className="h-5 w-5" />}
    variant="plain"
  >
    <span className="hidden sm:inline">Remove</span>
  </Button>
);

export default RemoveInputAction;
