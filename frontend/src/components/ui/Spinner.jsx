import { Loader2 } from "lucide-react";

const Spinner = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-2 text-muted-foreground animate-in fade-in">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

export default Spinner;
